import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "REPLENOVA AI Control Tower",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// AI Copilot Endpoint
app.post("/api/copilot", async (req, res) => {
  const { question, context } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  const ai = getAIClient();
  if (ai) {
    try {
      const prompt = `You are REPLENOVA COPILOT, an advanced enterprise supply-chain intelligence assistant.
User Question: "${question}"

Current Real-time Context:
- Network Inventory Risk: ${context?.inventoryRisk ?? "21.7% (Critical)"}
- Active Disruptions: ${context?.activeDisruptions ?? "7 (3 Critical, Primary: Cyclone Mandous & Chennai Port dwell +4.8 days)"}
- Highest Exposed SKU: MCU-X1 (Stockout in 6 days, Demand: 620/day, Current Stock: 4,200, Exposure: ₹68.4L)
- Affected Suppliers: IndoSilicon Tech (Chennai), Pacific Micro (Singapore), Malacca Fab Works (Malaysia)
- Warehouses impacted: Chennai Central Hub (Risk 88), Bengaluru Electronics Depot (Risk 54)
- AI Recommended Mitigation: Activate Alternate Supplier Bharat Dynamics (Bangalore) via Air Freight for 2,500 units + Reallocate 1,200 units from Mumbai Gateway to Chennai. Expected Risk Reduction: 84%, Potential Loss Avoided: ₹54.2L.

Respond in an authoritative, concise, enterprise SaaS supply-chain tone.
Provide:
1. Direct Explanation of what is happening in the real world
2. Concrete quantitative metrics (SKUs, days, financial exposure in ₹ Lakhs)
3. Specific actionable mitigation recommendations with risk reduction percentage.
Avoid generic AI fluff. Be technical, crisp, and actionable.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt
      });

      const replyText = response.text ?? "";
      return res.json({
        reply: replyText,
        source: "gemini-3.8-flash"
      });
    } catch (err: any) {
      console.warn("Gemini API call failed, using deterministic fallback:", err?.message);
    }
  }

  // Deterministic enterprise supply-chain engine fallback
  const q = question.toLowerCase();
  let fallbackReply = "";

  if (q.includes("why") || q.includes("risk increasing") || q.includes("reason")) {
    fallbackReply = `### Root Cause Analysis: Inventory Risk Escalation to 21.7%
The 4.2% jump in network inventory risk is driven by external weather disruption **Cyclone Mandous** in the Bay of Bengal, which triggered a +4.8 day container dwell spike at **Chennai Port**.

**Impact Dynamics:**
* **Corridor Congestion:** Ocean container traffic from Singapore and Malaysia held in outer anchorages.
* **Lead Time Drift:** Dynamic transit lead times surged from **5 days → 9 days**.
* **Key Exposed Node:** **Chennai Central Hub** is absorbing 68% of the risk, with safety stock burn rates exceeding replenishment velocity.
* **Recommended Action:** Execute inter-warehouse transfer of 1,200 units from Mumbai Gateway and initiate emergency air freight PO with domestic partner Bharat Dynamics.`;
  } else if (q.includes("product") || q.includes("exposed") || q.includes("sku")) {
    fallbackReply = `### Critical Product Exposure Assessment
Top exposed SKUs across the network based on Days of Supply vs. Predicted Lead Time:

1. **MCU-X1 (Automotive 32-Bit Microcontroller IC)**
   * Current Stock: 4,200 | Burn: 620/day | Days of Supply: 6.8d
   * Predicted Lead Time: 9d | Stockout: **6 days (87% prob)**
   * Revenue at Risk: **₹68.4L**
2. **SNS-OPT3 (OptoSensor Gen3 LiDAR Array)**
   * Days of Supply: 6.4d | Predicted Lead Time: 13d | Stockout: **6 days (82% prob)**
   * Revenue at Risk: **₹51.8L**
3. **SOM-CORTEX (ARM Cortex-A53 Compute Module)**
   * Days of Supply: 6.8d | Predicted Lead Time: 14d | Stockout: **6 days (84% prob)**
   * Revenue at Risk: **₹57.6L**

**Mitigation:** Expedite air freight consignment and reallocate regional buffers immediately.`;
  } else if (q.includes("supplier") || q.includes("risky") || q.includes("vendor")) {
    fallbackReply = `### Supplier Vulnerability Ranking
The highest risk suppliers currently active in the network:

1. **IndoSilicon Tech (Chennai SEZ)**
   * Current Risk: **CRITICAL** | Exposure: **₹12.4L** | Active Shipments: 8
   * Factor: Proximity to Coromandel cyclone surge and coastal logistics roadblocks.
2. **Pacific Micro Components (Singapore)**
   * Current Risk: **CRITICAL** | Exposure: **₹14.2L** | Active Shipments: 7
   * Factor: Feeder vessels queued in Bay of Bengal maritime bottleneck.
3. **Malacca Fab Works (Penang, Malaysia)**
   * Current Risk: **CRITICAL** | Exposure: **₹8.9L** | Active Shipments: 5

**Alternative Supplier Available:** Bharat Dynamics Sensors (Bangalore) with 98% reliability and 3.1-day domestic transit runway.`;
  } else if (q.includes("chennai") || q.includes("port close") || q.includes("7 days")) {
    fallbackReply = `### Simulation: Chennai Port 7-Day Closure Impact
Running predictive shock modeling on a 7-day berth shutdown:

* **Without Intervention:**
  - 38 container shipments stranded
  - 74 SKUs impacted across automotive & industrial lines
  - 21 potential stockout events
  - **₹68.4L immediate revenue exposure** with 81% stockout probability.
* **With REPLENOVA Automated Mitigation:**
  - Emergency activation of domestic alternate supplier (Bharat Dynamics)
  - Inter-facility re-routing: 1,200 units transferred from Mumbai Gateway via express rail
  - Air freight reroute: 2,500 units expedited from secondary depots
  - Stockout probability collapses to **17%**
  - **Potential Loss Avoided: ₹54.2L** (Net savings: ₹53.84L after transit surcharge).`;
  } else if (q.includes("revenue") || q.includes("lose") || q.includes("financial")) {
    fallbackReply = `### Financial Risk Exposure Dashboard
* **Total Network Inventory at Risk:** **₹42.8L** (Network-wide baseline exposure)
* **Primary Cyclone Disruption Exposure:** **₹68.4L** across critical automotive OEM contracts
* **Customer Penalty Clauses:** ₹18.2L in delay liquidated damages
* **Potential Loss Avoided via AI Recommendations:** **₹54.2L**
* **Intervention Cost:** ₹21,600 (Air freight + inter-facility dispatch)
* **ROI on Replenishment Intervention:** **250x**.`;
  } else if (q.includes("replenish") || q.includes("action") || q.includes("what should we do")) {
    fallbackReply = `### High-Priority Replenishment Orders Recommended Today

1. **PO #REC-01 for SKU MCU-X1**
   * Action: Order 2,500 units from **Bharat Dynamics Sensors (Bangalore)** via Air Freight
   * Lead Time: 3 days (vs 9 days via sea)
   * Cost: ₹21,600 | Risk Drop: 87% → 13%
2. **Transfer #TR-08 for SKU SNS-OPT3**
   * Action: Reallocate 800 units from Bengaluru Electronics Depot to Chennai Central Hub
   * Transit: Dedicated Road Express (14 hrs)
   * Cost: ₹8,400 | Risk Drop: 82% → 16%
3. **PO #REC-03 for SKU BAT-LP45**
   * Action: Priority Sea direct stevedoring clearance at Colombo anchorage
   * Cost: ₹14,500 | Risk Drop: 74% → 21%.`;
  } else {
    fallbackReply = `### REPLENOVA Supply Chain Intelligence Summary
Network status is currently under **Elevated Risk (21.7%)** triggered by maritime congestion around the Bay of Bengal and Chennai Port.

* **14 SKUs** are currently facing stockout threats within 6 to 8 days.
* Primary bottleneck is SKU **MCU-X1** with 6 days of remaining supply at 620 units/day.
* REPLENOVA recommends immediate execution of **Action ACT-1**: Air freight order of 2,500 units with domestic partner Bharat Dynamics and inter-warehouse stock transfer from Mumbai Gateway.
* This intervention protects **₹54.2L** in revenue and reduces stockout probability from 87% to 13%.`;
  }

  return res.json({
    reply: fallbackReply,
    source: "replenova-deterministic-risk-engine"
  });
});

// Custom Disruption Analysis Endpoint
app.post("/api/analyze-disruption", async (req, res) => {
  const { title, location, category, severity } = req.body;
  const ai = getAIClient();

  if (ai) {
    try {
      const prompt = `Analyze this supply chain disruption for REPLENOVA:
Title: ${title}
Location: ${location}
Category: ${category}
Severity: ${severity}

Return a valid JSON object with:
{
  "estimatedDelayDays": "+3-5 days",
  "affectedSuppliersCount": 3,
  "affectedShipmentsCount": 12,
  "affectedSkusCount": 24,
  "revenueExposureInr": 4500000,
  "summary": "Brief summary",
  "keyRecommendation": "Recommended mitigation step"
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const parsed = JSON.parse(response.text ?? "{}");
      return res.json(parsed);
    } catch (err: any) {
      console.warn("Disruption analysis AI fallback:", err?.message);
    }
  }

  // Deterministic fallback
  return res.json({
    estimatedDelayDays: severity === "critical" ? "+4–6 days" : "+2–3 days",
    affectedSuppliersCount: severity === "critical" ? 4 : 2,
    affectedShipmentsCount: severity === "critical" ? 16 : 6,
    affectedSkusCount: severity === "critical" ? 31 : 12,
    revenueExposureInr: severity === "critical" ? 5800000 : 1900000,
    summary: `Disruption in ${location} detected. Transit schedules adjusted dynamically with buffer protections.`,
    keyRecommendation: "Activate secondary domestic supplier and reroute air shipments to unblock assembly lines."
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`REPLENOVA Enterprise Control Tower running on port ${PORT}`);
  });
}

startServer();
