
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSettings } from '../../store/HrSlices/navbar/settingsSlice';

const AccessTab = () => {
  const dispatch = useDispatch();
  const { data: settings, loading } = useSelector((state) => state.settings);

  const [shift, setShift] = useState({
    workStartTime: '09:00',
    workEndTime: '17:00',
    gracePeriod: 30,
    maxDelayMinutes: 120,
    minutesMultiplier: 2
  });

  const [weekEnds, setWeekEnds] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (settings) {
      setShift({
        workStartTime: settings.workStartTime ?? '09:00',
        workEndTime: settings.workEndTime ?? '17:00',
        gracePeriod: settings.gracePeriod ?? 30,
        maxDelayMinutes: settings.maxDelayMinutes ?? 120,
        minutesMultiplier: settings.minutesMultiplier ?? 2
      });
      setWeekEnds(settings.weekEnds ?? []);
    }
  }, [settings]);

  const handleToggleWeekend = (dayNumber) => {
    setWeekEnds((prev) =>
      prev.includes(dayNumber)
        ? prev.filter((d) => d !== dayNumber)
        : [...prev, dayNumber].sort()
    );
  };

  const validate = () => {
    const newErrors = {};
    if (shift.gracePeriod < 0 || shift.gracePeriod > 60) {
      newErrors.gracePeriod = "Grace period must be between 0 and 60";
    }
    if (shift.maxDelayMinutes < 60) {
      newErrors.maxDelayMinutes = "Max delay must be at least 60 minutes";
    }
    if (shift.minutesMultiplier < 1 || shift.minutesMultiplier > 4) {
      newErrors.minutesMultiplier = "Multiplier must be between 1 and 4";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!settings || !validate()) return;

    const payload = {
      companyName: settings?.companyName ?? "",
      companyEmail: settings?.companyEmail ?? "",
      companyLogo: settings?.companyLogo ?? "",
      workStartTime: shift.workStartTime,
      workEndTime: shift.workEndTime,
      gracePeriod: Number(shift.gracePeriod),
      maxDelayMinutes: Number(shift.maxDelayMinutes),
      minutesMultiplier: Number(shift.minutesMultiplier),
      weekEnds,
      leaveBalance: {
        annual: Number(settings?.leaveBalance?.annual ?? 21),
        sick: Number(settings?.leaveBalance?.sick ?? 30),
        casual: Number(settings?.leaveBalance?.casual ?? 6),
      }
    };
    dispatch(updateSettings(payload));
  };

  const daysOfWeek = [
    { name: 'Sunday', num: 0 }, { name: 'Monday', num: 1 }, { name: 'Tuesday', num: 2 },
    { name: 'Wednesday', num: 3 }, { name: 'Thursday', num: 4 }, { name: 'Friday', num: 5 },
    { name: 'Saturday', num: 6 }
  ];

  if (!settings?.companyName) return null;

  // تنسيق موحد للـ Inputs
  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--border-main)',
    color: 'var(--text-main)',
  };

  return (
    <div className="space-y-6" style={{ color: 'var(--text-main)' }}>
      
      {/* 1. Shift Timing */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }} className="border rounded-2xl p-6">
        <h3 className="text-base font-bold mb-5">Shift & Working Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Standard Start Time</label>
            <input 
              type="time" value={shift.workStartTime} 
              onChange={(e) => setShift({...shift, workStartTime: e.target.value})} 
              style={inputStyle} className="border rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Standard End Time</label>
            <input 
              type="time" value={shift.workEndTime} 
              onChange={(e) => setShift({...shift, workEndTime: e.target.value})} 
              style={inputStyle} className="border rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all" 
            />
          </div>
        </div>
      </div>

      {/* 2. Weekends Integration */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }} className="border rounded-2xl p-6">
        <h3 className="text-base font-bold mb-2">Company Weekly Holidays</h3>
        <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>Toggle on the official days-off for attendance calculations.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {daysOfWeek.map((day) => {
            const isWeekend = weekEnds.includes(day.num);
            return (
              <div 
                key={day.num} 
                style={{ backgroundColor: 'var(--bg-deep)', borderColor: 'var(--border-main)' }}
                className="border rounded-xl p-4 flex items-center justify-between transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold">{day.name}</h4>
                  <p className="text-[10px] font-medium uppercase tracking-tight" style={{ color: isWeekend ? '#3b82f6' : 'var(--text-muted)' }}>
                    {isWeekend ? 'Official Holiday' : 'Working Day'}
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleToggleWeekend(day.num)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${isWeekend ? 'bg-blue-600' : 'bg-gray-400 dark:bg-slate-700'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isWeekend ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Late & Penalty Policies */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }} className="border rounded-2xl p-6">
        <h3 className="text-base font-bold mb-5">Late & Delay Policies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Grace Period (Mins)</label>
            <input 
              type="number" value={shift.gracePeriod} 
              onChange={(e) => setShift({...shift, gracePeriod: Number(e.target.value)})} 
              style={inputStyle} className="border rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all" 
            />
            {errors.gracePeriod && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.gracePeriod}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Max Delay (Mins)</label>
            <input 
              type="number" value={shift.maxDelayMinutes} 
              onChange={(e) => setShift({...shift, maxDelayMinutes: Number(e.target.value)})} 
              style={inputStyle} className="border rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all" 
            />
            {errors.maxDelayMinutes && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.maxDelayMinutes}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Deduction Mult. (x)</label>
            <input 
              type="number" value={shift.minutesMultiplier} 
              onChange={(e) => setShift({...shift, minutesMultiplier: Number(e.target.value)})} 
              style={inputStyle} className="border rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all" 
            />
            {errors.minutesMultiplier && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.minutesMultiplier}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-8 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 active:scale-95 min-w-[200px]"
        >
          {loading ? 'Saving Policies...' : 'Save Access Policies'}
        </button>
      </div>
    </div>
  );
};

export default AccessTab;