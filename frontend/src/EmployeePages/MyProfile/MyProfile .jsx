import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyHRProfile, updateHRProfile } from "../../store/HrSlices/navbar/hrProfileSlice.js"; 
import { 
  Mail, Phone, MapPin, Briefcase, Clock, Edit3, 
  Camera, Check, X, Save
} from "lucide-react";
import defaultAvatar from "../../assets/avatars/avatar-default-symbolic-svgrepo-com.svg";

const MyProfile = () => {
  const dispatch = useDispatch();
  const { data: user, loading, error } = useSelector((state) => state.hrProfile);
  
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    gender: "",
    avatarFile: null,
    avatarPreview: null
  });

  // التحكم في إخفاء الرسالة تلقائياً بعد 3 ثوانٍ
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    dispatch(fetchMyHRProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user && user.general) {
      setFormData({
        firstName: user.general.firstName || "",
        lastName: user.general.lastName || "",
        phone: user.general.phone || "",
        address: user.general.address || "",
        gender: user.general.gender || "Male",
        avatarFile: null,
        avatarPreview: null
      });
    }
  }, [user]);

  const renderAvatar = () => {
    if (formData.avatarPreview) return formData.avatarPreview;
    if (user?.general?.avatar) {
      const path = user.general.avatar;
      if (path.startsWith('http')) return path;
      const baseUrl = import.meta.env.VITE_API_URL || "https://grad-project-hrms-production-7.up.railway.app";
      return `${baseUrl}${path}?t=${Date.now()}`;
    }
    return defaultAvatar;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) setMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage(null);
    if (user && user.general) {
      setFormData({
        firstName: user.general.firstName || "",
        lastName: user.general.lastName || "",
        phone: user.general.phone || "",
        address: user.general.address || "",
        gender: user.general.gender || "Male",
        avatarFile: null,
        avatarPreview: null
      });
    }
  };

  const handleSave = async () => {
    const dataToSend = new FormData();
    dataToSend.append("general[firstName]", formData.firstName);
    dataToSend.append("general[lastName]", formData.lastName);
    dataToSend.append("general[phone]", formData.phone);
    dataToSend.append("general[address]", formData.address);
    dataToSend.append("general[gender]", formData.gender);

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
        await dispatch(fetchMyHRProfile()); 
      } else {
        setMessage({ type: "error", text: resultAction.payload || "Update failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong" });
    }
  };

  if (loading && !user) return <div className="flex justify-center items-center h-screen text-blue-500 animate-pulse font-bold tracking-widest">Loading Profile...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!user) return null;

  const general = user?.general || {};
  const employee = user?.employee || {};
  const _id = user?._id || "";

  const cardStyle = {
    background: 'linear-gradient(to bottom right, var(--card-from) 0%, var(--card-to) 100%)',
    borderColor: 'var(--card-border)'
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-deep)', color: 'var(--text-main)' }} className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      
      {/* Toast Feedback - تم نقله للأسفل يميناً */}
      {message && (
        <div className={`fixed bottom-10 right-10 z-50 p-5 rounded-2xl shadow-2xl border flex items-center gap-4 animate-in slide-in-from-right-10 duration-300 ${message.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
          <div className={`p-2 rounded-full ${message.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {message.type === 'success' ? <Check size={20}/> : <X size={20}/>}
          </div>
          <span className="font-black text-sm tracking-wide">{message.text}</span>
        </div>
      )}

      {/* 1. Header Profile Card */}
      <div style={cardStyle} className="rounded-[2.5rem] border p-6 mb-8 shadow-xl relative overflow-hidden transition-all">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="relative group">
            <img
              src={renderAvatar()}
              alt="Profile"
              style={{ borderColor: 'var(--card-border)' }}
              className="w-36 h-36 rounded-full border-4 object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105"
              onError={(e) => { e.target.src = defaultAvatar; }}
            />
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={28} />
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if(file) setFormData({...formData, avatarFile: file, avatarPreview: URL.createObjectURL(file)});
                }} />
              </label>
            )}
            <div className="absolute bottom-3 right-3 w-6 h-6 bg-green-500 border-4 rounded-full shadow-lg" style={{ borderColor: 'var(--card-to)' }}></div>
          </div>

          <div className="flex-1 text-center md:text-left pt-2">
            <h1 className="text-4xl font-black tracking-tight mb-1">
              {general?.firstName} {general?.lastName}
            </h1>
            <p className="text-blue-500 font-bold mb-6 uppercase text-xs tracking-[0.3em]">{employee?.jobTitle}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
              <BadgeItem icon={<Briefcase size={14}/>} text={`#${_id?.slice(-7).toUpperCase()}`} />
              <BadgeItem icon={<MapPin size={14}/>} text={employee?.workLocation || "Remote"} />
              <BadgeItem icon={<Clock size={14}/>} text={employee?.jobType || "Full-time"} />
            </div>
          </div>

          <div className="flex gap-3">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl transition-all text-sm font-bold shadow-lg shadow-blue-500/25 active:scale-95"
              >
                <Edit3 size={18} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancel} className="bg-red-500/10 text-red-500 p-3 rounded-2xl hover:bg-red-500/20 transition-all">
                  <X size={22} />
                </button>
                <button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-green-500/25 font-bold">
                  {loading ? "Saving..." : <><Save size={18}/> Save Changes</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Personal Information Section */}
          <section style={cardStyle} className="border rounded-[2.5rem] p-10 shadow-xl">
            <h3 className="text-lg font-black uppercase tracking-widest mb-10 opacity-80">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
              <InfoItem label="First Name" value={general?.firstName} isEditing={isEditing} name="firstName" formValue={formData.firstName} onChange={handleChange} />
              <InfoItem label="Last Name" value={general?.lastName} isEditing={isEditing} name="lastName" formValue={formData.lastName} onChange={handleChange} />
              
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-50 text-[var(--text-muted)]">Gender</p>
              
                  
                  <p className="text-[16px] font-black tracking-tight">{general?.gender}</p>
                
              </div>
              
              <InfoItem label="Nationality" value="Egyptian" />
            </div>
          </section>

          {/* Address Section */}
          <section style={cardStyle} className="border rounded-[2.5rem] p-10 shadow-xl">
            <h3 className="text-lg font-black uppercase tracking-widest mb-10 opacity-80">Address Information</h3>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-50 text-[var(--text-muted)]">Residential Address</p>
              {isEditing ? (
                <textarea 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  className="w-full bg-[var(--bg-deep)] border border-[var(--card-border)] rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none text-[var(--text-main)] min-h-[120px]" 
                />
              ) : (
                <p className="text-[15px] font-bold leading-relaxed">{general?.address || "Address not provided"}</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          <section style={cardStyle} className="border rounded-[2.5rem] p-10 shadow-xl">
            <h3 className="text-lg font-black uppercase tracking-widest mb-10 opacity-80">Contact</h3>
            <div className="space-y-8">
              <ContactItem icon={<Mail size={18}/>} label="Work Email" value={general?.email} />
              <ContactItem 
                icon={<Phone size={18}/>} 
                label="Phone Number" 
                value={general?.phone} 
                isEditing={isEditing} 
                name="phone" 
                formValue={formData.phone} 
                onChange={handleChange} 
              />
            </div>
          </section>

          <section style={cardStyle} className="border rounded-[2.5rem] p-10 shadow-xl">
            <h3 className="text-lg font-black uppercase tracking-widest mb-10 opacity-80">Employment</h3>
            <div className="space-y-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-5 opacity-40">Department</p>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                  <span className="text-base font-black tracking-tight">{employee?.department}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[var(--card-border)]">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-40 mb-2">Joined Date</p>
                  <p className="text-xs font-black">{new Date(employee?.joiningDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-40 mb-2">Salary</p>
                  <p className="text-xs font-black text-green-500">{employee?.baseSalary} EGP</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- المكونات المساعدة ---

const BadgeItem = ({ icon, text }) => (
  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[var(--card-border)] bg-[var(--bg-deep)] text-[var(--text-muted)] shadow-inner hover:scale-105 transition-transform">
    <span className="text-blue-500">{icon}</span>
    <span className="font-bold tracking-tight text-[11px]">{text}</span>
  </div>
);

const InfoItem = ({ label, value, isEditing, name, formValue, onChange }) => (
  <div className="flex flex-col gap-2">
    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-50 text-[var(--text-muted)]">{label}</p>
    {isEditing && onChange ? (
      <input 
        name={name} 
        value={formValue} 
        onChange={onChange} 
        className="w-full bg-[var(--bg-deep)] border border-[var(--card-border)] rounded-xl p-3 text-sm font-bold text-[var(--text-main)] outline-none focus:border-blue-500" 
      />
    ) : (
      <p className="text-[16px] font-black tracking-tight">{value || "—"}</p>
    )}
  </div>
);

const ContactItem = ({ icon, label, value, isEditing, name, formValue, onChange }) => (
  <div className="flex items-start gap-5 group">
    <div className="p-4 rounded-2xl border border-[var(--card-border)] bg-[var(--bg-deep)] text-[var(--text-muted)] shadow-inner group-hover:text-blue-500 transition-colors">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">{label}</p>
      {isEditing && onChange ? (
        <input 
          name={name} 
          value={formValue} 
          onChange={onChange} 
          className="w-full bg-[var(--bg-deep)] border border-[var(--card-border)] rounded-xl p-2 text-xs font-bold text-[var(--text-main)] outline-none focus:border-blue-500" 
        />
      ) : (
        <p className="text-sm font-black break-all tracking-tight">{value}</p>
      )}
    </div>
  </div>
);

export default MyProfile;