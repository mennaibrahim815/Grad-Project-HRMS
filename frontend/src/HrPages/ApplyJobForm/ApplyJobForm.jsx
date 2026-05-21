import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { applyToJob } from "../../store/HrSlices/careersSlice/careersSlice";
import icon from "../../assets/icons/Icon.svg";

import FormProgress from "../../HrComponents/HiringComponents/apply-job/FormProgress";
import Step1PersonalInfo from "../../HrComponents/HiringComponents/apply-job/steps/Step1PersonalInfo";
import Step2ProfessionalInfo from "../../HrComponents/HiringComponents/apply-job/steps/Step2ProfessionalInfo";
import Step3Documents from "../../HrComponents/HiringComponents/apply-job/steps/Step3Documents";
import Step4Success from "../../HrComponents/HiringComponents/apply-job/steps/Step4Success";

const validate = (formData, step) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (step === 1) {
        if (!formData.firstName || formData.firstName.trim().length < 3)
            errors.firstName = "First name must be at least 3 characters";
        if (!formData.lastName || formData.lastName.trim().length < 3)
            errors.lastName = "Last name must be at least 3 characters";
        if (!formData.email || !emailRegex.test(formData.email))
            errors.email = "Enter a valid email address";
        if (!formData.phone || formData.phone.replace(/\D/g, "").length < 6)
            errors.phone = "Phone must be at least 6 digits";
        if (!formData.gender) errors.gender = "Gender is required";
        if (!formData.department) errors.department = "Department is required";
        if (!formData.experienceLevel) errors.experienceLevel = "Experience level is required";
    }

    if (step === 2) {
        if (!formData.educationLevel) errors.educationLevel = "Education level is required";
    }

    if (step === 3) {
        if (!formData.resume) errors.resume = "Resume is required";
        if (!formData.motivation || formData.motivation.trim().length < 10)
            errors.motivation = "Please write at least 10 characters";
        if (!formData.earliestStartDate) errors.earliestStartDate = "Start date is required";
        if (!formData.workPreference) errors.workPreference = "Work preference is required";
    }

    return errors;
};

const variants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: (dir) => ({ x: dir < 0 ? 60 : -60, opacity: 0, transition: { duration: 0.2 } }),
};

const STEPS = ["Personal Info", "Professional", "Documents", "Done"];

const ApplyJobForm = () => {
    const { id: jobId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { applyLoading } = useSelector((state) => state.careers);

    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [apiError, setApiError] = useState(null);

    const [formData, setFormData] = useState({
        avatar: null,
        firstName: "", lastName: "", email: "", phone: "",
        gender: "Male", dateOfBirth: "", city: "", country: "",
        department: "UI Design", experienceLevel: "Junior",
        yearsOfExperience: "", currentJobTitle: "", currentCompany: "",
        educationLevel: "Bachelor's", skills: [],
        resume: null, portfolio: "",
        motivation: "", earliestStartDate: "", workPreference: "Remote",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const stepErrors = validate(formData, step);
        if (stepErrors[field]) setErrors((prev) => ({ ...prev, [field]: stepErrors[field] }));
    };

    const handleNext = () => {
        const stepErrors = validate(formData, step);
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            const allTouched = Object.keys(stepErrors).reduce((acc, k) => ({ ...acc, [k]: true }), {});
            setTouched((prev) => ({ ...prev, ...allTouched }));
            return;
        }
        setDirection(1);
        setStep((s) => s + 1);
        setErrors({});
    };

    const handleBack = () => {
        setDirection(-1);
        setStep((s) => s - 1);
        setErrors({});
    };

    const handleSubmit = () => {
        const stepErrors = validate(formData, 3);
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            const allTouched = Object.keys(stepErrors).reduce((acc, k) => ({ ...acc, [k]: true }), {});
            setTouched((prev) => ({ ...prev, ...allTouched }));
            return;
        }

        setApiError(null);
        const form = new FormData();
        if (formData.avatar) form.append("personalInfo[avatar]", formData.avatar);
        form.append("personalInfo[firstName]", formData.firstName);
        form.append("personalInfo[lastName]", formData.lastName);
        form.append("personalInfo[email]", formData.email);
        form.append("personalInfo[phone]", formData.phone);
        form.append("personalInfo[gender]", formData.gender);
        form.append("personalInfo[department]", formData.department);
        form.append("personalInfo[experienceLevel]", formData.experienceLevel);
        if (formData.dateOfBirth) form.append("personalInfo[dateOfBirth]", formData.dateOfBirth);
        if (formData.city) form.append("personalInfo[city]", formData.city);
        if (formData.country) form.append("personalInfo[country]", formData.country);

        form.append("professionalInfo[educationLevel]", formData.educationLevel);
        if (formData.yearsOfExperience) form.append("professionalInfo[yearsOfExperience]", formData.yearsOfExperience);
        if (formData.currentJobTitle) form.append("professionalInfo[currentJobTitle]", formData.currentJobTitle);
        if (formData.currentCompany) form.append("professionalInfo[currentCompany]", formData.currentCompany);
        formData.skills.forEach((skill, i) => form.append(`professionalInfo[skills][${i}]`, skill));

        form.append("documents[resume]", formData.resume);
        if (formData.portfolio) form.append("documents[portfolio]", formData.portfolio);

        form.append("additionalQuestions[motivation]", formData.motivation);
        form.append("additionalQuestions[earliestStartDate]", formData.earliestStartDate);
        form.append("additionalQuestions[workPreference]", formData.workPreference);
        for (let [key, value] of form.entries()) {
            console.log(key, value);
        }
        dispatch(applyToJob({ jobId, formData: form }))
            .unwrap()
            .then(() => { setDirection(1); setStep(4); })
            .catch((err) => {
                console.log("Full error from API:", err);
                const msg = Array.isArray(err)
                    ? err.map((e) => e.message).join(", ")
                    : err?.message || "Something went wrong.";
                setApiError(msg);
            });
    };

    const stepProps = { formData, handleChange, handleBlur, errors, touched };

    return (
        <div className="min-h-screen flex flex-col">

            {/* Navbar */}
            <nav className="w-full flex items-center justify-between px-8 py-4
                            border-b border-white/8 backdrop-blur-sm sticky top-0 z-50">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img src={icon} alt="Staffly" className="w-8 h-8" />
                    <span className="text-xl text-white font-bold italic">
                        Staf<span className="text-blue-500">fly</span>
                    </span>
                </div>

                {/* Back to Listings */}
                <button
                    type="button"
                    onClick={() => navigate("/apply-job")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl
                               border border-white/10 bg-white/5 hover:bg-white/10
                               text-slate-300 text-sm font-medium transition-all"
                >
                    <i className="fas fa-arrow-left text-xs" />
                    Back to Listings
                </button>
            </nav>

            {/* Form Content */}
            <div className="flex flex-col items-center px-4 py-10 flex-1">
                <div className="w-full max-w-2xl">

                    {step < 4 && <FormProgress currentStep={step} steps={STEPS} />}

                    <div className="relative overflow-hidden mt-8">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={step}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                            >
                                {step === 1 && <Step1PersonalInfo {...stepProps} onNext={handleNext} />}
                                {step === 2 && <Step2ProfessionalInfo {...stepProps} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />}
                                {step === 3 && <Step3Documents {...stepProps} setFormData={setFormData} onSubmit={handleSubmit} onBack={handleBack} loading={applyLoading} apiError={apiError} />}
                                {step === 4 && <Step4Success />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplyJobForm;