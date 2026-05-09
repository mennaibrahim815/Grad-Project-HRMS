// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// // import { updateHRProfile } from '../../store/HrSlices/navbar/hrProfileSlice';
// // import defaultAvatar from '../../assets/icons/avatar-default-symbolic-svgrepo-com.svg';
// import defaultAvatar from "../../assets/avatars/avatar-default-symbolic-svgrepo-com.svg";

// const AccountTab = () => {
//   const dispatch = useDispatch();
//   const { data: hr } = useSelector((state) => state.hrProfile);

//   //   const [formData, setFormData] = useState({
//   //     firstName: '', lastName: '', email: '', phone: '', currentPass: '', newPass: ''
//   //   });

//   //   useEffect(() => {
//   //     if (hr) {
//   //       const names = hr.name?.split(' ') || ['', ''];
//   //       setFormData(prev => ({ ...prev, firstName: names[0], lastName: names.slice(1).join(' '), email: hr.email, phone: hr.phone }));
//   //     }
//   //   }, [hr]);
//   // 1. شيلنا الـ useEffect خالص أو سبناه للأمور التانية
//   // 2. بنخلي الـ useState ياخد قيمته من الـ hr لو موجودة

//   const [formData, setFormData] = useState({
//     firstName: hr?.name?.split(" ")[0] || "",
//     lastName: hr?.name?.split(" ").slice(1).join(" ") || "",
//     email: hr?.email || "",
//     phone: hr?.phone || "",
//     currentPassword: "",
//     newPassword: "",
//   });

