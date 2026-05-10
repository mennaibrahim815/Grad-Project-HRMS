function EmployeeStep({ data, onChange }) {
  return (
    <div className="space-y-4">

     {/* Job Title */}
      <div>
        <label className="text-xs text-gray-400">Official Job Title</label>
        <input
          type="text"
          placeholder="e.g. Data Analyst"
          value={data.jobTitle || ""}
          onChange={(e) => onChange("jobTitle", e.target.value)}
          className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white"
        />
      </div>

      {/* Department + Work Location */}
      <div className="grid grid-cols-2 gap-4">
       <div>
          <label className="text-xs text-gray-400">Department</label>
          <select
            value={data.department || ""}
            onChange={(e) => onChange("department", e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white"
          >
            <option value="" className="bg-[#1A1D24]">Select</option>
            {/* تأكدي أن هذه القيم هي المقبولة في الـ Database عندك */}
            <option value="software engineering" className="bg-[#1A1D24]">Software Engineering</option>
            <option value="marketing" className="bg-[#1A1D24]">Marketing</option>
            <option value="design" className="bg-[#1A1D24]">Design</option>
            <option value="hr" className="bg-[#1A1D24]">HR</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400">Work location</label>
          <select
            value={data.workLocation}
            onChange={(e) => onChange("workLocation", e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none"
          >
            <option value="" className="bg-[#1A1D24] text-white">Select</option>
            <option className="bg-[#1A1D24] text-white">On-site</option>
            <option className="bg-[#1A1D24] text-white">Remote</option>
            <option className="bg-[#1A1D24] text-white">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Job Type + Joining */}
      <div className="grid grid-cols-2 gap-4">
       <div>
          <label className="text-xs text-gray-400">Employment Type</label>
          <select
            value={data.jobType || ""}
            onChange={(e) => onChange("jobType", e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white"
          >
            <option value="Full-time" className="bg-[#1A1D24]">Full-time</option>
            <option value="Part-time" className="bg-[#1A1D24]">Part-time</option>
            <option value="Internship" className="bg-[#1A1D24]">Internship</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400">Joining</label>
          <input
            type="date"
            value={data.joiningDate}
            onChange={(e) => onChange("joiningDate", e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Salary */}
     {/* Salary + Working Hours (حقول إجبارية في الباك) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400">Monthly Base Salary</label>
          <input
            type="number"
            value={data.baseSalary || ""}
            onChange={(e) => onChange("baseSalary", e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400">Working Hours (4-12)</label>
          <input
            type="number"
            min="4"
            max="12"
            value={data.workingHours || ""}
            onChange={(e) => onChange("workingHours", e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white"
          />
        </div>
      </div>
      {/* حالة الموظف - اختيارية */}
      <div>
        <label className="text-xs text-gray-400">Employment Status</label>
        <select
          value={data.status || "Active"}
          onChange={(e) => onChange("status", e.target.value)}
          className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white"
        >
          <option value="Active" className="bg-[#1A1D24]">Active</option>
          <option value="Archived" className="bg-[#1A1D24]">Archived</option>
        </select>
      </div>
      {/* Leave Balance Section */}
<div className="pt-4 border-t border-white/10">
  <h4 className="text-sm font-medium text-blue-400 mb-3">Leave Balance (Days)</h4>
  <div className="grid grid-cols-3 gap-4">
    <div>
      <label className="text-[10px] text-gray-400 uppercase">Annual</label>
      <input
        type="number"
        value={data.leaveBalance?.annual || 21}
        onChange={(e) => onChange("leaveBalance", { ...data.leaveBalance, annual: e.target.value })}
        className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white text-sm"
      />
    </div>

    <div>
      <label className="text-[10px] text-gray-400 uppercase">Sick</label>
      <input
        type="number"
        value={data.leaveBalance?.sick || 30}
        onChange={(e) => onChange("leaveBalance", { ...data.leaveBalance, sick: e.target.value })}
        className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white text-sm"
      />
    </div>

    <div>
      <label className="text-[10px] text-gray-400 uppercase">Casual</label>
      <input
        type="number"
        value={data.leaveBalance?.casual || 6}
        onChange={(e) => onChange("leaveBalance", { ...data.leaveBalance, casual: e.target.value })}
        className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white text-sm"
      />
    </div>
  </div>
</div>
      

    </div>
  );
};


export default EmployeeStep