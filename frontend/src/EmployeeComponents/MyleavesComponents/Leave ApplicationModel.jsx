
import React, { useState } from "react";
import instance from "@/services/axios";
import { X, Upload, AlertCircle, RotateCcw } from "lucide-react";

const LeaveApplicationModel = ({ isOpen, onClose, onLeaveSubmitted }) => {
  const initialFormState = { type: "Annual", startDate: "", endDate: "", reason: "" };
  const [formData, setFormData] = useState(initialFormState);
  const [attachment, setAttachment] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
    setFormError("");
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setAttachment(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        setFormError("End date cannot be earlier than start date!");
        return;
      }
    }

    if (formData.type === "Sick" && !attachment) {
      setFormError("Attachment is required for Sick leaves!");
      return;
    }

    try {
      setSubmitLoading(true);
      setFormError("");

      const data = new FormData();
      data.append("type", formData.type);
      data.append("startDate", new Date(formData.startDate).toISOString());
      data.append("endDate", new Date(formData.endDate).toISOString());
      data.append("reason", formData.reason);
      if (attachment) data.append("attachment", attachment);

      const response = await instance.post("/leaves/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.status === "success") {
        handleReset();
        onLeaveSubmitted();
        onClose();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "var(--input-bg)",
    border: "1px solid var(--border-main)",
    borderRadius: "12px",
    padding: "12px",
    color: "var(--text-main)",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "8px",
    color: "var(--text-muted)",
  };

  const isEndDateInvalid = formError && formData.endDate &&
    new Date(formData.endDate) < new Date(formData.startDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-[2rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-main)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 transition-colors hover:text-red-400"
          style={{ color: "var(--text-muted)" }}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h3 className="text-xl font-bold mb-1" style={{ color: "var(--text-main)" }}>
          New Leave Application
        </h3>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
          Fill out the form below to request time off.
        </p>

        {/* Error */}
        {formError && (
          <div
            className="flex items-center gap-2 p-3 mb-4 text-xs rounded-xl"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
          >
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">

          {/* Leave Type */}
          <div>
            <label style={labelStyle}>Leave Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              style={inputStyle}
              className="cursor-pointer focus:border-cyan-500"
            >
              <option value="Annual">Annual</option>
              <option value="Sick">Sick</option>
              <option value="Casual">Casual</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Start + End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                style={inputStyle}
                className="text-center focus:border-cyan-500 [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
            <div>
              <label style={labelStyle}>End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate}
                required
                style={{
                  ...inputStyle,
                  borderColor: isEndDateInvalid ? "#f87171" : "var(--border-main)",
                }}
                className="text-center [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label style={labelStyle}>Reason for Leave *</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              rows="3"
              required
              placeholder="Type your reason here..."
              style={{ ...inputStyle, resize: "none" }}
              className="focus:border-cyan-500 placeholder:text-[var(--text-muted)]"
            />
          </div>

          {/* Attachment */}
          <div>
            <label style={labelStyle}>
              Attachments {formData.type === "Sick" ? "*" : "(Optional)"}
            </label>
            <div
              className="relative flex items-center justify-center w-full rounded-xl p-4 cursor-pointer border border-dashed transition-colors"
              style={{ background: "var(--input-bg)", borderColor: "var(--border-main)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text-muted)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-main)"; }}
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-1 text-center">
                <Upload size={18} style={{ color: attachment ? "#60a5fa" : "var(--text-muted)" }} />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {attachment ? attachment.name : "Click to upload or drag and drop"}
                </span>
                <span className="text-[10px]" style={{ color: "var(--text-muted)", opacity: 0.6 }}>
                  SVG, PNG, JPG OR PDF (MAX. 5MB)
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              style={{ background: "#0293FA" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#0282dd"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#0293FA"; }}
            >
              {submitLoading ? "Submitting Application..." : "Submit Application"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:text-red-400"
              style={{ background: "var(--input-bg)", color: "var(--text-muted)", border: "1px solid var(--border-main)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--hover-bg)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--input-bg)"; }}
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplicationModel;