import { useState } from 'react';
import Modal from '../../../Components/UI/Modal/Modal';
import ModalHeader from '../../../Components/UI/Modal/ModalHeader';
import AddEmployeeSteps from './AddEmployeeSteps';
import GeneralStep from './steps/GeneralStep';
import ExperianceStep from './steps/ExperianceStep';
import EmployeeStep from './steps/EmployeeStep';
import Button from '../../../Components/UI/Button';
import api from "../../../services/axios";
import { motion, AnimatePresence } from "framer-motion";


const AddEmployeeModal = ({ open, onClose,onSuccess }) => {
  // const [step, setStep] = useState(1);
  const [[step, direction], setStep] = useState([1, 0]);
  const [formData, setFormData] = useState({
    general: {
    image: '',
    firstName: '',
    lastName:'',
    rfidTag:'',
    role:'',
    email: '',
    phone: '',
    gender: '',
    address: '',
  },
   experience: {
    company: '',
    position: '',
    jobType: '',
    salary: '',
    startDate: '',
    endDate: '',
  },
 employee: {
  jobTitle: '',
  department: '',
  workLocation: '',
  jobType: 'Full-time',
  joiningDate: '',
  baseSalary: '',
  workingHours: 8,
  status: 'Active',
  leaveBalance: {
    annual: 21,
    sick: 30,
    casual: 6
  }
},


  });
   const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};
  

const updateGeneral = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    general: {
      ...prev.general,
      [field]: value,
    },
  }));
};
const updateExperience = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    experience: {
      ...prev.experience,
      [field]: value,
    },
  }));
};
const updateEmployee = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    employee: {
      ...prev.employee,
      [field]: value,
    },
  }));
};

const handleSubmit = async () => {
  try {
    const fd = new FormData();

    //General fields
    fd.append("general[firstName]", formData.general.firstName);
    fd.append("general[lastName]", formData.general.lastName);
    fd.append("general[email]", formData.general.email);
    fd.append("general[phone]", formData.general.phone);
    fd.append("general[gender]", formData.general.gender);
    fd.append("general[address]", formData.general.address);
    fd.append("general[rfidTag]", formData.general.rfidTag);
    fd.append("general[role]", formData.general.role);

    
    if (formData.general.image instanceof File) {
    console.log("Image type:", typeof formData.general.image);
    console.log("Is File?:", formData.general.image instanceof File);
    console.log("Image value:", formData.general.image);
    fd.append("general[avatar]", formData.general.image);
    }

    // Experience fields
    fd.append("experience[company]", formData.experience.company);
    fd.append("experience[position]", formData.experience.position);
    fd.append("experience[jobType]", formData.experience.jobType);
    fd.append("experience[baseSalary]", Number(formData.experience.salary));
    fd.append("experience[startDate]", formData.experience.startDate);
    fd.append("experience[endDate]", formData.experience.endDate);

    // Employee fields
    fd.append("employee[jobTitle]", formData.employee.jobTitle);
    fd.append("employee[department]", formData.employee.department);
    fd.append("employee[workLocation]", formData.employee.workLocation);
    fd.append("employee[jobType]", formData.employee.jobType);
    fd.append("employee[joiningDate]", formData.employee.joiningDate);
    fd.append("employee[baseSalary]", Number(formData.employee.baseSalary));
    fd.append("employee[workingHours]", Number(formData.employee.workingHours));
    fd.append("employee[status]", formData.employee.status);
    fd.append("employee[leaveBalance][annual]", Number(formData.employee.leaveBalance.annual));
    fd.append("employee[leaveBalance][sick]", Number(formData.employee.leaveBalance.sick));
    fd.append("employee[leaveBalance][casual]", Number(formData.employee.leaveBalance.casual));

    const response = await api.post("/auth/register", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data?.status === "success") {
      onSuccess?.();
      onClose();
    }

  } catch (error) {
    console.error("Backend Error:", error.response?.data);
    alert(`Error: ${error.response?.data?.message || "Check required fields"}`);
  }
};




const isStepValid = () => {
  if (step === 1) {
    const { firstName,lastName,rfidTag,role, email, phone, gender, address } = formData.general;
    return Boolean(firstName &&lastName&&rfidTag&&role&& email && phone && gender && address);
  }
if (step === 2) {
  const { company, position, jobType, salary, startDate, endDate } = formData.experience;
  return Boolean(company && position && jobType && salary && startDate && endDate);
}



  if (step === 3) {
  const { jobTitle, department, workLocation, jobType, joiningDate, baseSalary,workingHours } = formData.employee;
  return Boolean(jobTitle && department && workLocation && jobType && joiningDate && baseSalary&&workingHours);
}
 


 


  return false;
};



  return (
  <Modal open={open} onClose={onClose}>
  <ModalHeader title="Add employee" onClose={onClose} />

  <AddEmployeeSteps
    currentStep={step}
    onStepChange={(nextStep) => {
  if (nextStep > step && isStepValid()) {
    setStep(nextStep);
  }
}}

  />


  <div className="flex flex-col h-full">

  {/* Content */}
  {/* <div className="flex-1 px-4"> */}
    <div className="flex-1 px-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
  <AnimatePresence mode="wait" custom={direction}>
    <motion.div
      key={step}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className=" w-full"
    >
      {step === 1 && (
        <GeneralStep
          data={formData.general}
          onChange={updateGeneral}
        />
      )}

      {step === 2 && (
        <ExperianceStep
          data={formData.experience}
          onChange={updateExperience}
        />
      )}

      {step === 3 && (
        <EmployeeStep
          data={formData.employee}
          onChange={updateEmployee}
        />
      )}

    </motion.div>
  </AnimatePresence>
</div>
    {/* {step === 1 && (
      <GeneralStep
        data={formData.general}
        onChange={updateGeneral}
      />
    )}
    {step === 2 && (
   <ExperianceStep
    data={formData.experience}
    onChange={updateExperience}
  />
)}
    {step === 3 && (
  <EmployeeStep
    data={formData.employee}
    onChange={updateEmployee}
  />
)}

  {step === 4 && (
  <PayrollStep
    data={formData.payroll}
    onChange={updatePayroll}
  />
)} */}
 
  {/* </div> */}
  <div className="flex items-center gap-4 px-4 pb-4 pt-3">

  {step > 1 && (
    <button
      type="button"
      // onClick={() => setStep(step - 1)}
      onClick={() => setStep(([prev]) => [prev - 1, -1])}
      className="w-14 h-14 shrink-0 rounded-full border border-gray-500 flex items-center justify-center text-white hover:bg-gray-700 transition"
    >
      ←
    </button>
  )}

  <Button
    type="button"
    disabled={!isStepValid()}
    onClick={() => {
      if (!isStepValid()) return; // أمان زيادة

      if (step === 3) {
        handleSubmit();
      } else {
        // setStep((s) => s + 1);
        setStep(([prev]) => [prev + 1, 1]);
      }
    }}
    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition
      ${
        !isStepValid()
          ? 'bg-gray-600 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
      }`}
  >
    {step === 3 ? 'Save Employee' : 'Continue →'}
  </Button>

</div>


</div>


</Modal>

  );
};

export default AddEmployeeModal;
