function ExperianceStep({ data, errors = {}, onChange, onBlur }) {
  const inputClass = (field) =>
    `w-full mt-1 px-4 py-3 rounded-xl border outline-none
     ${errors[field] ? "border-[#EC3A76]" : "focus:border-blue-500"}`;

  const inputStyle = (field) => ({
    background: 'var(--input-bg)',
    borderColor: errors[field] ? undefined : 'var(--border-main)',
    color: 'var(--text-main)',
  });

  return (
    <div className="space-y-4">

      {/* Company */}
      <div>
        <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Company name</label>
        <input
          value={data?.company || ""}
          onChange={(e) => onChange("company", e.target.value)}
          className={inputClass('company')}
          style={inputStyle('company')}
        />
      </div>

      {/* Position + Job Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Position</label>
          <input
            value={data?.position || ""}
            onChange={(e) => onChange("position", e.target.value)}
            className={inputClass('position')}
            style={inputStyle('position')}
          />
        </div>

        <div>
          <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Job type</label>
          <select
            value={data?.jobType || ""}
            onChange={(e) => onChange("jobType", e.target.value)}
            onBlur={() => onBlur('jobType')}
            className={inputClass('jobType')}
            style={inputStyle('jobType')}
          >
            <option value="" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Select type</option>
            <option value="Full-time" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Full-time</option>
            <option value="Part-time" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Part-time</option>
            <option value="Contract" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Contract</option>
          </select>
          {errors.jobType && <span className="text-xs text-[#EC3A76]">{errors.jobType}</span>}
        </div>
      </div>

      {/* Salary */}
      <div>
        <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Salary</label>
        <input
          type="number"
          value={data?.salary || ""}
          onChange={(e) => onChange("salary", e.target.value)}
          onBlur={() => onBlur('salary')}
          className={inputClass('salary')}
          style={inputStyle('salary')}
        />
        {errors.salary && <span className="text-xs text-[#EC3A76]">{errors.salary}</span>}
      </div>

      {/* Duration */}
      <div>
        <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Duration</label>
        <div className="grid grid-cols-2 gap-3 mt-1">
          <input
            type="date"
            value={data.startDate}
            onChange={(e) => onChange("startDate", e.target.value)}
            className={inputClass('startDate')}
            style={inputStyle('startDate')}
          />
          <input
            type="date"
            value={data.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
            onBlur={() => onBlur('endDate')}
            className={inputClass('endDate')}
            style={inputStyle('endDate')}
          />
        </div>
        {errors.endDate && <span className="text-xs text-[#EC3A76]">{errors.endDate}</span>}
      </div>

    </div>
  );
}

export default ExperianceStep;