import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateHRProfile, fetchMyHRProfile } from "../../store/HrSlices/navbar/hrProfileSlice";

const ProfileTab = () => {
  const dispatch = useDispatch();
  const { data: user, loading } = useSelector((state) => state.hrProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    gender: "",
    password: "",
    confirmPassword: "",
    avatarFile: null,
    avatarPreview: null
  });

  useEffect(() => {
    if (user && user.general) {
      setFormData({
        firstName: user.general.firstName || "",
        lastName: user.general.lastName || "",
        phone: user.general.phone || "",
        address: user.general.address || "",
        gender: user.general.gender || "Female",
        password: "",
        confirmPassword: "",
        avatarFile: null,
        avatarPreview: null
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) setMessage(null);
  };

  const handleUpdate = async () => {
    setMessage(null);

    if (!formData.firstName.trim()) {
      setMessage({ type: "error", text: "First Name is required" });
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    const dataToSend = new FormData();
    
    // إرسال البيانات بالتنسيق المتداخل (general[key])
    dataToSend.append("general[firstName]", formData.firstName.trim());
    dataToSend.append("general[lastName]", formData.lastName.trim());
    dataToSend.append("general[phone]", formData.phone.trim());
    dataToSend.append("general[address]", formData.address.trim());
    dataToSend.append("general[gender]", formData.gender);
    
    if (formData.password) {
      dataToSend.append("password", formData.password);
    }
    
    // رفع الصورة باستخدام المفتاح الذي تأكدنا منه في Postman
    if (formData.avatarFile) {
      dataToSend.append("general[avatar]", formData.avatarFile);
    }

    try {
      const resultAction = await dispatch(
        updateHRProfile({ userId: user._id, formData: dataToSend })
      );

      if (updateHRProfile.fulfilled.match(resultAction)) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);
        // تحديث البيانات في الـ Redux لضمان تزامن الصورة والبيانات
        await dispatch(fetchMyHRProfile());
      } else {
        setMessage({ type: "error", text: resultAction.payload || "Update failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    }
  };

  const getAvatarSrc = () => {
    // 1. لو في صورة مختارينها حالا للمعاينة
    if (formData.avatarPreview) return formData.avatarPreview;

    // 2. لو في صورة من الباك إند
    if (user?.general?.avatar) {
      const path = user.general.avatar;
      if (path.startsWith('http')) return path;
      
      const baseUrl = import.meta.env.VITE_API_URL || "https://grad-project-hrms-production-7.up.railway.app";
      // إضافة Timestamp لمنع الكاش وتحديث الصورة فورا
      return `${baseUrl}${path}?t=${Date.now()}`;
    }

    // 3. الصورة الافتراضية
    return '/uploads/default-avatar.png';
  };

  if (!user) return <div className="p-4 text-[var(--text-main)]">Loading...</div>;

  return (
    <div className="space-y-6" style={{ color: 'var(--text-main)' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }} className="border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <img
            src={getAvatarSrc()}
            alt="Avatar"
            className="w-20 h-20 rounded-full border-2 object-cover border-[var(--border-main)]"
            onError={(e) => { e.target.src = '/uploads/default-avatar.png'; }}
          />
          <div>
            <h3 className="text-xl font-bold">{user.general?.firstName} {user.general?.lastName}</h3>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">{user.employee?.jobTitle}</p>
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if(file) setFormData({ ...formData, avatarFile: file, avatarPreview: URL.createObjectURL(file) });
                }}
                className="mt-3 text-[10px] file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-blue-600 file:text-white cursor-pointer"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} isEditing={isEditing} />
          <InputGroup label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} isEditing={isEditing} />
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Email</label>
            <div className="rounded-xl p-3 text-sm h-[46px] flex items-center border border-transparent bg-[var(--bg-deep)] opacity-60 italic">
              {user.general?.email}
            </div>
          </div>

          <InputGroup label="Phone" name="phone" value={formData.phone} onChange={handleChange} isEditing={isEditing} />
          <InputGroup label="Address" name="address" value={formData.address} onChange={handleChange} isEditing={isEditing} />
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Gender</label>
            {isEditing ? (
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="rounded-xl p-3 text-sm outline-none h-[46px] border bg-[var(--input-bg)] border-[var(--border-main)] text-[var(--text-main)]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <div className="rounded-xl p-3 text-sm h-[46px] flex items-center border border-transparent bg-[var(--bg-deep)]">
                {user.general?.gender}
              </div>
            )}
          </div>

          {isEditing && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current"
                  className="rounded-xl p-3 text-sm outline-none h-[46px] border bg-[var(--input-bg)] border-[var(--border-main)]"
                />
              </div>
              <div className="relative flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="rounded-xl p-3 text-sm outline-none h-[46px] border bg-[var(--input-bg)] border-[var(--border-main)] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[32px] text-[10px] font-bold uppercase text-blue-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }} className="border rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold mb-5">Employment Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <InfoCard label="Job Title" value={user.employee?.jobTitle} />
          <InfoCard label="Department" value={user.employee?.department} />
          <InfoCard label="Status" value={user.employee?.status} />
          <InfoCard label="Work Location" value={user.employee?.workLocation} />
          <InfoCard label="Base Salary" value={`${user.employee?.baseSalary} EGP`} />
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold border transition-all ${message.type === "error" ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-blue-500/10 border-blue-500/30 text-blue-500"}`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="border text-sm font-bold px-6 py-2.5 rounded-xl transition-all border-[var(--border-main)] hover:bg-[var(--hover-bg)]"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="text-sm font-bold px-6 py-2.5 rounded-xl text-[var(--text-muted)]"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-8 py-2.5 rounded-xl disabled:opacity-50 shadow-lg shadow-blue-500/20 active:scale-95"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const InputGroup = ({ label, name, value, onChange, isEditing }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">{label}</label>
    {isEditing ? (
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-xl p-3 text-sm outline-none h-[46px] border bg-[var(--input-bg)] border-[var(--border-main)] text-[var(--text-main)]"
      />
    ) : (
      <div className="rounded-xl p-3 text-sm h-[46px] flex items-center border border-transparent bg-[var(--bg-deep)]">
        {value || "—"}
      </div>
    )}
  </div>
);

const InfoCard = ({ label, value }) => (
  <div className="p-4 rounded-xl border bg-[var(--bg-deep)] border-[var(--border-main)]">
    <p className="text-[10px] uppercase font-bold tracking-widest mb-1 opacity-70 text-[var(--text-muted)]">{label}</p>
    <p className="text-sm font-bold">{value || "N/A"}</p>
  </div>
);

export default ProfileTab;