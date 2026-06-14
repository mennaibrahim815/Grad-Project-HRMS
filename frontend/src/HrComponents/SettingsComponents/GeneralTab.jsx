import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSettings } from '../../store/HrSlices/navbar/settingsSlice';

const GeneralTab = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { data: settings, loading } = useSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    timeZone: '',
    payrollCutoffDay: '',
    annualLeaves: '',
    casualLeaves: '',
    sickLeaves: ''
  });
  
  const [errors, setErrors] = useState({});
  const [previewLogo, setPreviewLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName || '',
        companyEmail: settings.companyEmail || '',
        timeZone: settings.timeZone || 'Africa/Cairo',
        payrollCutoffDay: settings.payrollCutoffDay || 25,
        annualLeaves: settings.leaveBalance?.annual || 21,
        casualLeaves: settings.leaveBalance?.casual || 6,
        sickLeaves: settings.leaveBalance?.sick || 30,
      });
      setPreviewLogo(settings.companyLogo);
    }
  }, [settings]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  // دالة التحقق المعدلة
  const validate = () => {
    const newErrors = {};
    
    // التحقق من نطاق يوم قبض المرتبات (بين 21 و 28)
    const cutoff = Number(formData.payrollCutoffDay);
    if (cutoff < 21 || cutoff > 28) {
      newErrors.payrollCutoffDay = "Payroll cutoff day must be between 21 and 28";
    }

    // التحقق من الحقول الإجبارية
    if (!formData.companyName) newErrors.companyName = "Company name is required";
    if (!formData.companyEmail) newErrors.companyEmail = "Company email is required";
    
    if (formData.annualLeaves < 0) newErrors.annualLeaves = "Must be positive";
    if (formData.casualLeaves < 0) newErrors.casualLeaves = "Must be positive";
    if (formData.sickLeaves < 0) newErrors.sickLeaves = "Must be positive";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    // مانع الحفظ في حالة وجود أخطاء
    if (!validate()) {
      return; 
    }

    const submitData = new FormData();
    submitData.append('companyName', formData.companyName);
    submitData.append('companyEmail', formData.companyEmail);
    submitData.append('timeZone', formData.timeZone);
    submitData.append('payrollCutoffDay', formData.payrollCutoffDay);
    
    submitData.append('leaveBalance[annual]', formData.annualLeaves);
    submitData.append('leaveBalance[casual]', formData.casualLeaves);
    submitData.append('leaveBalance[sick]', formData.sickLeaves);

    if (logoFile) submitData.append('companyLogo', logoFile);
    
    dispatch(updateSettings(submitData));
  };

  return (
    <div className="space-y-6 text-slate-300">
      <div className="bg-[#111c24] border border-slate-800/60 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-5">Company Information</h3>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">Company Name</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="bg-[#16252f] border border-slate-700/70 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500" />
            {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">Company Email</label>
            <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} className="bg-[#16252f] border border-slate-700/70 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500" />
            {errors.companyEmail && <p className="text-red-500 text-xs">{errors.companyEmail}</p>}
          </div>
        </div>
      </div>

      <div className="bg-[#111c24] border border-slate-800/60 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-5">Regional & Financials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">System Timezone</label>
            <select name="timeZone" value={formData.timeZone} onChange={handleChange} className="bg-[#16252f] border border-slate-700/70 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500">
              <option value="Africa/Cairo">Africa/Cairo (EET)</option>
              <option value="Asia/Riyadh">Asia/Riyadh (AST)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">Payroll Cutoff Day</label>
            <input 
              type="number" 
              name="payrollCutoffDay" 
              value={formData.payrollCutoffDay} 
              onChange={handleChange} 
              className="bg-[#16252f] border border-slate-700/70 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500" 
            />
            {errors.payrollCutoffDay && <p className="text-red-500 text-xs">{errors.payrollCutoffDay}</p>}
          </div>
        </div>
      </div>

      <div className="bg-[#111c24] border border-slate-800/60 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-2">Default Annual Leaves (Days)</h3>
        <p className="text-xs text-slate-500 mb-5">Set the global baseline configuration for new employees.</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">Annual</label>
            <input type="number" name="annualLeaves" value={formData.annualLeaves} onChange={handleChange} className="bg-[#16252f] border border-slate-700/70 rounded-xl p-3 text-sm text-white text-center outline-none" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">Casual</label>
            <input type="number" name="casualLeaves" value={formData.casualLeaves} onChange={handleChange} className="bg-[#16252f] border border-slate-700/70 rounded-xl p-3 text-sm text-white text-center outline-none" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">Sick</label>
            <input type="number" name="sickLeaves" value={formData.sickLeaves} onChange={handleChange} className="bg-[#16252f] border border-slate-700/70 rounded-xl p-3 text-sm text-white text-center outline-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all disabled:opacity-50">
          {loading ? 'Saving...' : 'Update Settings'}
        </button>
      </div>
    </div>
  );
};

export default GeneralTab;