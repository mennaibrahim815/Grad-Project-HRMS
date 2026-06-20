
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSettings } from '../../store/HrSlices/navbar/settingsSlice';
import { Camera } from 'lucide-react';

const GeneralTab = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  // جلب بيانات المستخدم لمعرفة الرتبة (لإظهار حقول الشركة للمدير فقط)
  const { data: userProfile } = useSelector((state) => state.hrProfile);
  const userRole = userProfile?.general?.role; 
  
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

  const validate = () => {
    const newErrors = {};
    const cutoff = Number(formData.payrollCutoffDay);
    if (cutoff < 21 || cutoff > 28) {
      newErrors.payrollCutoffDay = "Payroll cutoff day must be between 21 and 28";
    }

    if (userRole === 'MANAGER') {
      if (!formData.companyName) newErrors.companyName = "Company name is required";
      if (!formData.companyEmail) newErrors.companyEmail = "Company email is required";
    }
    
    if (formData.annualLeaves < 0) newErrors.annualLeaves = "Must be positive";
    if (formData.casualLeaves < 0) newErrors.casualLeaves = "Must be positive";
    if (formData.sickLeaves < 0) newErrors.sickLeaves = "Must be positive";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return; 

    const submitData = new FormData();
    if (userRole === 'MANAGER') {
      submitData.append('companyName', formData.companyName);
      submitData.append('companyEmail', formData.companyEmail);
      if (logoFile) submitData.append('companyLogo', logoFile);
    }
    submitData.append('timeZone', formData.timeZone);
    submitData.append('payrollCutoffDay', formData.payrollCutoffDay);
    submitData.append('leaveBalance[annual]', formData.annualLeaves);
    submitData.append('leaveBalance[casual]', formData.casualLeaves);
    submitData.append('leaveBalance[sick]', formData.sickLeaves);

    dispatch(updateSettings(submitData));
  };

  // تنسيق موحد للـ Inputs ليدعم الثيمين
  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--border-main)',
    color: 'var(--text-main)',
  };

  return (
    <div className="space-y-6" style={{ color: 'var(--text-main)' }}>
      
      {/* 1. معلومات الشركة (للمدير فقط) */}
      {userRole === 'MANAGER' && (
        <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }} className="border rounded-2xl p-6">
          <h3 className="text-base font-semibold mb-6">Company Identity</h3>
          
          <div className="flex flex-col md:flex-row gap-8 items-start mb-6">
            <div className="relative group">
              <div style={{ backgroundColor: 'var(--bg-deep)', borderColor: 'var(--border-main)' }} className="w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden">
                {previewLogo ? (
                  <img src={previewLogo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Camera style={{ color: 'var(--text-muted)' }} size={30} />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current.click()}
                className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-all shadow-lg"
              >
                <Camera size={16} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Company Name</label>
                <input 
                  type="text" name="companyName" value={formData.companyName} onChange={handleChange} 
                  style={inputStyle} className="border rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all" 
                />
                {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Company Email</label>
                <input 
                  type="email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} 
                  style={inputStyle} className="border rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all" 
                />
                {errors.companyEmail && <p className="text-red-500 text-xs">{errors.companyEmail}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. الإعدادات الإقليمية والمالية */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }} className="border rounded-2xl p-6">
        <h3 className="text-base font-semibold mb-5">Regional & Financials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>System Timezone</label>
            <select name="timeZone" value={formData.timeZone} onChange={handleChange} style={inputStyle} className="border rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all">
              <option value="Africa/Cairo">Africa/Cairo (EET)</option>
              <option value="Asia/Riyadh">Africa/Cairo (AST)</option>
              <option value="Asia/Dubai">Africa/Cairo (GST)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Payroll Cutoff Day</label>
            <input 
              type="number" name="payrollCutoffDay" value={formData.payrollCutoffDay} onChange={handleChange} 
              style={inputStyle} className="border rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all" 
            />
            {errors.payrollCutoffDay && <p className="text-red-500 text-xs">{errors.payrollCutoffDay}</p>}
          </div>
        </div>
      </div>

      {/* 3. رصيد الإجازات السنوي الافتراضي */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }} className="border rounded-2xl p-6">
        <h3 className="text-base font-semibold mb-2">Default Annual Leaves (Days)</h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Set the global baseline configuration for new employees.</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Annual</label>
            <input type="number" name="annualLeaves" value={formData.annualLeaves} onChange={handleChange} style={inputStyle} className="border rounded-xl p-3 text-sm text-center outline-none" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Casual</label>
            <input type="number" name="casualLeaves" value={formData.casualLeaves} onChange={handleChange} style={inputStyle} className="border rounded-xl p-3 text-sm text-center outline-none" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Sick</label>
            <input type="number" name="sickLeaves" value={formData.sickLeaves} onChange={handleChange} style={inputStyle} className="border rounded-xl p-3 text-sm text-center outline-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button 
          onClick={handleSave} 
          disabled={loading} 
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 active:scale-95"
        >
          {loading ? 'Saving...' : 'Update Settings'}
        </button>
      </div>
    </div>
  );
};

export default GeneralTab;