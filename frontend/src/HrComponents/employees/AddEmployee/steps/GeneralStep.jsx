const GeneralStep = ({ data, errors = {}, onChange, onBlur }) => {
  const handleChange = (field, value) => onChange(field, value);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange('photoPreview', URL.createObjectURL(file));
      handleChange('image', file);
    }
  };

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

      {/* Photo */}
      <div className="flex items-center gap-4">
        {data.photoPreview ? (
          <img
            src={data.photoPreview}
            alt="employee"
            className="h-16 w-16 rounded-full object-cover border"
            style={{ borderColor: 'var(--border-main)' }}
          />
        ) : (
          <div
            style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)', color: 'var(--text-muted)' }}
            className="h-16 w-16 rounded-full border flex items-center justify-center text-xs"
          >
            No Photo
          </div>
        )}
        <div className="text-sm">
          <label className="cursor-pointer text-blue-500 hover:text-blue-400 transition">
            Change photo
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </label>
          <span className="mx-2" style={{ color: 'var(--text-muted)' }}>|</span>
          <button
            onClick={() => { handleChange('photoPreview', ''); handleChange('image', ''); }}
            className="text-pink-500 hover:text-pink-400 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* First Name & Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs" style={{ color: 'var(--text-muted)' }}>First Name</label>
          <input
            type="text"
            placeholder="e.g. Menna"
            value={data.firstName || ""}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => onBlur('firstName')}
            className={inputClass('firstName')}
            style={inputStyle('firstName')}
          />
          {errors.firstName && <span className="text-xs text-[#EC3A76]">{errors.firstName}</span>}
        </div>

        <div>
          <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Last Name</label>
          <input
            type="text"
            placeholder="e.g. Ibrahim"
            value={data.lastName || ""}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => onBlur('lastName')}
            className={inputClass('lastName')}
            style={inputStyle('lastName')}
          />
          {errors.lastName && <span className="text-xs text-[#EC3A76]">{errors.lastName}</span>}
        </div>
      </div>

      {/* RFID Tag */}
      <div>
        <label className="text-xs" style={{ color: 'var(--text-muted)' }}>RFID Tag</label>
        <input
          type="text"
          placeholder="e.g. e5044786"
          value={data.rfidTag || ""}
          onChange={(e) => handleChange('rfidTag', e.target.value)}
          onBlur={() => onBlur('rfidTag')}
          className={inputClass('rfidTag')}
          style={inputStyle('rfidTag')}
        />
        {errors.rfidTag && <span className="block text-xs text-[#EC3A76]">{errors.rfidTag}</span>}
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Email</label>
          <input
            type="email"
            value={data.email || ""}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => onBlur('email')}
            className={inputClass('email')}
            style={inputStyle('email')}
          />
          {errors.email && <span className="text-xs text-[#EC3A76]">{errors.email}</span>}
        </div>

        <div>
          <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Phone</label>
          <input
            type="tel"
            value={data.phone || ""}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => onBlur('phone')}
            className={inputClass('phone')}
            style={inputStyle('phone')}
          />
          {errors.phone && <span className="text-xs text-[#EC3A76]">{errors.phone}</span>}
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Gender</label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {['Male', 'Female'].map((g) => (
            <label
              key={g}
              style={
                data.gender === g
                  ? { borderColor: '#3b82f6', background: 'var(--input-bg)', color: '#3b82f6' }
                  : { borderColor: 'var(--border-main)', background: 'var(--input-bg)', color: 'var(--text-muted)' }
              }
              className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 border transition hover:opacity-80"
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
                style={{ borderColor: data.gender === g ? '#3b82f6' : 'var(--text-muted)' }}
                className="flex h-4 w-4 items-center justify-center rounded-full border"
              >
                {data.gender === g && <span className="h-2 w-2 rounded-full bg-blue-500" />}
              </span>
              <span className="text-sm">{g}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Address</label>
        <textarea
          value={data.address || ""}
          onChange={(e) => handleChange('address', e.target.value)}
          onBlur={() => onBlur('address')}
          rows={3}
          className={`${inputClass('address')} resize-none`}
          style={inputStyle('address')}
        />
        {errors.address && <span className="text-xs text-[#EC3A76]">{errors.address}</span>}
      </div>
    </div>
  );
};

export default GeneralStep;