//   // ملاحظة: لو الـ hr لسه بيحمل (Async)، هنحتاج الـ useEffect بس بشرط "التغيير الحقيقي"
//   useEffect(() => {
//     if (hr && !formData.email) {
//       // شرط: لو الـ hr وصل والفورم لسه فاضي، املأ البيانات
//       const names = hr.name?.split(" ") || ["", ""];
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       setFormData({
//         firstName: names[0],
//         lastName: names.slice(1).join(" "),
//         email: hr.email,
//         phone: hr.phone,
//         currentPassword: "",
//         newPassword: "",
//       });
//     }
//   }, [hr]); // المراقبة تكون على الـ hr فقط

//   const handleUpdate = () => {
//     // dispatch(updateHRProfile(formData));
//     alert("Profile Update functionality triggered!");
//   };

//   return (
//     <div className="space-y-12">
//       <section>
//         <h3 className="text-lg font-bold text-gray-200 mb-8">
//           Account information
//         </h3>
//         <div className="flex items-center gap-8 mb-10">
//           <img
//             src={hr?.avatar || hr?.image || defaultAvatar}
//             className="w-24 h-24 rounded-full object-cover border-4 border-[#0b141a] shadow-2xl"
//             alt="me"
//           />
//           <div className="space-y-2">
//             <div className="flex gap-4 text-xs font-black uppercase text-blue-500 tracking-widest">
//               <button className="hover:underline">Change photo</button>
//               <span className="text-gray-800">|</span>
//               <button className="text-pink-600 hover:underline">Delete</button>
//             </div>
//             <p className="text-[10px] text-gray-600 font-medium italic">
//               Max photo size of 2MB (Recommended: 400x400px).
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <InputItem
//             label="First Name"
//             value={formData.firstName}
//             onChange={(v) => setFormData({ ...formData, firstName: v })}
//           />
//           <InputItem
//             label="Last Name"
//             value={formData.lastName}
//             onChange={(v) => setFormData({ ...formData, lastName: v })}
//           />
//           <InputItem
//             label="Email address"
//             value={formData.email}
//             onChange={(v) => setFormData({ ...formData, email: v })}
//           />
//           <InputItem
//             label="Phone Number"
//             value={formData.phone}
//             onChange={(v) => setFormData({ ...formData, phone: v })}
//           />
//         </div>
//       </section>

//       <section className="pt-8 border-t border-gray-800/50">
//         <h3 className="text-lg font-bold text-gray-200 mb-8">Security</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <InputItem label="Current Password" type="password" isPassword />
//           <InputItem label="New Password" type="password" isPassword />
//         </div>
//       </section>

//       <div className="flex justify-end gap-4 pt-10">
//         <button className="px-10 py-3 rounded-2xl border border-gray-800 text-gray-500 font-bold hover:bg-white/5 transition-all">
//           Cancel
//         </button>
//         <button
//           onClick={handleUpdate}
//           className="px-12 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xl shadow-blue-600/10 transition-all active:scale-95"
//         >
//           Update Profile
//         </button>
//       </div>
//     </div>
//   );
// };

// const InputItem = ({
//   label,
//   value,
//   type = "text",
//   isPassword = false,
//   onChange,
// }) => (
//   <div className="space-y-2">
//     <label className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] ml-1">
//       {label}
//     </label>
//     <div className="relative">
//       <input
//         type={type}
//         defaultValue={value}
//         onChange={(e) => onChange?.(e.target.value)}
//         className="w-full bg-[#0b141a] p-4 rounded-2xl border border-gray-800/40 text-sm font-semibold outline-none focus:border-blue-500/50 transition-all"
//       />
//       {isPassword && (
//         <i className="far fa-eye-slash absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer hover:text-gray-400"></i>
//       )}
//     </div>
//   </div>
// );

// export default AccountTab;



import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { updateHRProfile } from "../../store/HrSlices/navbar/hrProfileSlice";
import defaultAvatar from "../../assets/avatars/avatar-default-symbolic-svgrepo-com.svg";

const AccountTab = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { data: hr, loading } = useSelector((state) => state.hrProfile);

  // حالة "هل نحن في وضع التعديل؟"
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    currentPassword: "", newPassword: "",
    location: true, onlineStatus: true, image: ""
  });

  // مزامنة البيانات من الريدوكس للفورم
  useEffect(() => {
    if (hr) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        firstName: hr.general?.firstName || "",
        lastName: hr.general?.lastName || "",
        email: hr.general?.email || "",
        phone: hr.general?.phone || "",
        location: hr.general?.location ?? true,
        onlineStatus: hr.general?.onlineStatus ?? true,
        currentPassword: "",
        newPassword: "",
        image: hr.general?.avatar || ""
      });
    }
  }, [hr, isEditing]); // يعيد ملء البيانات لو ضغطنا Cancel

  const handleUpdateClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      // إرسال التعديلات للباك إيند
      dispatch(updateHRProfile(formData)).then((res) => {
        if (!res.error) setIsEditing(false);
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  if (!hr) return null;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* 1. Account Info Section */}
      <section>
        <h3 className="text-lg font-bold text-gray-200 mb-8 tracking-tight">Account information</h3>
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          <div className="relative group">
            <img 
               src={formData.image || defaultAvatar} 
               className="w-24 h-24 rounded-full object-cover border-4 border-[#0b141a] shadow-2xl bg-gray-800" 
               alt="HR" 
            />
            {/* نقطة الأونلاين تظهر في وضع العرض فقط */}
            {!isEditing && formData.onlineStatus && (
               <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#142129] rounded-full shadow-lg"></div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            {!isEditing ? (
              <div>
                <h2 className="text-2xl font-black text-white">{hr.general?.firstName} {hr.general?.lastName}</h2>
                <p className="text-blue-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                   <span className="bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">HR</span> System Manager
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-4 text-[10px] font-black uppercase text-blue-500 tracking-widest">
                  <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
                  <button onClick={() => fileInputRef.current.click()} className="hover:text-white transition-colors cursor-pointer">Change photo</button>
                  <span className="text-gray-800">|</span>
                  <button onClick={() => setFormData({...formData, image: null})} className="text-pink-600 hover:text-white transition-colors cursor-pointer">Delete</button>
                </div>
                <p className="text-[10px] text-gray-600 font-medium">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputItem label="First Name" value={formData.firstName} disabled={!isEditing} onChange={(v) => setFormData({...formData, firstName: v})} />
          <InputItem label="Last Name" value={formData.lastName} disabled={!isEditing} onChange={(v) => setFormData({...formData, lastName: v})} />
          <InputItem label="Email Address" value={formData.email} disabled={!isEditing} onChange={(v) => setFormData({...formData, email: v})} />
          <InputItem label="Phone Number" value={formData.phone} disabled={!isEditing} onChange={(v) => setFormData({...formData, phone: v})} />
        </div>
      </section>

      {/* 2. Security Section */}
      <section className="pt-8 border-t border-gray-800/50">
        <h3 className="text-lg font-bold text-gray-200 mb-8">Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputItem label="Current Password" type="password" isPassword disabled={!isEditing} value={formData.currentPassword} onChange={(v) => setFormData({...formData, currentPassword: v})} />
          <InputItem label="New Password" type="password" isPassword disabled={!isEditing} value={formData.newPassword} onChange={(v) => setFormData({...formData, newPassword: v})} />
        </div>
      </section>

      {/* 3. Privacy Control Section */}
      <section className="pt-8 border-t border-gray-800/50">
        <h3 className="text-lg font-bold text-gray-200 mb-8 font-bold">Privacy control</h3>
        <div className="space-y-8">
          <ToggleItem 
            label="Location" 
            desc="Location tracking for remote work security." 
            enabled={formData.location} 
            disabled={!isEditing}
            onToggle={() => setFormData({...formData, location: !formData.location})} 
          />
          <ToggleItem 
            label="Online status" 
            desc="Do Not Disturb mode to hide online status after 6 PM." 
            enabled={formData.onlineStatus} 
            disabled={!isEditing}
            onToggle={() => setFormData({...formData, onlineStatus: !formData.onlineStatus})} 
          />
        </div>
      </section>

      {/* 4. Action Buttons */}
      <div className="flex justify-end gap-4 pt-10 border-t border-gray-800/20">
        {isEditing && (
          <button 
            onClick={() => setIsEditing(false)}
            className="px-10 py-3 rounded-2xl border border-gray-800 text-gray-500 font-bold hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
        )}
        <button 
          onClick={handleUpdateClick}
          disabled={loading}
          className={`px-12 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-xl ${
            isEditing 
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20" 
            : "bg-[#1c2e38] text-gray-300 hover:bg-[#253a47]"
          }`}
        >
          {loading ? "Saving..." : isEditing ? "Save Changes" : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

// مكون الإدخال الفرعي
const InputItem = ({ label, value, type="text", isPassword=false, disabled, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] ml-1">{label}</label>
    <div className="relative">
      <input 
        type={type} 
        value={value} 
        readOnly={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-4 rounded-2xl border transition-all text-sm font-semibold outline-none ${
          disabled 
          ? 'bg-transparent border-transparent text-gray-400 cursor-default' 
          : 'bg-[#0b141a] border-gray-800 text-white focus:border-blue-500/50 shadow-inner'
        }`} 
      />
      {isPassword && !disabled && <i className="far fa-eye-slash absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"></i>}
    </div>
  </div>
);

// مكون التوجل الفرعي
const ToggleItem = ({ label, desc, enabled, disabled, onToggle }) => (
  <div className="flex items-center justify-between group">
    <div>
      <h5 className={`text-sm font-bold mb-1 ${disabled ? 'text-gray-500' : 'text-gray-200'}`}>{label}</h5>
      <p className="text-[11px] text-gray-600 font-medium">{desc}</p>
    </div>
    <button 
      onClick={disabled ? null : onToggle}
      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
        enabled ? 'bg-blue-500' : 'bg-gray-800'
      } ${disabled ? 'opacity-30 cursor-default' : 'cursor-pointer hover:brightness-110'}`}
    >
      <motion.div animate={{ x: enabled ? 26 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md" />
    </button>
  </div>
);

export default AccountTab;