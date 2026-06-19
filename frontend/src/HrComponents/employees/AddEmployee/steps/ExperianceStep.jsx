function ExperianceStep({ data, errors = {}, onChange, onBlur }) {
  const inputClass = (field) =>
    `w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border outline-none
     ${errors[field] ? "border-[#EC3A76]" : "border-white/10 focus:border-blue-500"}`;

  return (
    <div className="space-y-4">

      {/* Company */}
      <div>
        <label className="text-xs text-gray-400">Company name</label>
        <input
          value={data?.company || ""}
          onChange={(e) => onChange("company", e.target.value)}
          className={inputClass('company')}
        />
      </div>

      {/* Position + Job Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400">Position</label>
          <input
            value={data?.position || ""}
            onChange={(e) => onChange("position", e.target.value)}
            className={inputClass('position')}
          />
        </div>

        <div>
          <label className="text-xs text-gray-400">Job type</label>
          <select
            value={data?.jobType || ""}
            onChange={(e) => onChange("jobType", e.target.value)}
            onBlur={() => onBlur('jobType')}
            className={inputClass('jobType')}
          >
            <option value="" className="bg-[#1A1D24] text-white">Select type</option>
            <option value="Full-time" className="bg-[#1A1D24] text-white">Full-time</option>
            <option value="Part-time" className="bg-[#1A1D24] text-white">Part-time</option>
            <option value="Contract" className="bg-[#1A1D24] text-white">Contract</option>
          </select>
          {errors.jobType && <span className="text-xs text-[#EC3A76]">{errors.jobType}</span>}
        </div>
      </div>

      {/* Salary */}
      <div>
        <label className="text-xs text-gray-400">Salary</label>
        <input
          type="number"
          value={data?.salary || ""}
          onChange={(e) => onChange("salary", e.target.value)}
          onBlur={() => onBlur('salary')}
          className={inputClass('salary')}
        />
        {errors.salary && <span className="text-xs text-[#EC3A76]">{errors.salary}</span>}
      </div>

      {/* Duration */}
      <div>
        <label className="text-xs text-gray-400">Duration</label>
        <div className="grid grid-cols-2 gap-3 mt-1">
          <input
            type="date"
            value={data.startDate}
            onChange={(e) => onChange("startDate", e.target.value)}
            className={inputClass('startDate')}
          />
          <input
            type="date"
            value={data.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
            onBlur={() => onBlur('endDate')}
            className={inputClass('endDate')}
          />
        </div>
        {errors.endDate && <span className="text-xs text-[#EC3A76]">{errors.endDate}</span>}
      </div>

    </div>
  );
}

export default ExperianceStep;