import {
  Pencil,
  Briefcase,
  Calendar,
  UserCircle,
  Building,
  Mail,
  Phone,
} from "lucide-react";
import BaseCard from "../../../../components/UI/Card";

import { useDispatch, useSelector } from "react-redux";
import { updateEmployee,fetchEmployeeById } from "../../../../store/HrSlices/employeeSlice";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
      <Icon size={12} />
      <span>{label}</span>
    </div>
    <span className="text-white text-xs font-medium">{value}</span>
  </div>
);
const FormField = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs text-slate-400">{label}</label>
    {children}
  </div>
);
const EmployeeProfileCard = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); 
  const { employeeDetail: emp, loading } = useSelector((state) => state.employees);

  useEffect(() => {
    if (id) dispatch(fetchEmployeeById(id));
  }, [id, dispatch]);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (emp) setFormData(emp);
  }, [emp]);

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (!emp) return null;


  const fullName = `${emp.general?.firstName} ${emp.general?.lastName}`;
  const avatar = emp.general?.avatar;
  const gender = emp.general?.gender;
  const email = emp.general?.email;
  const phone = emp.general?.phone;
  const department = emp.employee?.department;
  const jobTitle = emp.employee?.jobTitle;
  const jobType = emp.employee?.jobType;
  const joiningDate = emp.employee?.joiningDate?.split("T")[0]; // تقطع الوقت
  const role = emp.general?.role;

const handleChange = (e, section) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [section]: {
      ...prev[section],
      [name]: value,
    },
  }));
};

 const handleSave = () => {
  dispatch(updateEmployee({
    id: emp._id,
    updatedData: {
      general: {
        firstName: formData.general?.firstName,
        lastName: formData.general?.lastName,
        phone: formData.general?.phone,
        gender: formData.general?.gender,
        address: formData.general?.address,
        avatar: formData.general?.avatar,
      },
      employee: {
        jobTitle: formData.employee?.jobTitle,
        department: formData.employee?.department,
        jobType: formData.employee?.jobType,
        workLocation: formData.employee?.workLocation,
      }
    }
  }));
  setEditMode(false);
};

  const handleCancel = () => {
    setFormData(emp);
    setEditMode(false);
  };

  return (
    <BaseCard className="flex flex-col md:flex-row gap-5 relative">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src={avatar}
          alt={fullName}
          className="w-28 h-32 md:w-32 md:h-36 rounded-xl object-cover"
        />
      </div>

      <div className="flex-1">
        {!editMode && (
          <>
            <h2 className="text-xl font-semibold text-white mb-2">{fullName}</h2>
            <div className="flex gap-3 mb-5">
              <span className="text-slate-400 text-sm">{gender}</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-25 gap-y-4">
              <InfoItem icon={Briefcase} label="Job Type" value={jobType} />
              <InfoItem icon={Calendar} label="Joining" value={joiningDate} />
              <InfoItem icon={UserCircle} label="Role" value={role} />
              <InfoItem icon={Building} label="Department" value={department} />
              <InfoItem icon={Mail} label="Email" value={email} />
              <InfoItem icon={Phone} label="Phone" value={phone} />
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50"
            >
              <Pencil size={16} className="text-slate-300" />
            </button>
          </>
        )}

   
        {editMode && (
  <form className="space-y-4">
    {/* Name */}
    <div className="grid grid-cols-2 gap-4">
      <FormField label="First Name">
        <input
          name="firstName"
          value={formData.general?.firstName || ""}
          onChange={(e) => handleChange(e, "general")}
          className="bg-slate-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-400"
        />
      </FormField>
      <FormField label="Last Name">
        <input
          name="lastName"
          value={formData.general?.lastName || ""}
          onChange={(e) => handleChange(e, "general")}
          className="bg-slate-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-400"
        />
      </FormField>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
      {/* Phone */}
      <FormField label="Phone">
        <input
          name="phone"
          value={formData.general?.phone || ""}
          onChange={(e) => handleChange(e, "general")}
          className="bg-slate-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-400"
        />
      </FormField>

      {/* Gender */}
      <FormField label="Gender">
        <select
          name="gender"
          value={formData.general?.gender || ""}
          onChange={(e) => handleChange(e, "general")}
          className="bg-slate-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </FormField>

      {/* Address */}
      <FormField label="Address">
        <input
          name="address"
          value={formData.general?.address || ""}
          onChange={(e) => handleChange(e, "general")}
          className="bg-slate-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-400"
        />
      </FormField>

      {/* Job Title */}
      <FormField label="Job Title">
        <input
          name="jobTitle"
          value={formData.employee?.jobTitle || ""}
          onChange={(e) => handleChange(e, "employee")}
          className="bg-slate-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-400"
        />
      </FormField>

      {/* Department */}
      <FormField label="Department">
        <input
          name="department"
          value={formData.employee?.department || ""}
          onChange={(e) => handleChange(e, "employee")}
          className="bg-slate-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-400"
        />
      </FormField>

      {/* Job Type */}
      <FormField label="Job Type">
        <select
          name="jobType"
          value={formData.employee?.jobType || ""}
          onChange={(e) => handleChange(e, "employee")}
          className="bg-slate-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
      </FormField>

      {/* Work Location */}
      <FormField label="Work Location">
        <select
          name="workLocation"
          value={formData.employee?.workLocation || ""}
          onChange={(e) => handleChange(e, "employee")}
          className="bg-slate-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="Remote">Remote</option>
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </FormField>

      {/* Joining Date - disabled */}
      <FormField label="Joining Date">
        <input
          value={formData.employee?.joiningDate?.split("T")[0] || ""}
          disabled
          className="bg-slate-800 text-white p-2 rounded opacity-60"
        />
      </FormField>

      {/* Role - disabled */}
      <FormField label="Role">
        <input
          value={formData.general?.role || ""}
          disabled
          className="bg-slate-800 text-white p-2 rounded opacity-60"
        />
      </FormField>
    </div>

    {/* Buttons */}
    <div className="flex gap-3 mt-4">
      <button type="button" onClick={handleSave} disabled={loading}
        className="bg-blue-500 px-4 py-2 rounded text-white">
        {loading ? "Saving..." : "Save"}
      </button>
      <button type="button" onClick={handleCancel}
        className="bg-slate-600 px-4 py-2 rounded text-white">
        Cancel
      </button>
    </div>
  </form>
)}
      </div>
    </BaseCard>
  );
};

export default EmployeeProfileCard;