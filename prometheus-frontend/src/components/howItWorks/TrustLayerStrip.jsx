import React from "react";
import UiIcon from "../UiIcon";

export default function TrustLayerStrip() {
  const TRUST_ITEMS = [
    {
      id: "identity",
      title: "Identity Verification",
      desc: "Level-3 Sovereign e-KYC credentials",
      icon: "user"
    },
    {
      id: "consent",
      title: "Consent-Based Sharing",
      desc: "DPDP Act 2023 purpose-bound authorization",
      icon: "shield"
    },
    {
      id: "validation",
      title: "Data Validation",
      desc: "Automated schema integrity & type safety",
      icon: "badgeCheck"
    },
    {
      id: "audit",
      title: "Audit Trail",
      desc: "Append-only SHA-256 cryptographic lineage",
      icon: "lock"
    }
  ];

  return (
    <section className="trust-layer-strip-section" aria-label="Core security and trust pillars">
      <div className="trust-strip-inner">
        <div className="trust-strip-header">
          <UiIcon name="shield" size={16} className="text-cyan" />
          <span className="trust-strip-title">BUILT AROUND TRUST</span>
        </div>

        <div className="trust-items-grid">
          {TRUST_ITEMS.map((item) => (
            <div key={item.id} className="trust-item-card">
              <div className="trust-item-icon-bubble">
                <UiIcon name={item.icon} size={16} />
              </div>
              <div className="trust-item-info">
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
