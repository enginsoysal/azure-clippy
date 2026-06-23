import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface WorkflowEntry {
  id: string;
  title: string;
  category: string;
}

interface WorkflowStep {
  id: string;
  title: string;
  selector: string;
  fallbackSelector?: string;
}

interface Workflow {
  id: string;
  title: string;
  startUrl: string;
  steps: WorkflowStep[];
}

const indexPath = path.join(__dirname, '../workflows/index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const workflowEntries: WorkflowEntry[] = index.workflows;

async function login(page: Page) {
  const user = process.env.AZURE_USER;
  const pass = process.env.AZURE_PASS;
  if (!user || !pass) {
    throw new Error('AZURE_USER and AZURE_PASS environment variables are required');
  }

  await page.goto('https://portal.azure.com');
  await page.fill('[name="loginfmt"]', user);
  await page.click('[type="submit"]');
  await page.fill('[name="passwd"]', pass);
  await page.click('[type="submit"]');

  const staySignedIn = page.locator('[id="idBtn_Back"]');
  if (await staySignedIn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await staySignedIn.click();
  }

  await page.waitForURL('**/portal.azure.com/**', { timeout: 20_000 });
}

async function elementVisible(page: Page, selectors: string[]): Promise<boolean> {
  for (const sel of selectors.filter(Boolean)) {
    try {
      if (await page.locator(sel).first().isVisible({ timeout: 8_000 })) return true;
    } catch {
      // try next selector
    }
  }
  return false;
}

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await login(page);
  await context.storageState({ path: 'auth.json' });
  await context.close();
});

for (const entry of workflowEntries) {
  test(`[${entry.category}] ${entry.title}`, async ({ page }) => {
    const wfPath = path.join(__dirname, `../workflows/${entry.id}.json`);

    if (!fs.existsSync(wfPath)) {
      test.skip(true, `Workflow file not found: ${wfPath}`);
      return;
    }

    const workflow: Workflow = JSON.parse(fs.readFileSync(wfPath, 'utf8'));

    await page.goto(workflow.startUrl, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await page.waitForTimeout(3000);

    const failures: string[] = [];

    for (const step of workflow.steps) {
      const selectors = [step.selector, step.fallbackSelector].filter(Boolean) as string[];
      const found = await elementVisible(page, selectors);
      if (!found) {
        failures.push(`Step "${step.title}" (${step.id}): no selector matched — ${selectors.join(', ')}`);
      }
    }

    if (failures.length > 0) {
      throw new Error(
        `Workflow "${workflow.title}" has ${failures.length} broken step(s):\n${failures.join('\n')}`
      );
    }
  });
}
