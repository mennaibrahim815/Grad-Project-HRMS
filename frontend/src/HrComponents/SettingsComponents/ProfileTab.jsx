// 





import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateHRProfile } from "../../store/HrSlices/navbar/hrProfileSlice";

const ProfileTab = () => {
  const dispatch = useDispatch();
  // استخراج البيانات من الـ State
  const { data: user, loading } = useSelector((state) => state.hrProfile);

  // حالة التحكم في وضع التعديل والعرض
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // حالة جديدة للتحكم في رسائل الخطأ والنجاح
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  // تحديث الـ local state عند تغير بيانات الـ user القادمة من الـ API
  useEffect(() => {
    if (user && user.general) {
      setFormData({
        firstName: user.general.firstName || "",
        lastName: user.general.lastName || "",
        email: user.general.email || "",
        phone: user.general.phone || "",
        address: user.general.address || "",
        gender: user.general.gender || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // إخفاء الرسالة بمجرد أن يبدأ المستخدم في الكتابة أو التعديل
    if (message) setMessage(null);
  };

  // دالة الإلغاء بترجع الداتا للي كانت عليه وبتقفل مود التعديل
  const handleCancel = () => {
    if (user && user.general) {
      setFormData({
        firstName: user.general.firstName || "",
        lastName: user.general.lastName || "",
        email: user.general.email || "",
        phone: user.general.phone || "",
        address: user.general.address || "",
        gender: user.general.gender || "",
        password: "",
        confirmPassword: "",
      });
    }
    setIsEditing(false);
    setShowPassword(false);
    setMessage(null);
  };

  // const handleUpdate = async () => {
  //   setMessage(null); // مسح أي رسالة سابقة

  //   if (!formData.firstName) {
  //     setMessage({ type: "error", text: "First Name is required" });
  //     return;
  //   }

  //   if (formData.password !== formData.confirmPassword) {
  //     setMessage({ type: "error", text: "Passwords do not match!" });
  //     return;
  //   }

  //   const changedFields = {};

  //   if (formData.firstName !== user.general?.firstName) {
  //     changedFields.firstName = formData.firstName;
  //   }

  //   if (formData.lastName !== user.general?.lastName) {
  //     changedFields.lastName = formData.lastName;
  //   }

  //   if (formData.phone !== user.general?.phone) {
  //     changedFields.phone = formData.phone;
  //   }

  //   if (formData.address !== user.general?.address) {
  //     changedFields.address = formData.address;
  //   }

  //   if (formData.gender !== user.general?.gender) {
  //     changedFields.gender = formData.gender;
  //   }

  //   if (formData.password) {
  //     changedFields.password = formData.password;
  //   }

  //   if (Object.keys(changedFields).length === 0) {
  //     setMessage({ type: "error", text: "No changes detected" });
  //     return;
  //   }

  //   console.log("Current User:", user);
  //   console.log("Sending User ID:", user?._id);
  //   console.log("Changed Fields:", changedFields);

  //   try {
  //     const resultAction = await dispatch(
  //       updateHRProfile({
  //         userId: user._id,
  //         formData: {
  //           general: changedFields,
  //         },
  //       }),
  //     );

  //     console.log("Result:", resultAction);

  //     if (updateHRProfile.fulfilled.match(resultAction)) {
  //       setMessage({ type: "success", text: "Profile updated successfully!" });
  //       setIsEditing(false);
  //       setShowPassword(false);
  //     } else {
  //       setMessage({ type: "error", text: "Update failed: " + (resultAction.payload || "Unknown error") });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setMessage({ type: "error", text: "An error occurred" });
  //   }
  // };



  const handleUpdate = async () => {
  setMessage(null);

  if (!formData.firstName) {
    setMessage({ type: "error", text: "First Name is required" });
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setMessage({ type: "error", text: "Passwords do not match!" });
    return;
  }

  const changedFields = {};

  if (formData.firstName !== user.general?.firstName) {
    changedFields.firstName = formData.firstName;
  }

  if (formData.lastName !== user.general?.lastName) {
    changedFields.lastName = formData.lastName;
  }

  if (formData.phone !== user.general?.phone) {
    changedFields.phone = formData.phone;
  }

  if (formData.address !== user.general?.address) {
    changedFields.address = formData.address;
  }

  if (formData.gender !== user.general?.gender) {
    changedFields.gender = formData.gender;
  }

  if (formData.password) {
    changedFields.password = formData.password;
  }

  // ✅ أهم إضافة: الصورة
  if (formData.avatarFile) {
    changedFields.avatar = formData.avatarFile;
  }

  if (Object.keys(changedFields).length === 0) {
    setMessage({ type: "error", text: "No changes detected" });
    return;
  }

  try {
    const formDataToSend = new FormData();

    Object.keys(changedFields).forEach((key) => {
      formDataToSend.append(key, changedFields[key]);
    });

    const resultAction = await dispatch(
      updateHRProfile({
        userId: user._id,
        formData: formDataToSend,
      })
    );

    if (updateHRProfile.fulfilled.match(resultAction)) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
      setShowPassword(false);
    } else {
      setMessage({
        type: "error",
        text: resultAction.payload || "Update failed",
      });
    }
  } catch (err) {
    setMessage({ type: "error", text: "An error occurred" });
  }
};

  if (!user) return <div className="text-white p-4">Loading profile...</div>;

  return (
    <div className="space-y-6 text-slate-300">
      {/* 1. Personal Information */}
      <div className="bg-[#111c24] border border-slate-800/60 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user.general?.avatar}
            alt="Avatar"
            className="w-16 h-16 rounded-full border border-slate-700 object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-white">
              {user.general?.firstName} {user.general?.lastName}
            </h3>
            <p className="text-xs text-slate-500">{user.employee?.jobTitle}</p>
            {isEditing && (
              <input
  type="file"
  onChange={(e) =>
    setFormData({
      ...formData,
      avatarFile: e.target.files[0],
    })
  }

                className="mt-2 text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-[#16252f] file:text-slate-300 hover:file:bg-slate-700 cursor-pointer transition-all"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            isEditing={isEditing}
          />
          <InputGroup
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            isEditing={isEditing}
          />
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">Email</label>

            <input
              value={formData.email}
              disabled
              className="bg-[#16252f]/60 border border-slate-700/70 rounded-xl p-3 text-sm text-slate-500 cursor-not-allowed h-[46px]"
            />
          </div>{" "}
          <InputGroup
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            isEditing={isEditing}
          />
          <InputGroup
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            isEditing={isEditing}
          />
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">Gender</label>

            <div
              value={formData.gender}
              disabled
              className="bg-[#16252f]/60 border border-slate-700/70 rounded-xl p-3 text-sm text-slate-500 cursor-not-allowed h-[46px]"
            >
              {formData.gender}
            </div>
          </div>
          {/* خانات الباسورد تظهر فقط في وضع التعديل */}
          {isEditing && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-400">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current"
                  className="bg-[#16252f] border border-slate-700/70 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500 h-[46px]"
                />
              </div>
              <div className="relative flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-400">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="bg-[#16252f] border border-slate-700/70 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500 h-[46px] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[32px] text-xs text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Employment & Job Details (Read-only) */}
      <div className="bg-[#111c24] border border-slate-800/60 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-5">
          Employment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard label="Job Title" value={user.employee?.jobTitle} />
          <InfoCard label="Department" value={user.employee?.department} />
          <InfoCard label="Status" value={user.employee?.status} />
          <InfoCard label="Work Location" value={user.employee?.workLocation} />
          <InfoCard
            label="Working Hours"
            value={`${user.employee?.workingHours} hrs`}
          />
          <InfoCard
            label="Base Salary"
            value={`${user.employee?.baseSalary} EGP`}
          />
        </div>
      </div>

      {/* 3. Experience (Read-only) */}
      <div className="bg-[#111c24] border border-slate-800/60 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-5">Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard label="Company" value={user.experience?.company} />
          <InfoCard label="Position" value={user.experience?.position} />
          <InfoCard label="Job Type" value={user.experience?.jobType} />
        </div>
      </div>

      {/* مساحة عرض الرسائل (أخطاء أو نجاح) */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            message.type === "error"
              ? "bg-red-500/10 border-red-500/50 text-red-500"
              : "bg-blue-500/10 border-blue-500/50 text-blue-500"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#16252f] hover:bg-slate-800 border border-slate-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleCancel}
              className="bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium px-6 py-2.5 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// --- المكونات المساعدة ---

// تم التعديل هنا لدعم حالة العرض أو التعديل بنفس الارتفاع للحفاظ على التصميم
const InputGroup = ({ label, name, value, onChange, isEditing }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-medium text-slate-400">{label}</label>
    {isEditing ? (
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="bg-[#16252f] border border-slate-700/70 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500 h-[46px]"
      />
    ) : (
      <div className="bg-[#16252f]/40 border border-transparent rounded-xl p-3 text-sm text-slate-300 h-[46px] flex items-center">
        {value || "-"}
      </div>
    )}
  </div>
);

const InfoCard = ({ label, value }) => (
  <div className="bg-[#16252f] p-3 rounded-xl border border-slate-700/50">
    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
      {label}
    </p>
    <p className="text-sm text-white font-medium">{value || "N/A"}</p>
  </div>
);

export default ProfileTab;