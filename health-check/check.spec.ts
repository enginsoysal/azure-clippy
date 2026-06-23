import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const WORKFLOWS_DIR = path.join(__dirname, '../workflows');
const INDEX_PATH = path.join(WORKFLOWS_DIR, 'index.json');

interface WorkflowEntry {
  id: string;
  title: string;
  category: string;
  tags: string[];
}

interface WorkflowStep {
  id: string;
  title: string;
  selector: string;
  fallbackSelector?: string;
  explanation: string;
}

interface Workflow {
  id: string;
  title: string;
  version: string;
  lastVerified: string;
  startUrl: string;
  steps: WorkflowStep[];
}

function loadIndex(): WorkflowEntry[] {
  const raw = fs.readFileSync(INDEX_PATH, 'utf8');
  return JSON.parse(raw).workflows;
}

function loadWorkflow(id: string): Workflow {
  const filePath = path.join(WORKFLOWS_DIR, `${id}.json`);
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function isValidCssSelector(selector: string): boolean {
  // Basic check: non-empty, starts with a valid CSS selector character
  if (!selector || selector.trim().length === 0) return false;
  try {
    // Use a simple heuristic — full DOM parsing not available in Node
    const valid = /^[\[\.#a-zA-Z\*]/.test(selector.trim());
    return valid;
  } catch {
    return false;
  }
}

// ── Test 1: index.json is valid ────────────────────────────────────────────
test('index.json is valid and has required fields', () => {
  expect(fs.existsSync(INDEX_PATH), 'index.json must exist').toBe(true);

  const raw = fs.readFileSync(INDEX_PATH, 'utf8');
  const index = JSON.parse(raw);

  expect(index.version, 'index.json must have a version').toBeTruthy();
  expect(index.updated, 'index.json must have an updated date').toBeTruthy();
  expect(Array.isArray(index.workflows), 'workflows must be an array').toBe(true);
  expect(index.workflows.length, 'must have at least 1 workflow').toBeGreaterThan(0);

  for (const entry of index.workflows as WorkflowEntry[]) {
    expect(entry.id,       `Entry missing id: ${JSON.stringify(entry)}`).toBeTruthy();
    expect(entry.title,    `Entry "${entry.id}" missing title`).toBeTruthy();
    expect(entry.category, `Entry "${entry.id}" missing category`).toBeTruthy();
    expect(Array.isArray(entry.tags), `Entry "${entry.id}" tags must be an array`).toBe(true);
  }
});

// ── Test 2: every index entry has a matching JSON file ─────────────────────
test('every workflow in index.json has a corresponding JSON file', () => {
  const entries = loadIndex();
  const missing: string[] = [];

  for (const entry of entries) {
    const filePath = path.join(WORKFLOWS_DIR, `${entry.id}.json`);
    if (!fs.existsSync(filePath)) missing.push(entry.id);
  }

  expect(
    missing,
    `Missing workflow files:\n${missing.join('\n')}`
  ).toHaveLength(0);
});

// ── Test 3: no orphan JSON files (file exists but not in index) ────────────
test('no orphan workflow files (every JSON file is listed in index.json)', () => {
  const entries = loadIndex();
  const indexedIds = new Set(entries.map(e => e.id));
  const orphans: string[] = [];

  function scanDir(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'index.json') continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.json')) {
        const rel = path.relative(WORKFLOWS_DIR, fullPath).replace(/\\/g, '/').replace('.json', '');
        if (!indexedIds.has(rel)) orphans.push(rel);
      }
    }
  }

  scanDir(WORKFLOWS_DIR);
  expect(orphans, `Orphan workflow files not in index.json:\n${orphans.join('\n')}`).toHaveLength(0);
});

// ── Test 4: per-workflow structural validation ─────────────────────────────
const entries = loadIndex();

for (const entry of entries) {
  const filePath = path.join(WORKFLOWS_DIR, `${entry.id}.json`);
  if (!fs.existsSync(filePath)) continue;

  test(`[${entry.category}] ${entry.title} — structure valid`, () => {
    const wf = loadWorkflow(entry.id);

    // Top-level fields
    expect(wf.id,           `"${entry.id}": missing id`).toBeTruthy();
    expect(wf.title,        `"${entry.id}": missing title`).toBeTruthy();
    expect(wf.version,      `"${entry.id}": missing version`).toBeTruthy();
    expect(wf.lastVerified, `"${entry.id}": missing lastVerified`).toBeTruthy();
    expect(wf.startUrl,     `"${entry.id}": missing startUrl`).toBeTruthy();
    expect(Array.isArray(wf.steps), `"${entry.id}": steps must be an array`).toBe(true);
    expect(wf.steps.length, `"${entry.id}": must have at least 1 step`).toBeGreaterThan(0);

    // startUrl must point to Azure Portal
    expect(
      wf.startUrl.startsWith('https://portal.azure.com'),
      `"${entry.id}": startUrl must start with https://portal.azure.com`
    ).toBe(true);

    // id in file must match index
    expect(wf.id, `"${entry.id}": id field must match the file path`).toBe(entry.id);

    // Per-step validation
    for (const step of wf.steps) {
      expect(step.id,          `"${entry.id}" step missing id`).toBeTruthy();
      expect(step.title,       `"${entry.id}/${step.id}": missing title`).toBeTruthy();
      expect(step.explanation, `"${entry.id}/${step.id}": missing explanation`).toBeTruthy();
      expect(step.selector,    `"${entry.id}/${step.id}": missing selector`).toBeTruthy();

      expect(
        isValidCssSelector(step.selector),
        `"${entry.id}/${step.id}": invalid primary selector: "${step.selector}"`
      ).toBe(true);

      if (step.fallbackSelector) {
        expect(
          isValidCssSelector(step.fallbackSelector),
          `"${entry.id}/${step.id}": invalid fallbackSelector: "${step.fallbackSelector}"`
        ).toBe(true);
      }
    }
  });
}
