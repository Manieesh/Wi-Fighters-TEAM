import React from "react";
import WorkflowHero from "../components/howItWorks/WorkflowHero";
import EndToEndFlowchart from "../components/howItWorks/EndToEndFlowchart";
import IntelligentEngineDetail from "../components/howItWorks/IntelligentEngineDetail";
import RealExampleAction from "../components/howItWorks/RealExampleAction";
import ServicesVisualization from "../components/howItWorks/ServicesVisualization";
import ConsentControlVisual from "../components/howItWorks/ConsentControlVisual";
import TrustLayerStrip from "../components/howItWorks/TrustLayerStrip";
import WorkflowFinalCta from "../components/howItWorks/WorkflowFinalCta";

export default function SystemArchitecture({ onNavigate }) {
  const handleScrollToJourney = () => {
    const el = document.getElementById("workflow-journey");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="how-it-works-master-container">
      {/* SECTION 1: HERO */}
      <WorkflowHero onExploreClick={handleScrollToJourney} />

      {/* SECTION 7: TRUST LAYER STRIP (Placed early to establish DPI credibility) */}
      <TrustLayerStrip />

      {/* SECTION 2: VISUAL END-TO-END FLOW (10 Connected Nodes) */}
      <EndToEndFlowchart />

      {/* SECTION 3: PROMETHEUS ENGINE VISUAL DETAIL (Compact Mini-Flow) */}
      <IntelligentEngineDetail />

      {/* SECTION 4: REAL-WORLD DATA TRANSLATION EXAMPLE */}
      <RealExampleAction />

      {/* SECTION 5: GOVERNMENT SERVICES TOPOLOGY */}
      <ServicesVisualization onNavigate={onNavigate} />

      {/* SECTION 6: CITIZEN CONSENT CONTROL VISUAL */}
      <ConsentControlVisual onNavigate={onNavigate} />

      {/* SECTION 8: FINAL CTA */}
      <WorkflowFinalCta onNavigate={onNavigate} />
    </div>
  );
}
