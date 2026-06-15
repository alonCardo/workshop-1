/* Shared workshop form defaults and localStorage helpers */
const STORAGE_KEY = 'cursorWorkflowAnswers';
const DEFAULTS_LOADED_KEY = 'cursorWorkflowDefaultsLoaded';

const WORKSHOP_DEFAULTS = {
  stack: 'Embedded C firmware — Cardo_Products repo, QCC3095, Azure DevOps project Cardo',
  painPoints: 'Agent guesses ADO fields/repro steps, skips MCP fetch, mixes multiple WIs in one PR',
  repeatedWorkflow: 'Start ADO WI → investigate/fix → finish WI and open PR via ADO MCP',
  alwaysRules: 'C99/C11 only — no C++. snake_case with module prefix (bt_ic_, ic_sena_). 4-space indent, 150-col limit. Short functions, early exits. Macro-based logging with zero cost when disabled. Build to verify before considering a step done.',
  neverRules: 'Never use C++ features. Never make commits — user handles version control. Never modify ADK base code — extend via application only. Never edit auto-generated files — change the source or use the extension API.',
  filePatternRules: [
    { pattern: 'qcc3095/**/*.c, qcc3095/**/*.h', rule: 'FreeRTOS task/message patterns, CM library primitives, no ADK base modifications' },
    { pattern: 'src/ic/bt_intercom_*', rule: 'Rider validation (IS_RIDER_VALID), protocol adapter pattern, bt_ic_ prefix' },
  ],
  investigateSteps: [
    '1. Gather context — re-read symptom, git log, related files',
    '2. Map suspects — list files, symbols, callers involved',
    '3. Form hypotheses — ranked by likelihood, one sentence each',
    '4. Propose probes — log additions, assertions, debug steps only',
    '5. Avoid edits — do NOT change logic until evidence exists',
  ].join('\n'),
  reviewChecklist: [
    '1. Inspect the diff — understand intent before critiquing',
    '2. Classify risk — correctness, architecture, security, tests',
    '3. Check against .mdc rules — flag violations by file + line',
    '4. Suggest minimal actionable fixes only',
  ].join('\n'),
  customName: 'start-wi',
  customDesc: 'Fetch ADO WI via MCP, create apollo/<feature>/bug-<id>-<slug> branch, link to WI, baseline build',
};

const RECOMMENDED_CUSTOM_SKILL = {
  customName: WORKSHOP_DEFAULTS.customName,
  customDesc: WORKSHOP_DEFAULTS.customDesc,
};

function useRecommendedCustomSkill(fieldMap) {
  Object.entries(RECOMMENDED_CUSTOM_SKILL).forEach(([key, val]) => {
    saveField(key, val);
    const elId = fieldMap && fieldMap[key];
    if (elId) {
      const el = document.getElementById(elId);
      if (el) el.value = val;
    }
  });
  if (typeof updateFillIndicator === 'function') updateFillIndicator();
}

function getAnswers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function saveField(key, value) {
  const a = getAnswers();
  a[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
}

function getDefault(key) {
  const d = WORKSHOP_DEFAULTS[key];
  if (Array.isArray(d)) return d.slice();
  return d !== undefined ? d : '';
}

function useDefault(key, el) {
  const val = getDefault(key);
  const str = Array.isArray(val) ? JSON.stringify(val) : String(val);
  if (el) el.value = str;
  saveField(key, str);
  if (typeof updateFillIndicator === 'function') updateFillIndicator();
  if (key === 'filePatternRules' && typeof renderPatternRows === 'function') renderPatternRows();
}

function clearField(key, el) {
  if (el) el.value = '';
  saveField(key, '');
  if (typeof updateFillIndicator === 'function') updateFillIndicator();
  if (key === 'filePatternRules' && typeof renderPatternRows === 'function') renderPatternRows();
}

function fieldActionsHtml(key) {
  return `<div class="field-actions">
    <button type="button" class="btn-field-action" onclick="useDefault('${key}', document.getElementById(this.closest('.form-field').querySelector('[data-field]').id))">Use default</button>
    <button type="button" class="btn-field-action" onclick="clearField('${key}', document.getElementById(this.closest('.form-field').querySelector('[data-field]').id))">Clear</button>
  </div>`;
}

function initWorkshopFields(fieldMap, fillIndicatorFn) {
  const a = getAnswers();
  const firstVisit = !localStorage.getItem(DEFAULTS_LOADED_KEY);

  Object.entries(fieldMap).forEach(([key, elId]) => {
    const el = document.getElementById(elId);
    if (!el) return;
    if (a[key] !== undefined && a[key] !== '') {
      el.value = a[key];
    } else if (firstVisit && WORKSHOP_DEFAULTS[key] !== undefined) {
      const def = WORKSHOP_DEFAULTS[key];
      const str = Array.isArray(def) ? JSON.stringify(def) : String(def);
      el.value = str;
      saveField(key, str);
    }
  });

  if (firstVisit) localStorage.setItem(DEFAULTS_LOADED_KEY, 'true');
  if (fillIndicatorFn) fillIndicatorFn();
}

function toggleDrawerBase(drawerId, arrowId) {
  const open = document.getElementById(drawerId).classList.toggle('open');
  document.getElementById(arrowId).textContent = open ? '▼' : '▲';
  return open;
}
