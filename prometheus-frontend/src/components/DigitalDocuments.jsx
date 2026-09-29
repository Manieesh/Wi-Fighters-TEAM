import { useState } from "react";
import UiIcon from "./UiIcon";

export default function DigitalDocuments({ citizenId = "CITIZEN-1001" }) {
  const [documents, setDocuments] = useState([
    {
      id: "DOC-AADHAAR",
      name: "Aadhaar Card (UIDAI)",
      type: "Identity & Age Proof",
      issuer: "Unique Identification Authority of India",
      status: "VERIFIED",
      verifiedDate: "12 Aug 2024",
      docNumber: "XXXX-XXXX-8912",
      usedIn: ["Voter ID", "Driving Licence", "Welfare Schemes"],
      icon: "identity"
    },
    {
      id: "DOC-ADDRESS",
      name: "Proof of Address (Utility)",
      type: "Residential Proof",
      issuer: "TANGEDCO / Municipal Corporation",
      status: "VERIFIED",
      verifiedDate: "05 Jan 2025",
      docNumber: "EB-COIM-99214",
      usedIn: ["Voter ID", "Driving Licence", "Welfare Schemes"],
      icon: "home"
    },
    {
      id: "DOC-PHOTO",
      name: "Biometric Passport Photograph",
      type: "Photograph",
      issuer: "Citizen Digital Identity Vault",
      status: "VERIFIED",
      verifiedDate: "15 Jan 2025",
      docNumber: "BIO-2025-IMG",
      usedIn: ["Voter ID", "Driving Licence"],
      icon: "user"
    },
    {
      id: "DOC-INCOME",
      name: "Annual Income Certificate",
      type: "Income Proof",
      issuer: "Revenue & Disaster Management Dept",
      status: "VERIFIED",
      verifiedDate: "20 May 2025",
      docNumber: "REV-INC-2025-0819",
      usedIn: ["Welfare Schemes"],
      icon: "document"
    },
    {
      id: "DOC-AGE",
      name: "Birth / Secondary School Certificate",
      type: "Age Proof",
      issuer: "State Board of Secondary Education",
      status: "VERIFIED",
      verifiedDate: "10 Jun 2020",
      docNumber: "MATRIC-TN-54210",
      usedIn: ["Voter ID", "Driving Licence"],
      icon: "document"
    }
  ]);

  const [message, setMessage] = useState("");

  const handleSimulateSync = () => {
    setMessage("Syncing digital documents from DigiLocker & National Vault...");
    setTimeout(() => {
      setMessage("All 5 digital documents successfully synced and verified.");
    }, 900);
  };

  return (
    <div className="digital-documents-container">
      {/* Header */}
      <div className="documents-header">
        <div>
          <div className="gateway-badge">
            <span className="pulse-dot"></span> DigiLocker & State Vault Integrated
          </div>
          <h2>Digital Document Locker</h2>
          <p>
            Upload or verify documents once in your Prometheus locker. Connected portals securely
            reference verified credentials without asking you to repeatedly scan or upload PDFs.
          </p>
        </div>

        <button className="sync-docs-btn" onClick={handleSimulateSync}>
          <><UiIcon name="refresh" size={15} /> Sync DigiLocker</>
        </button>
      </div>

      {message && <div className="gateway-notification">{message}</div>}

      {/* Document Grid */}
      <div className="doc-grid">
        {documents.map((doc) => (
          <div key={doc.id} className="doc-card">
            <div className="doc-top-row">
              <span className="doc-icon"><UiIcon name={doc.icon} size={20} /></span>
              <span className="verified-badge-pill">
                <UiIcon name="check" size={13} /> {doc.status}
              </span>
            </div>

            <h4>{doc.name}</h4>
            <div className="doc-type-text">{doc.type}</div>
            <div className="doc-meta-item">
              <span className="meta-label">Issuer:</span> {doc.issuer}
            </div>
            <div className="doc-meta-item">
              <span className="meta-label">Identifier:</span> <code>{doc.docNumber}</code>
            </div>
            <div className="doc-meta-item">
              <span className="meta-label">Verified On:</span> {doc.verifiedDate}
            </div>

            <div className="usable-services-box">
              <div className="usable-label">Reusable Across Services:</div>
              <div className="usable-tags">
                {doc.usedIn.map((svc) => (
                  <span key={svc} className="usable-tag">
                    {svc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
