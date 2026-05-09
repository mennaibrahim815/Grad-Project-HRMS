import {
  Pencil,
  Briefcase,
  Calendar,
  UserCircle,
  Building,
  Mail,
  Phone,
} from "lucide-react";
import BaseCard from "../../../UI/Card";

import { useDispatch, useSelector } from "react-redux";
import { updateEmployee } from "../../../../store/HrSlices/employeeSlice";
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
const EmployeeProfileCard = ({ employee }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.employees);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(employee);

  useEffect(() => {
    setFormData(employee);
  }, [employee]);

  if (!employee) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    dispatch(
      updateEmployee({
        id: employee.id,
        updatedData: formData,
      }),
    );
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(employee);
    setEditMode(false);
  };

  return (
    <BaseCard className="flex flex-col md:flex-row gap-5 relative">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src={employee.image}
          alt={employee.name}
          className="w-28 h-32 md:w-32 md:h-36 rounded-xl object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1">
        {/* ======= NORMAL MODE ======= */}
        {!editMode && (
          <>
            <h2 className="text-xl font-semibold text-white mb-2">
              {employee.name}
            </h2>
            <div className="flex gap-3 mb-5">
              <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                <span className="text-cyan-400">&#9794;</span> {employee.gender}
              </span>
              <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                <UserCircle size={14} /> {employee.age}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              <InfoItem
                icon={Briefcase}
                label="Job type"
                value={employee.type}
              />
              <InfoItem
                icon={Calendar}
                label="Joining"
                value={employee.joiningDate}
              />
              <InfoItem icon={UserCircle} label="Role" value={employee.role} />
              <InfoItem
                icon={Building}
                label="Departement"
                value={employee.department}
              />
              <InfoItem icon={Mail} label="Email" value={employee.email} />
              <InfoItem icon={Phone} label="Phone" value={employee.phone} />
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
              aria-label="Edit profile"
            >
              <Pencil size={16} className="text-slate-300" />
            </button>
          </>
        )}

        {/* ======= EDIT MODE ======= */}
        {editMode && (
          <form className="space-y-4">
            {/* Name */}

            <FormField label="Name">
              <input
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="bg-slate-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-400"
              />
            </FormField>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              {/* Job Type (Select) */}
              <FormField label="Job Type">
                <select
                  name="type"
                  value={formData.type || ""}
                  onChange={handleChange}
                  className="bg-slate-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </FormField>
              {/* Joining (Disabled) */}
              <FormField label="Joining">
                <input
                  value={formData.joiningDate || ""}
                  disabled
                  className="bg-slate-800 text-white p-2 rounded opacity-60"
                />
              </FormField>
              {/* Role (Disabled) */}
              <FormField label="Role">
                <input
                  value={formData.role || ""}
                  disabled
                  className="bg-slate-800 text-white p-2 rounded opacity-60"
                />
              </FormField>

              {/* Department (Select) */}
              <FormField label="Departmen">
                <select
                  name="department"
                  value={formData.department || ""}
                  onChange={handleChange}
                  className="bg-slate-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </FormField>
              {/* Email */}
              <FormField label="Email">
                <input
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="bg-slate-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-400"
                />
              </FormField>
              {/* Phone */}
              <FormField label="phone">
                <input
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="bg-slate-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-400"
                />
              </FormField>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-500 px-4 py-2 rounded text-white"
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="bg-slate-600 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </BaseCard>
  );
};

// const EmployeeProfileCard = ({ employee, onEdit }) => {
//   const dispatch = useDispatch();
//   const { loading } = useSelector(state => state.employees);

//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState(employee);
//     // update values
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };
//   // Save values
//     const handleSave = () => {
//     dispatch(
//       updateEmployee({
//         id: employee.id,
//         updatedData: formData
//       })
//     );
//     setEditMode(false);
//   };

//   return (
// <BaseCard className="flex flex-col md:flex-row gap-5 relative">
//   {/* Edit button */}
// <button
//   onClick={onEdit}
//   className="absolute top-5 right-5 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
//   aria-label="Edit profile"
// >
//   <Pencil size={16} className="text-slate-300" />
// </button>

//   {/* Avatar */}
//   <div className="flex-shrink-0">
//     <img
//       src={employee.image}
//       alt={employee.name}
//       className="w-28 h-32 md:w-32 md:h-36 rounded-xl object-cover"
//     />
//   </div>

//       {/* Info */}
//       <div className="flex-1">
// <h2 className="text-xl font-semibold text-white mb-2">{employee.name}</h2>
// <div className="flex gap-3 mb-5">
//   <span className="flex items-center gap-1.5 text-slate-400 text-sm">
//     <span className="text-cyan-400">&#9794;</span> {employee.gender}
//   </span>
//   <span className="flex items-center gap-1.5 text-slate-400 text-sm">
//     <UserCircle size={14} /> {employee.age}
//   </span>
// </div>

// <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
//   <InfoItem icon={Briefcase} label="Job type" value={employee.type} />
//   <InfoItem icon={Calendar} label="Joining" value={employee.joiningDate} />
//   <InfoItem icon={UserCircle} label="Role" value={employee.role} />
//   <InfoItem icon={Building} label="Departement" value={employee.department} />
//   <InfoItem icon={Mail} label="Email" value={employee.email} />
//   <InfoItem icon={Phone} label="Phone" value={employee.phone} />
// </div>
//       </div>
//     </BaseCard>
//   )
// }

export default EmployeeProfileCard;
