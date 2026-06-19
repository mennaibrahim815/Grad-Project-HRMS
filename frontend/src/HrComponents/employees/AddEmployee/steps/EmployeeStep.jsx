function EmployeeStep({ data, errors = {}, onChange, onBlur }) {
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

      {/* Job Title */}
      <div>
        <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Official Job Title</label>
        <input
          type="text"
          placeholder="e.g. Data Analyst"
          value={data.jobTitle || ""}
          onChange={(e) => onChange("jobTitle", e.target.value)}
          onBlur={() => onBlur('jobTitle')}
          className={inputClass('jobTitle')}
          style={inputStyle('jobTitle')}
        />
        {errors.jobTitle && <span className="text-xs text-[#EC3A76]">{errors.jobTitle}</span>}
      </div>

      {/* Department + Work Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Department</label>
          <select
            value={data.department || ""}
            onChange={(e) => onChange("department", e.target.value)}
            onBlur={() => onBlur('department')}
            className={inputClass('department')}
            style={inputStyle('department')}
          >
            <option value="" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Select</option>
            <option value="software engineering" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Software Engineering</option>
            <option value="marketing" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Marketing</option>
            <option value="design" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Design</option>
          </select>
          {errors.department && <span className="text-xs text-[#EC3A76]">{errors.department}</span>}
        </div>

        <div>
          <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Work location</label>
          <select
            value={data.workLocation || ""}
            onChange={(e) => onChange("workLocation", e.target.value)}
            onBlur={() => onBlur('workLocation')}
            className={inputClass('workLocation')}
            style={inputStyle('workLocation')}
          >
            <option value="" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Select</option>
            <option style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>On-site</option>
            <option style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Remote</option>
            <option style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Hybrid</option>
          </select>
          {errors.workLocation && <span className="text-xs text-[#EC3A76]">{errors.workLocation}</span>}
        </div>
      </div>

      {/* Job Type + Joining */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Employment Type</label>
          <select
            value={data.jobType || ""}
            onChange={(e) => onChange("jobType", e.target.value)}
            className={inputClass('jobType')}
            style={inputStyle('jobType')}
          >
            <option value="Full-time" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Full-time</option>
            <option value="Part-time" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Part-time</option>
            <option value="Internship" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Internship</option>
          </select>
        </div>

        <div>
          <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Joining</label>
          <input
            type="date"
            value={data.joiningDate || ""}
            onChange={(e) => onChange("joiningDate", e.target.value)}
            onBlur={() => onBlur('joiningDate')}
            className={inputClass('joiningDate')}
            style={inputStyle('joiningDate')}
          />
          {errors.joiningDate && <span className="text-xs text-[#EC3A76]">{errors.joiningDate}</span>}
        </div>
      </div>

      {/* Salary + Working Hours */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Monthly Base Salary</label>
          <input
            type="number"
            value={data.baseSalary || ""}
            onChange={(e) => onChange("baseSalary", e.target.value)}
            onBlur={() => onBlur('baseSalary')}
            className={inputClass('baseSalary')}
            style={inputStyle('baseSalary')}
          />
          {errors.baseSalary && <span className="text-xs text-[#EC3A76]">{errors.baseSalary}</span>}
        </div>

        <div>
          <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Working Hours (4-12)</label>
          <input
            type="number"
            min="4"
            max="12"
            value={data.workingHours || ""}
            onChange={(e) => onChange("workingHours", e.target.value)}
            onBlur={() => onBlur('workingHours')}
            className={inputClass('workingHours')}
            style={inputStyle('workingHours')}
          />
          {errors.workingHours && <span className="text-xs text-[#EC3A76]">{errors.workingHours}</span>}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Employment Status</label>
        <select
          value={data.status || "Active"}
          onChange={(e) => onChange("status", e.target.value)}
          className={inputClass('status')}
          style={inputStyle('status')}
        >
          <option value="Active" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Active</option>
          <option value="Archived" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Archived</option>
        </select>
      </div>

      {/* Leave Balance */}
      <div className="pt-4 border-t" style={{ borderColor: 'var(--border-main)' }}>
        <h4 className="text-sm font-medium text-blue-400 mb-3">Leave Balance (Days)</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>Annual</label>
            <input
              type="number"
              value={data.leaveBalance?.annual ?? 21}
              onChange={(e) => onChange("leaveBalance", { ...data.leaveBalance, annual: e.target.value })}
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}
              className="w-full mt-1 px-3 py-2 rounded-lg border focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>Sick</label>
            <input
              type="number"
              value={data.leaveBalance?.sick ?? 30}
              onChange={(e) => onChange("leaveBalance", { ...data.leaveBalance, sick: e.target.value })}
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}
              className="w-full mt-1 px-3 py-2 rounded-lg border focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>Casual</label>
            <input
              type="number"
              value={data.leaveBalance?.casual ?? 6}
              onChange={(e) => onChange("leaveBalance", { ...data.leaveBalance, casual: e.target.value })}
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}
              className="w-full mt-1 px-3 py-2 rounded-lg border focus:border-blue-500 outline-none text-sm"
            />
          </div>
        </div>
      </div>

    </div>
  );
}

export default EmployeeStep;