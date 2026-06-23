# Azure Clippy ☁️

> Step-by-step guidance for Azure Portal — free, open source, community-driven.

Azure Clippy is a Chrome/Edge extension that guides you through Azure Portal. Click a workflow and the extension highlights exactly which element to click — including an explanation of what it is and why you need it.

---

## Install

### Option 1: Download (recommended)
1. Download the latest `.zip` from the [Releases page](../../releases)
2. Extract to a folder
3. Open Edge: `edge://extensions` or Chrome: `chrome://extensions`
4. Enable **Developer mode** (top right)
5. Click **Load unpacked** and select the extracted `extension/` folder

### Option 2: From source
```bash
git clone https://github.com/enginsoysal/azure-clippy.git
```
Then load the `extension/` folder via Load unpacked (steps 3–5 above).

---

## How it works

1. Navigate to [portal.azure.com](https://portal.azure.com)
2. Click the Azure Clippy icon in your browser toolbar
3. Search or pick a workflow (e.g. "Create a Virtual Machine")
4. Follow the step-by-step highlights in the portal

Clippy also appears as a character in the bottom-right corner of the portal, offering tips and quick access to workflows.

The extension fetches workflow definitions live from this GitHub repo — no server, no costs.

---

## Available workflows

| Category | Workflows |
|---|---|
| Compute | Create a Virtual Machine, Create a VM Scale Set |
| Networking | Create a Virtual Network, Create a Network Security Group, Create a Load Balancer |
| Storage | Create a Storage Account, Create a Blob Container |
| App Services | Create an App Service, Create an App Service Plan |
| Containers | Create an AKS Cluster, Create a Container Instance, Create a Container Registry |
| Identity | Create an App Registration, Assign an RBAC Role |
| Databases | Create a SQL Database, Create a Cosmos DB |

---

## Contributing

Missing a workflow? Found a broken selector after an Azure Portal update?

### Add a new workflow
1. Fork this repo
2. Create a new JSON file in the appropriate folder under `workflows/`
3. Add an entry to `workflows/index.json`
4. Submit a Pull Request

### Workflow template
```json
{
  "id": "category/workflow-name",
  "title": "Human-readable title",
  "version": "1.0.0",
  "lastVerified": "2026-06-23",
  "startUrl": "https://portal.azure.com/#create/...",
  "steps": [
    {
      "id": "step-id",
      "selector": "[aria-label='...']",
      "fallbackSelector": "[data-telemetryid='...']",
      "title": "Step title",
      "explanation": "Explanation of what this is and why you need it."
    }
  ]
}
```

### Selector tips
- Always use `aria-label` as the primary selector — most stable
- `data-telemetryid` as fallback — Microsoft's own attribute, relatively stable
- Never use generated CSS class names — they change with every portal update

---

## Weekly health check

Every Monday at 07:00 UTC, GitHub Actions validates all workflow JSON files automatically. If a workflow is broken or malformed, an issue is created automatically.

[![Health Check](../../actions/workflows/health-check.yml/badge.svg)](../../actions/workflows/health-check.yml)

---

## License

MIT — free to use and modify, including for commercial purposes.
