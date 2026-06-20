export const validators = {
  general: {
    firstName: (v) =>
      !v || v.trim().length < 3 ? "First name must be at least 3 characters" : "",
    lastName: (v) =>
      !v || v.trim().length < 3 ? "Last name must be at least 3 characters" : "",
    email: (v) =>
      !v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Please enter a valid email address" : "",
    rfidTag: (v) =>
      !v || v.trim().length !== 8 ? "RFID tag must be 8 characters" : "",
    phone: (v) =>
      !v || v.replace(/\D/g, "").length < 6 ? "Phone number must be at least 6 digits" : "",
    gender: (v) =>
      v && !["Male", "Female"].includes(v) ? "Gender must be Male or Female" : "",
    address: (v) =>
      !v || v.trim().length === 0 ? "Address is required" : "",
  },

  // كل حقول experience اختيارية في الباك، بس لو اتملت لازم تكون صحيحة
  experience: {
    jobType: (v) =>
      v && !["Full-time", "Part-time", "Internship", "Contract"].includes(v)
        ? "Invalid job type"
        : "",
    salary: (v) =>
      v !== "" && v !== undefined && Number(v) < 0 ? "Salary must be a positive number" : "",
    startDate: () => "",
    endDate: (v, data) => {
      if (data?.startDate && v && new Date(v) < new Date(data.startDate)) {
        return "End date must be after start date";
      }
      return "";
    },
  },

  employee: {
    jobTitle: (v) =>
      !v || v.trim().length === 0 ? "Job title is required" : "",
    department: (v) =>
      !v || v.trim().length === 0 ? "Department is required" : "",
    workLocation: (v) =>
      !v || v.trim().length === 0 ? "Work location is required" : "",
    jobType: (v) =>
      v && !["Full-time", "Part-time", "Internship"].includes(v) ? "Invalid job type" : "",
    workingHours: (v) => {
      const n = Number(v);
      if (!v || isNaN(n) || n < 4 || n > 12) return "Working hours must be between 4 and 12";
      return "";
    },
    joiningDate: (v) =>
      !v ? "Joining date is required" : "",
    baseSalary: (v) => {
      const n = Number(v);
      if (!v || isNaN(n) || n <= 0) return "Base salary is required and must be greater than 0";
      return "";
    },
    status: (v) =>
      v && !["Active", "Archived"].includes(v) ? "Status must be Active or Archived" : "",
  },
};

// الحقول الإجبارية فقط (للتحقق من صلاحية الخطوة كاملة)
export const requiredFields = {
  general: ["firstName", "lastName", "email", "rfidTag", "phone", "address"],
  experience: [], // مفيش حقول إجبارية في experience
  employee: ["jobTitle", "department", "workLocation", "workingHours", "joiningDate", "baseSalary"],
};

// تشيك على حقل واحد وترجع رسالة الإيرور أو ""
export const validateField = (section, field, value, allData) => {
  const fn = validators[section]?.[field];
  return fn ? fn(value, allData) : "";
};

// تشيك على خطوة كاملة وترجع object فيه كل الإيرورز
export const validateStep = (section, data) => {
  const errors = {};
  const fields = Object.keys(validators[section] || {});
  fields.forEach((field) => {
    const err = validateField(section, field, data[field], data);
    if (err) errors[field] = err;
  });
  return errors;
};

// هل الخطوة valid (الحقول الإجبارية موجودة وكلها بدون إيرور)؟
export const isStepComplete = (section, data) => {
  const required = requiredFields[section] || [];
  // كل الحقول الإجبارية لازم تكون موجودة
  const hasAllRequired = required.every((f) => {
    const val = data[f];
    return val !== "" && val !== undefined && val !== null;
  });
  if (!hasAllRequired) return false;

  // وكل الحقول (إجبارية أو اختيارية لو مكتوبة) لازم تعدي الـ validation
  const errors = validateStep(section, data);
  return Object.keys(errors).length === 0;
};