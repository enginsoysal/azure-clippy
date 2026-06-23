# Azure Clippy ☁️

> Stap-voor-stap begeleiding in Azure Portal — gratis, open source, community-driven.

Azure Clippy is een Chrome/Edge-extensie die je door Azure Portal heen loodst. Klik op een workflow, en de extensie markeert exact welk element je moet aanklikken — inclusief uitleg over wat iets is en waarom je het nodig hebt.

---

## Installeren

### Optie 1: Download (aanbevolen)
1. Download de nieuwste `.zip` van de [Releases-pagina](../../releases)
2. Pak uit naar een map
3. Open Edge via `edge://extensions` of Chrome via `chrome://extensions`
4. Zet **Developer mode** aan (rechtsboven)
5. Klik **Load unpacked** en selecteer de uitgepakte `extension/` map

### Optie 2: Vanuit broncode
```bash
git clone https://github.com/enginsoysal/azure-clippy.git
```
Laad dan de `extension/` map via Load unpacked (zie stap 3-5 hierboven).

---

## Hoe werkt het?

1. Navigeer naar [portal.azure.com](https://portal.azure.com)
2. Klik op het Azure Clippy-icoon in je browser
3. Zoek of kies een workflow (bijv. "Virtual Machine aanmaken")
4. Volg de stap-voor-stap begeleiding in de portal

De extensie haalt de workflow-definities live op van deze GitHub-repo — geen server, geen kosten.

---

## Beschikbare workflows

| Categorie | Workflow |
|---|---|
| Compute | Virtual Machine aanmaken, VM Scale Set aanmaken |
| Networking | Virtual Network aanmaken, NSG aanmaken, Load Balancer aanmaken |
| Storage | Storage Account aanmaken, Blob Container aanmaken |
| App Services | App Service aanmaken, App Service Plan aanmaken |
| Containers | AKS Cluster aanmaken, Container Instance aanmaken, Container Registry aanmaken |
| Identity | App Registration aanmaken, RBAC-rol toewijzen |
| Databases | SQL Database aanmaken, Cosmos DB aanmaken |

---

## Bijdragen

Zie je een ontbrekende workflow? Of is een selector gebroken na een Azure Portal-update?

### Nieuwe workflow toevoegen
1. Fork deze repo
2. Maak een nieuw JSON-bestand in de juiste map onder `workflows/`
3. Voeg een entry toe aan `workflows/index.json`
4. Submit een Pull Request

### Workflow-sjabloon
```json
{
  "id": "categorie/workflow-naam",
  "title": "Leesbare naam",
  "version": "1.0.0",
  "lastVerified": "2026-06-23",
  "startUrl": "https://portal.azure.com/#create/...",
  "steps": [
    {
      "id": "stap-id",
      "selector": "[aria-label='...']",
      "fallbackSelector": "[data-telemetryid='...']",
      "title": "Staptitel",
      "explanation": "Uitleg over wat dit is en waarom je het nodig hebt."
    }
  ]
}
```

**Selector-tips:**
- Gebruik altijd `aria-label` als primaire selector (stabielst)
- `data-telemetryid` als fallback (Microsoft's eigen attribuut)
- Nooit gegenereerde CSS class names — die veranderen bij elke portal-update

---

## Wekelijkse health check

Elke maandag test GitHub Actions automatisch of alle selectors nog werken door Playwright op portal.azure.com te draaien. Bij een gebroken selector wordt automatisch een issue aangemaakt.

[![Health Check](../../actions/workflows/health-check.yml/badge.svg)](../../actions/workflows/health-check.yml)

---

## Licentie

MIT — gebruik en aanpassen vrij, ook voor commerciële doeleinden.
