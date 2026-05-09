const GeneralStep = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange(field, value);
  };
     const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    handleChange('photoPreview', URL.createObjectURL(file));
    handleChange('image', file);
  }
};

  return (
  <div className="space-y-4">


// في الـ JSX
<div className="flex items-center gap-4">
  {data.photoPreview ? (
    <img
      src={data.photoPreview}
      alt="employee"
      className="h-16 w-16 rounded-full object-cover border border-white/10"
    />
  ) : (
    <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 text-xs">
      No Photo
    </div>
  )}

  <div className="text-sm">
    <label className="cursor-pointer text-blue-500 hover:text-blue-400 transition">
      Change photo
      <input
        type="file"
        hidden
        accept="image/*"
        onChange={handleFileChange}
      />
    </label>

    <span className="mx-2 text-gray-500">|</span>

    <button
      onClick={() => {
        handleChange('photoPreview', '');
        handleChange('image', '');
      }}
      className="text-pink-500 hover:text-pink-400 transition"
    >
      Delete
    </button>

    <p className="mt-1 text-xs text-gray-400">
      Maximum photo size of 2mb.
    </p>
  </div>
</div>

    {/* Name */}
    <div>
      <label className="text-xs text-gray-400">Name</label>
      <input
        type="text"
        value={data.name || ""}
        onChange={(e) => handleChange('name', e.target.value)}
        className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white"
      />
    </div>

    {/* Email & Phone */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-xs text-gray-400">Email</label>
        <input
          type="email"
          value={data.email || ""}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white"
        />
      </div>

      <div>
        <label className="text-xs text-gray-400">Phone</label>
        <input
          type="tel"
          value={data.phone || ""}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white"
        />
      </div>
    </div>

    {/* Gender */}
    <div>
      <label className="text-xs text-gray-400">Gender</label>

      <div className="grid grid-cols-2 gap-4 mt-2">
        {['Male', 'Female'].map((g) => (
          <label
            key={g}
            className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 border transition
              ${
                data.gender === g
                  ? 'border-blue-500 bg-white/5 text-blue-500'
                  : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
              }`}
          >
            <input
              type="radio"
              name="gender"
              value={g}
              checked={data.gender === g}
              onChange={() => handleChange('gender', g)}
              className="hidden"
            />

            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border
                ${
                  data.gender === g
                    ? 'border-blue-500'
                    : 'border-gray-500'
                }`}
            >
              {data.gender === g && (
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              )}
            </span>

            <span className="text-sm">{g}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Address */}
    <div>
      <label className="text-xs text-gray-400">Address</label>
      <textarea
        value={data.address || ""}
        onChange={(e) => handleChange('address', e.target.value)}
        rows={3}
        className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white resize-none"
      />
    </div>

  </div>
);

};

export default GeneralStep;

