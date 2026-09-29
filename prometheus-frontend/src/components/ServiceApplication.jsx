import { useEffect, useState } from "react";
import {
  getCitizenProfile,
  integrateApplication
} from "../services/api";
import UiIcon from "./UiIcon";

function ServiceApplication({ citizenId = "CITIZEN-1001" }) {
  const [selectedService, setSelectedService] = useState("rto");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoFilled, setAutoFilled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const services = {
    rto: {
      name: "Driving Licence",
      department: "Regional Transport Office",
      icon: "transport"
    },
    voter: {
      name: "Voter ID",
      department: "Election Department",
      icon: "identity"
    },
    welfare: {
      name: "Welfare Scheme",
      department: "Social Welfare Department",
      icon: "welfare"
    }
  };

  useEffect(() => {
    loadProfile();
  }, [citizenId]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await getCitizenProfile(citizenId);

      if (response.success && response.profile) {
        setProfile(response.profile);
      }
    } catch (error) {
      setMessage(
        "Citizen profile could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = () => {
    if (!profile) {
      setMessage("Please create your Citizen Profile first.");
      return;
    }

    setAutoFilled(true);
    setMessage(
      "Citizen profile loaded successfully."
    );
  };

  const buildCitizenData = () => {
    if (!profile) return {};

    return {
      fullName: profile.name,
      dateOfBirth: profile.dateOfBirth,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      pincode: profile.pincode,
      mobileNumber: profile.mobile,
      email: profile.email
    };
  };

  const getTranslatedData = () => {
    const data = buildCitizenData();

    if (selectedService === "rto") {
      return {
        applicantName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        residentialAddress: data.address,
        phoneNumber: data.mobileNumber,
        emailAddress: data.email,
        vehicleClass: "LMV"
      };
    }

    if (selectedService === "voter") {
      return {
        fullName: data.fullName,
        birthDate: data.dateOfBirth,
        addressDetails: data.address,
        contactNumber: data.mobileNumber
      };
    }

    return {
      beneficiaryName: data.fullName,
      residentialAddress: data.address,
      annualIncome: profile.income || "500000",
      contactNumber: data.mobileNumber
    };
  };

  const handleSubmit = async () => {
    if (!profile) {
      setMessage(
        "Citizen profile is required before applying."
      );
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");
      setResult(null);

      const response = await integrateApplication({
        citizenId,
        service: selectedService,
        citizenData: buildCitizenData()
      });

      if (response.success) {
        setResult(response);
        setMessage(
          "Application successfully routed through Prometheus."
        );
      } else {
        setMessage(
          response.message || "Application failed."
        );
      }
    } catch (error) {
      setMessage(
        error.message || "Application submission failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="application-section">
        <div className="application-loading">
          Loading Citizen Connect...
        </div>
      </section>
    );
  }

  const service = services[selectedService];

  return (
    <section className="application-section">

      {/* HEADER */}
      <div className="application-header">

        <div>
          <div className="section-label">
            SERVICE INTEGRATION
          </div>

          <h2>
            Apply Once.
            <span> Connected Everywhere.</span>
          </h2>

          <p>
            Prometheus securely transforms your Citizen
            Profile into the format required by each
            government department.
          </p>
        </div>

        <div className="integration-status">
          <span className="status-dot online"></span>
          INTEGRATION ENGINE ONLINE
        </div>

      </div>

      {/* SERVICE SELECTOR */}
      <div className="application-layout">

        <div className="service-selector">

          <div className="application-label">
            SELECT GOVERNMENT SERVICE
          </div>

          {Object.entries(services).map(
            ([id, item]) => (
              <button
                key={id}
                className={
                  selectedService === id
                    ? "service-option active"
                    : "service-option"
                }
                onClick={() => {
                  setSelectedService(id);
                  setAutoFilled(false);
                  setResult(null);
                  setMessage("");
                }}
              >
                <span className="service-option-icon">
                  {item.icon}
                </span>

                <span>
                  <strong>{item.name}</strong>
                  <small>{item.department}</small>
                </span>

                <span className="service-arrow">
                  →
                </span>
              </button>
            )
          )}

        </div>

        {/* APPLICATION PANEL */}
        <div className="application-card">

          <div className="application-card-header">

            <div className="selected-service-icon">
              <UiIcon name={service.icon} size={24} />
            </div>

            <div>
              <div className="application-label">
                APPLICATION
              </div>

              <h3>{service.name}</h3>

              <p>{service.department}</p>
            </div>

          </div>

          {/* PROFILE FOUND */}
          <div className="profile-found">

            <div className="profile-found-icon">
              ✓
            </div>

            <div>
              <strong>
                Citizen Connect Profile Found
              </strong>

              <span>
                {citizenId} · Verified
              </span>
            </div>

            <button
              onClick={handleAutoFill}
              className="autofill-btn"
            >
              {autoFilled
                ? "✓ PROFILE LOADED"
                : "AUTO-FILL PROFILE"}
            </button>

          </div>

          {/* FORM */}
          <div className="application-form">

            <div className="form-field">
              <label>FULL NAME</label>

              <input
                value={
                  autoFilled
                    ? profile?.name || ""
                    : ""
                }
                placeholder="Auto-filled from Citizen Profile"
                readOnly
              />
            </div>

            <div className="form-field">
              <label>DATE OF BIRTH</label>

              <input
                value={
                  autoFilled
                    ? profile?.dateOfBirth || ""
                    : ""
                }
                placeholder="Auto-filled from Citizen Profile"
                readOnly
              />
            </div>

            <div className="form-field full">
              <label>ADDRESS</label>

              <textarea
                value={
                  autoFilled
                    ? profile?.address || ""
                    : ""
                }
                placeholder="Auto-filled from Citizen Profile"
                rows="3"
                readOnly
              />
            </div>

            <div className="form-field">
              <label>MOBILE</label>

              <input
                value={
                  autoFilled
                    ? profile?.mobile || ""
                    : ""
                }
                placeholder="Auto-filled"
                readOnly
              />
            </div>

            <div className="form-field">
              <label>EMAIL</label>

              <input
                value={
                  autoFilled
                    ? profile?.email || ""
                    : ""
                }
                placeholder="Auto-filled"
                readOnly
              />
            </div>

          </div>

          {/* TRANSLATION ENGINE */}
          {autoFilled && (
            <div className="translation-engine">

              <div className="translation-header">

                <div>
                  <div className="application-label">
                    DATA TRANSLATION ENGINE
                  </div>

                  <h4>
                    Citizen Schema → Department Schema
                  </h4>
                </div>

                <span className="translation-live">
                  ● LIVE
                </span>

              </div>

              <div className="translation-flow">

                <div className="schema-box">

                  <span>
                    SOURCE
                  </span>

                  <strong>
                    Citizen Profile
                  </strong>

                  <code>
                    name<br />
                    dateOfBirth<br />
                    address<br />
                    mobile
                  </code>

                </div>

                <div className="translation-arrow">
                  <span>MAP</span>
                  →
                </div>

                <div className="schema-box destination">

                  <span>
                    DESTINATION
                  </span>

                  <strong>
                    {service.name}
                  </strong>

                  <code>
                    {selectedService === "rto" && (
                      <>
                        applicantName<br />
                        dateOfBirth<br />
                        residentialAddress<br />
                        phoneNumber
                      </>
                    )}

                    {selectedService === "voter" && (
                      <>
                        fullName<br />
                        birthDate<br />
                        addressDetails<br />
                        contactNumber
                      </>
                    )}

                    {selectedService === "welfare" && (
                      <>
                        beneficiaryName<br />
                        residentialAddress<br />
                        annualIncome<br />
                        contactNumber
                      </>
                    )}
                  </code>

                </div>

              </div>

              {/* JSON PREVIEW */}
              <div className="json-preview">

                <div className="json-preview-title">
                  TRANSLATED PAYLOAD
                </div>

                <pre>
{JSON.stringify(
  getTranslatedData(),
  null,
  2
)}
                </pre>

              </div>

            </div>
          )}

          {/* SUBMIT */}
          <div className="application-submit">

            <div>
              <strong>
                Ready to submit?
              </strong>

              <span>
                Your data will be validated,
                transformed and routed securely.
              </span>
            </div>

            <button
              className="submit-application-btn"
              onClick={handleSubmit}
              disabled={
                !autoFilled || submitting
              }
            >
              {submitting
                ? "ROUTING..."
                : "SUBMIT APPLICATION →"}
            </button>

          </div>

          {/* MESSAGE */}
          {message && (
            <div className="application-message">
              <span>✓</span>
              {message}
            </div>
          )}

          {/* RESULT */}
          {result && (
            <div className="application-result">

              <div className="result-success">
                ✓
              </div>

              <div>
                <div className="application-label">
                  APPLICATION CREATED
                </div>

                <h3>
                  {result.application?.applicationId ||
                    result.applicationId ||
                    "APPLICATION-SUBMITTED"}
                </h3>

                <p>
                  Your application has been successfully
                  routed to {service.department}.
                </p>

                <div className="result-meta">

                  <span>
                    SERVICE
                    <strong>
                      {service.name}
                    </strong>
                  </span>

                  <span>
                    STATUS
                    <strong>
                      SUBMITTED
                    </strong>
                  </span>

                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </section>
  );
}

export default ServiceApplication;
