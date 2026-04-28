import React, { useState, useEffect } from "react";
import { useStudent } from "../../context/StudentContext";
import {
  organisationTypes,
  remunerationTypes,
  intakeCohorts,
} from "../../data/dashboardData";
import { validatePlacementApplication } from "../../services/studentFormService";
import "./StudentFormStyles.css";

export default function PlacementApplicationModal({
  placement,
  onClose,
  onSubmit,
}) {
  const { placementDraft, savePlacementDraft, clearPlacementDraft } =
    useStudent();

  const EMPTY_FORM = {
    organisationName: "",
    organisationType: "",
    organisationDistrict: "",
    organisationAddress: "",
    department: "",
    wpSupervisorName: "",
    wpSupervisorEmail: "",
    wpSupervisorPhone: "",
    wpSupervisorTitle: "",
    startDate: "",
    endDate: "",
    intakeCohort: "",
    remunerationType: "unpaid",
    placementFee: "",
    requestLetter: null,
    acceptanceLetter: null,
  };

  const toFormPlacement = (source = {}) => ({
    ...EMPTY_FORM,
    organisationName: source.organisationName ?? source.organisation_name ?? "",
    organisationType: source.organisationType ?? source.organisation_type ?? "",
    organisationDistrict:
      source.organisationDistrict ?? source.organisation_district ?? "",
    organisationAddress:
      source.organisationAddress ?? source.organisation_address ?? "",
    department: source.department ?? "",
    wpSupervisorName:
      source.wpSupervisorName ?? source.wp_supervisor_name ?? "",
    wpSupervisorEmail:
      source.wpSupervisorEmail ?? source.wp_supervisor_email ?? "",
    wpSupervisorPhone:
      source.wpSupervisorPhone ?? source.wp_supervisor_phone ?? "",
    wpSupervisorTitle:
      source.wpSupervisorTitle ?? source.wp_supervisor_title ?? "",
    startDate: source.startDate ?? source.start_date ?? "",
    endDate: source.endDate ?? source.end_date ?? "",
    intakeCohort: source.intakeCohort ?? source.intake_cohort ?? "",
    remunerationType:
      source.remunerationType ?? source.remuneration_type ?? "unpaid",
    placementFee: source.placementFee ?? source.placement_fee ?? "",
    requestLetter: source.requestLetter ?? source.request_letter ?? null,
    acceptanceLetter:
      source.acceptanceLetter ?? source.acceptance_letter ?? null,
  });
  const getInitialData = () => {
    if (placement) return toFormPlacement(placement); // includes backend draft
    if (placementDraft) return toFormPlacement(placementDraft);
    return EMPTY_FORM;
  };

  const [formData, setFormData] = useState(() => getInitialData());
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  console.log(formData)

  // useEffect(() => {
  //   if (!isDirty) return;

  //   const timeout = setTimeout(() => {
  //     savePlacementDraft(formData);
  //   }, 1000);

  //   return () => clearTimeout(timeout);
  // }, [formData, isDirty, savePlacementDraft]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = validatePlacementApplication(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fileLabel = (v) =>
    v instanceof File
      ? v.name
      : typeof v === "string" && v
        ? v.split("/").pop()
        : "Choose file";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
    clearPlacementDraft();
  };

  const handleSaveDraft = () => {
    savePlacementDraft(formData);
    onClose();
  };

  const isViewOnly =
    placement && !["draft", "rejected"].includes(placement.status);

  return (
    <div className="student-modal-overlay" onClick={onClose}>
      <div className="student-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Placement Application</h2>
            <p className="modal-subtitle">
              {isViewOnly
                ? "View your placement details"
                : "Submit your internship placement details"}
            </p>
          </div>
          <button className="btn-close" onClick={onClose}>
            <span className="material-icons-sharp">close</span>
          </button>
        </div>

        {placementDraft && !isViewOnly && (
          <div className="draft-notice">
            <span className="material-icons-sharp">save</span>
            Draft saved automatically
          </div>
        )}

        <form className="form-content" onSubmit={handleSubmit}>
          {/* Organisation Details */}
          <section className="form-section">
            <h3>
              <span className="material-icons-sharp">business</span>
              Organisation Details
            </h3>

            <div className="form-grid">
              <div className="form-group full-width">
                <label>Organisation Name *</label>
                <input
                  type="text"
                  value={formData.organisationName}
                  onChange={(e) =>
                    handleChange("organisationName", e.target.value)
                  }
                  placeholder="e.g., Stanbic Bank Uganda"
                  disabled={isViewOnly}
                  className={errors.organisationName ? "error" : ""}
                />
                {errors.organisationName && (
                  <span className="error-text">{errors.organisationName}</span>
                )}
              </div>

              <div className="form-group">
                <label>Organisation Type *</label>
                <select
                  value={formData.organisationType}
                  onChange={(e) =>
                    handleChange("organisationType", e.target.value)
                  }
                  disabled={isViewOnly}
                  className={errors.organisationType ? "error" : ""}
                >
                  <option value="">Select type</option>
                  {organisationTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.organisationType && (
                  <span className="error-text">{errors.organisationType}</span>
                )}
              </div>

              <div className="form-group">
                <label>District *</label>
                <input
                  type="text"
                  value={formData.organisationDistrict}
                  onChange={(e) =>
                    handleChange("organisationDistrict", e.target.value)
                  }
                  placeholder="e.g., Kampala"
                  disabled={isViewOnly}
                  className={errors.organisationDistrict ? "error" : ""}
                />
                {errors.organisationDistrict && (
                  <span className="error-text">
                    {errors.organisationDistrict}
                  </span>
                )}
              </div>

              <div className="form-group full-width">
                <label>Physical Address</label>
                <textarea
                  value={formData.organisationAddress}
                  onChange={(e) =>
                    handleChange("organisationAddress", e.target.value)
                  }
                  placeholder="e.g., Plot 17 Hannington Road, Kampala"
                  rows={2}
                  disabled={isViewOnly}
                />
              </div>

              <div className="form-group full-width">
                <label>Department *</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  placeholder="e.g., Information Technology"
                  disabled={isViewOnly}
                  className={errors.department ? "error" : ""}
                />
                {errors.department && (
                  <span className="error-text">{errors.department}</span>
                )}
              </div>
            </div>
          </section>

          {/* Workplace Supervisor */}
          <section className="form-section">
            <h3>
              <span className="material-icons-sharp">person</span>
              Workplace Supervisor Contact
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.wpSupervisorName}
                  onChange={(e) =>
                    handleChange("wpSupervisorName", e.target.value)
                  }
                  placeholder="e.g., Mr. John Ssemakula"
                  disabled={isViewOnly}
                  className={errors.wpSupervisorName ? "error" : ""}
                />
                {errors.wpSupervisorName && (
                  <span className="error-text">{errors.wpSupervisorName}</span>
                )}
              </div>

              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  value={formData.wpSupervisorTitle}
                  onChange={(e) =>
                    handleChange("wpSupervisorTitle", e.target.value)
                  }
                  placeholder="e.g., IT Manager"
                  disabled={isViewOnly}
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={formData.wpSupervisorEmail}
                  onChange={(e) =>
                    handleChange("wpSupervisorEmail", e.target.value)
                  }
                  placeholder="e.g., supervisor@company.com"
                  disabled={isViewOnly}
                  className={errors.wpSupervisorEmail ? "error" : ""}
                />
                {errors.wpSupervisorEmail && (
                  <span className="error-text">{errors.wpSupervisorEmail}</span>
                )}
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={formData.wpSupervisorPhone}
                  onChange={(e) =>
                    handleChange("wpSupervisorPhone", e.target.value)
                  }
                  placeholder="e.g., +256 700 123456"
                  disabled={isViewOnly}
                  className={errors.wpSupervisorPhone ? "error" : ""}
                />
                {errors.wpSupervisorPhone && (
                  <span className="error-text">{errors.wpSupervisorPhone}</span>
                )}
              </div>
            </div>
          </section>

          {/* Dates & Cohort */}
          <section className="form-section">
            <h3>
              <span className="material-icons-sharp">calendar_month</span>
              Internship Period
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  disabled={isViewOnly}
                  className={errors.startDate ? "error" : ""}
                />
                {errors.startDate && (
                  <span className="error-text">{errors.startDate}</span>
                )}
              </div>

              <div className="form-group">
                <label>End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  disabled={isViewOnly}
                  className={errors.endDate ? "error" : ""}
                />
                {errors.endDate && (
                  <span className="error-text">{errors.endDate}</span>
                )}
              </div>

              <div className="form-group">
                <label>Intake Cohort</label>
                <select
                  value={formData.intakeCohort}
                  onChange={(e) => handleChange("intakeCohort", e.target.value)}
                  disabled={isViewOnly}
                >
                  <option value="">Select cohort</option>
                  {intakeCohorts.map((cohort) => (
                    <option key={cohort.value} value={cohort.value}>
                      {cohort.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Remuneration */}
          <section className="form-section">
            <h3>
              <span className="material-icons-sharp">payments</span>
              Remuneration
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Remuneration Type</label>
                <select
                  value={formData.remunerationType}
                  onChange={(e) =>
                    handleChange("remunerationType", e.target.value)
                  }
                  disabled={isViewOnly}
                >
                  {remunerationTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Placement Fee (UGX)</label>
                <input
                  type="number"
                  value={formData.placementFee}
                  onChange={(e) => handleChange("placementFee", e.target.value)}
                  placeholder="0"
                  disabled={isViewOnly}
                />
              </div>
            </div>
          </section>

          {/* Documents */}
          <section className="form-section">
            <h3>
              <span className="material-icons-sharp">attach_file</span>
              Required Documents
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Request Letter</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      handleChange("requestLetter", e.target.files[0])
                    }
                    disabled={isViewOnly}
                    id="requestLetter"
                  />
                  <label htmlFor="requestLetter" className="file-label">
                    <span className="material-icons-sharp">upload_file</span>
                    <span>{fileLabel(formData.requestLetter) || "Choose file"}</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Acceptance Letter</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      handleChange("acceptanceLetter", e.target.files[0])
                    }
                    disabled={isViewOnly}
                    id="acceptanceLetter"
                  />
                  <label htmlFor="acceptanceLetter" className="file-label">
                    <span className="material-icons-sharp">upload_file</span>
                    <span>
                      {fileLabel(formData.acceptanceLetter) || "Choose file"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          {!isViewOnly && (
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleSaveDraft}
              >
                <span className="material-icons-sharp">save</span>
                Save Draft
              </button>
              <button type="submit" className="btn-primary">
                <span className="material-icons-sharp">send</span>
                Submit Application
              </button>
            </div>
          )}

          {isViewOnly && (
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
