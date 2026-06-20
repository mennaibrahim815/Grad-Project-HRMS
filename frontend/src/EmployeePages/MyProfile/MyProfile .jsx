import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyHRProfile } from "../../store/HrSlices/navbar/hrProfileSlice.js"; // تأكدي من المسار الصحيح
import { 
  Mail, Phone, MapPin, Calendar, User, 
  Briefcase, ShieldCheck, Clock, Edit3, MoreHorizontal 
} from "lucide-react";
import defaultAvatar from "../../assets/avatars/avatar-default-symbolic-svgrepo-com.svg";

const MyProfile = () => {
  const dispatch = useDispatch();
  const { data: user, loading, error } = useSelector((state) => state.hrProfile);
  const [activeTab, setActiveTab] = useState("Personal");

  useEffect(() => {
    dispatch(fetchMyHRProfile());
  }, [dispatch]);

  if (loading) return <div className="flex justify-center items-center h-screen text-cyan-400 animate-pulse">Loading Profile...</div>;
  if (!user) return <div className="text-white text-center mt-10">No user data found.</div>;

  // استخراج البيانات للسهولة
  const { general, employee, _id } = user;

  return (
    <div className="min-h-screen  text-slate-200 p-4 md:p-8">
      {/* Header Profile Card */}
      <div className="bg-[#111827] rounded-2xl border border-slate-800 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <img
              src={general?.avatar || ""}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-slate-700 object-cover"
            />
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-[#111827] rounded-full"></div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white">{`${general?.firstName} ${general?.lastName}`}</h1>
            <p className="text-blue-400 font-medium mb-4">{employee?.jobTitle}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full">
                <Briefcase size={14} /> <span>#{_id?.slice(-7).toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full">
                <MapPin size={14} /> <span>{employee?.workLocation || "Remote"}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full">
                <Clock size={14} /> <span>Local Time: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all text-sm">
              <Edit3 size={16} /> Edit Profile
            </button>
            {/* <button className="p-2 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700">
              <MoreHorizontal size={20} />
            </button> */}
          </div>
        </div>

        {/* Tabs */}
        {/* <div className="flex gap-8 mt-8 border-b border-slate-800">
          {["Personal", "Job", "Documents", "Assets"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                activeTab === tab ? "text-blue-500" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />}
            </button>
          ))}
        </div> */}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Personal Info & Address */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Personal Information */}
          <section className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Personal Information</h3>
              <Edit3 size={18} className="text-slate-500 cursor-pointer hover:text-white" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
              <InfoItem label="Full Name" value={`${general?.firstName} ${general?.lastName}`} />
              {/* <InfoItem label="Date of Birth" value="" />  */}
              {/* بيانات ثابتة لعدم وجودها في الريسبونس */}
              <InfoItem label="Nationality" value="Egyptian" />
              <InfoItem label="Gender" value={general?.gender} />
              {/* <InfoItem label="Marital Status" value="Single" /> */}
              {/* <InfoItem label="Social Security (Last 4)" value="****-**-6789" /> */}
            </div>
          </section>

          {/* Address Section */}
          <section className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Address</h3>
              <Edit3 size={18} className="text-slate-500 cursor-pointer hover:text-white" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Residential Address</p>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {general?.address || "Address not provided"} <br />
                  {employee?.workLocation}, Egypt
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Address Type</p>
                <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded">Primary Residence</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Contact & Employment */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Contact Details */}
          <section className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Contact Details</h3>
              <Edit3 size={18} className="text-slate-500 cursor-pointer hover:text-white" />
            </div>
            <div className="space-y-5">
              <ContactItem icon={<Mail size={16}/>} label="Work Email" value={general?.email} />
              <ContactItem icon={<Mail size={16}/>} label="Personal Email" value={`p.${general?.email}`} />
              <ContactItem icon={<Phone size={16}/>} label="Phone Number" value={general?.phone} />
              <ContactItem icon={<Phone size={16}/>} label="Work Mobile" value="Not provided" />
            </div>
          </section>

          {/* Employment Details */}
          <section className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Employment</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Department</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">{employee?.department}</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Reporting To</p>
                <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white">HR</div>
                  <div>
                    <p className="text-sm font-medium text-white">HR Manager</p>
                    <p className="text-[10px] text-slate-500">System Admin</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Date Joined</p>
                  <p className="text-sm font-medium">{new Date(employee?.joiningDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Contract</p>
                  <span className="text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">
                    {employee?.jobType}
                  </span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

// مكونات صغيرة مساعدة (Sub-components)
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm font-medium text-slate-200">{value || "—"}</p>
  </div>
);

const ContactItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-slate-800 rounded-lg text-blue-400">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-slate-500 uppercase">{label}</p>
      <p className="text-sm font-medium text-slate-300 break-all">{value}</p>
    </div>
  </div>
);

export default MyProfile;