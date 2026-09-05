# REPLENOVA — AI Supply Chain Intelligence & Replenishment Platform

> **Predict Disruptions. Prevent Stockouts. Replenish Intelligently.**

REPLENOVA is an enterprise-grade autonomous supply-chain intelligence and intelligent replenishment platform. It provides real-time multi-tier topology visibility, predictive risk scoring, disruption impact analysis (such as Cyclone Mandous, port berth closures, and highway roadblocks), scenario simulation sandboxes, and automated multi-echelon transfer order dispatch.

---

## 🚀 Deployment to GitHub Pages

This project is configured for automated deployment to GitHub Pages via **GitHub Actions**.

### 1. Repository Settings
1. Open your repository on GitHub: `https://github.com/kathir-star/replenova`
2. Navigate to **Settings → Pages**
3. Under **Build and deployment → Source**, select **GitHub Actions** (do not select `gh-pages` branch)

### 2. Automated Workflow
The workflow at `.github/workflows/deploy.yml` triggers on push to `main` or via manual `workflow_dispatch`:
- Checks out repository
- Installs dependencies using `npm ci`
- Builds production static distribution via `npm run build`
- Deploys automatically to `https://kathir-star.github.io/replenova/`

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript linter
npm run lint

# Build for production
npm run build
```

---

## 📦 Key Architectural Features

- **Dynamic Interactive Geographic Map**: Open-source Leaflet map tracking global tier-1/tier-2 suppliers, Indian regional warehouses, international port hubs, and sea lanes.
- **Cascading Disruption Impact Engine**: Visual multi-node chain tracking how external shocks propagate to lead time spikes, safety stock depletion, and assembly revenue risks.
- **Autonomous Replenishment Engine**: Actionable multi-echelon inventory transfer orders, alternate supplier dispatches, and risk reduction metrics.
- **Multi-Echelon Scenario Simulator**: Sandbox to test disruption durations, demand spikes, and buffer replenishment curves with 30-day projection charts.
- **AI Copilot & Autonomous Guardrails**: Context-aware assistant powered by Gemini API with deterministic fallback and supervised approval limits.
