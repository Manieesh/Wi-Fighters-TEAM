import { useState, useMemo } from "react";
import UiIcon from "../components/UiIcon";
import ServiceCard from "../components/ServiceCard";
import { availableServices, comingSoonServices, allServices } from "../services/catalog";

export default function Services({
  onViewService,
  initialSearch = "",
  t
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { id: "All", label: t?.("services.categories.All") || "All Services", icon: "document" },
    { id: "Available", label: `${t?.("services.availableNow") || "Available Now"} (3)`, icon: "check" },
    { id: "Identity", label: t?.("services.categories.Identity") || "Identity", icon: "identity" },
    { id: "Transport", label: t?.("services.categories.Transport") || "Transport", icon: "transport" },
    { id: "Welfare", label: t?.("services.categories.Welfare") || "Welfare", icon: "welfare" },
    { id: "Certificates", label: t?.("services.categories.Certificates") || "Certificates", icon: "document" },
    { id: "Other", label: t?.("services.categories.Other") || "Other Services", icon: "folder" }
  ];

  const filteredServices = useMemo(() => {
    return allServices.filter((service) => {
      const matchSearch =
        !searchTerm ||
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.organization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === "All" ||
        (selectedCategory === "Available" && service.status === "available") ||
        service.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [searchTerm, selectedCategory]);

  const availableFiltered = useMemo(() => {
    return filteredServices.filter((s) => s.status === "available");
  }, [filteredServices]);

  const comingSoonFiltered = useMemo(() => {
    return filteredServices.filter((s) => s.status === "coming-soon");
  }, [filteredServices]);

  return (
    <div className="services-page-wrap">
      {/* Header */}
      <div className="page-header-block">
        <span className="page-eyebrow">PUBLIC SERVICE CATALOG</span>
        <h1 className="page-main-title">
          {t?.("services.title") || "Government Services"}
        </h1>
        <p className="page-lead-text">
          {t?.("services.subtitle") ||
            "Access essential digital public services with single-click profile verification."}
        </p>
      </div>

      {/* Search Bar */}
      <div className="services-search-container">
        <div className="unified-search-bar" role="search">
          <UiIcon name="search" size={18} className="search-icon" />
          <input
            type="text"
            placeholder={
              t?.("services.searchPlaceholder") ||
              "Search services by name, keyword, or government department..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search government services"
          />
          {searchTerm && (
            <button
              className="btn-clear-search"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search query"
            >
              <UiIcon name="close" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="category-chips-row" role="tablist" aria-label="Service categories">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              className={`cat-chip-btn ${isActive ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <UiIcon name={cat.icon} size={14} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Results Count & Filter Reset */}
      <div className="results-info-row">
        <span>
          Showing <strong>{filteredServices.length}</strong> {filteredServices.length === 1 ? "service" : "services"}
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </span>
        {(searchTerm || selectedCategory !== "All") && (
          <button
            className="text-reset-btn"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Available Now Services Section */}
      {availableFiltered.length > 0 && (
        <section className="services-group-section" aria-labelledby="available-services-heading">
          <div className="group-heading-row">
            <div>
              <span className="section-eyebrow">INTEGRATED SERVICES</span>
              <h2 id="available-services-heading" className="group-title">
                {t?.("services.availableNow") || "Available Now"} ({availableFiltered.length})
              </h2>
              <p className="group-subtitle">
                {t?.("services.availableNowDesc") ||
                  "Connected portals ready for immediate application and profile pre-fill."}
              </p>
            </div>
            <span className="group-badge-available">
              <span className="dot-available-pulse" />
              <span>{t?.("services.availableNow") || "Available Now"}</span>
            </span>
          </div>

          <div className="services-cards-grid">
            {availableFiltered.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onView={onViewService}
                t={t}
              />
            ))}
          </div>
        </section>
      )}

      {/* Coming Soon Services Section */}
      {comingSoonFiltered.length > 0 && (
        <section className="services-group-section coming-soon-group" aria-labelledby="coming-soon-heading">
          <div className="group-heading-row">
            <div>
              <span className="section-eyebrow">UNDER INTEGRATION</span>
              <h2 id="coming-soon-heading" className="group-title">
                {t?.("services.comingSoon") || "Coming Soon"} ({comingSoonFiltered.length})
              </h2>
              <p className="group-subtitle">
                {t?.("services.comingSoonDesc") ||
                  "Departmental connectors under technical evaluation. These services will launch soon."}
              </p>
            </div>
            <span className="group-badge-coming-soon">
              {t?.("services.comingSoon") || "Coming Soon"}
            </span>
          </div>

          <div className="services-cards-grid">
            {comingSoonFiltered.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onView={() => {}}
                t={t}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="no-services-placeholder">
          <div className="placeholder-icon">
            <UiIcon name="search" size={32} />
          </div>
          <h3>{t?.("services.noResults") || "No services found"}</h3>
          <p>We couldn't find any services matching your search criteria. Try a different keyword or reset filters.</p>
          <button
            className="gov-btn secondary"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}
          >
            {t?.("services.categories.All") || "View all services"}
          </button>
        </div>
      )}
    </div>
  );
}
