function ExperianceStep({ data, onChange }) {
  return (
       <div className="space-y-4">

      {/* Company */}
      <div>
        <label className="text-xs text-gray-400">Company name</label>
        <input
          value={data?.company || ""}
          onChange={(e) => onChange("company", e.target.value)}
          className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none"
       
        />
      </div>

      {/* Position + Job Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400">Position</label>
          <input
            value={data?.position || ""}
            onChange={(e) => onChange("position", e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none"
            
          />
        </div>

        <div>
        <label className="text-xs text-gray-400">Job type</label>
        
        <select
        value={data?.jobType || ""}
        onChange={(e) => onChange("jobType", e.target.value)}
        className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none">
            <option value="" className="bg-[#1A1D24] text-white">
            Select type
            </option>
            <option value="Full-time" className="bg-[#1A1D24] text-white">
             Full-time
           </option>
           <option value="Part-time" className="bg-[#1A1D24] text-white">
            Part-time
            </option>
            <option value="Contract" className="bg-[#1A1D24] text-white">
             Contract
            </option>
          </select>
          </div>

      </div>

      {/* Salary */}
      <div>
        <label className="text-xs text-gray-400">Salary</label>
        <input
          value={data?.salary || ""}
          onChange={(e) => onChange("salary", e.target.value)}
          className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none"
          
        />
      </div>

 {/* Duration */}
<div>
  <label className="text-xs text-gray-400">Duration</label>

  <div className="grid grid-cols-2 gap-3 mt-1">
    {/* From */}
    <input
      type="date"
      value={data.startDate}
      onChange={(e) => onChange("startDate", e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none"
    />

    {/* To */}
    <input
      type="date"
      value={data.endDate}
      onChange={(e) => onChange("endDate", e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none"
    />
  </div>
</div>


    </div>
  )
}

export default ExperianceStep;