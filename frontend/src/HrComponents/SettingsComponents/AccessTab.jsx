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
  const [errors, setErrors] = useState({}); // State لتخزين الأخطاء

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

    if (!Array.isArray(weekEnds)) {
      newErrors.weekEnds = "Weekends must be an array";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!settings) return;
    
    if (!validate()) return; // التأكد من صحة البيانات قبل الحفظ

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
    { name: 'Sunday', num: 0 },
    { name: 'Monday', num: 1 },
    { name: 'Tuesday', num: 2 },
    { name: 'Wednesday', num: 3 },
    { name: 'Thursday', num: 4 },
    { name: 'Friday', num: 5 },
    { name: 'Saturday', num: 6 }
  ];

  if (!settings?.companyName || !settings?.companyEmail) {
    console.warn("Settings not loaded yet");
    return null;
  }

  return (
    <div className="space-y-6 text-slate-300">
      
      {/* Shift Timing */}
      <div className="bg-[#111c24] border border-slate-800/60 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-5">Shift & Working Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">Standard Start Time</label>
            <input 
              type="time" 
              value={shift.workStartTime} 
              onChange={(e) => setShift({...shift, workStartTime: e.target.value})} 
              className="bg-[#16252f] border border-slate-700/70 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500 transition-colors" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">Standard End Time</label>
            <input 
              type="time" 
              value={shift.workEndTime} 
              onChange={(e) => setShift({...shift, workEndTime: e.target.value})} 
              className="bg-[#16252f] border border-slate-700/70 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500 transition-colors" 
            />
          </div>
        </div>
      </div>

      {/* Weekends Integration */}
      <div className="bg-[#111c24] border border-slate-800/60 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-2">Company Weekly Holidays (Weekends)</h3>
        <p className="text-xs text-slate-500 mb-5">Toggle on the official days-off for attendance calculations.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {daysOfWeek.map((day) => {
            const isWeekend = weekEnds.includes(day.num);
            return (
              <div key={day.num} className="bg-[#15232d] border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">{day.name}</h4>
                  <p className="text-xs text-slate-500">{isWeekend ? 'Official Holiday' : 'Working Day'}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleToggleWeekend(day.num)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${isWeekend ? 'bg-blue-600' : 'bg-slate-700'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isWeekend ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            );
          })}
        </div>
        {errors.weekEnds && <p className="text-red-500 text-xs mt-2">{errors.weekEnds}</p>}
      </div>

      {/* Late & Penalty Policies */}
      <div className="bg-[#111c24] border border-slate-800/60 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-5">Late & Delay Policies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">Grace Period (Minutes)</label>
            <input 
              type="number" 
              value={shift.gracePeriod} 
              onChange={(e) => setShift({...shift, gracePeriod: Number(e.target.value)})} 
              className="bg-[#16252f] border border-slate-700/70 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500 transition-colors" 
            />
            {errors.gracePeriod && <p className="text-red-500 text-xs">{errors.gracePeriod}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">Max Allowed Delay (Mins)</label>
            <input 
              type="number" 
              value={shift.maxDelayMinutes} 
              onChange={(e) => setShift({...shift, maxDelayMinutes: Number(e.target.value)})} 
              className="bg-[#16252f] border border-slate-700/70 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500 transition-colors" 
            />
            {errors.maxDelayMinutes && <p className="text-red-500 text-xs">{errors.maxDelayMinutes}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">Deduction Multiplier (x)</label>
            <input 
              type="number" 
              value={shift.minutesMultiplier} 
              onChange={(e) => setShift({...shift, minutesMultiplier: Number(e.target.value)})} 
              className="bg-[#16252f] border border-slate-700/70 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500 transition-colors" 
            />
            {errors.minutesMultiplier && <p className="text-red-500 text-xs">{errors.minutesMultiplier}</p>}
          </div>
          
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] flex items-center justify-center"
        >
          {loading ? 'Saving Policies...' : 'Save Access Policies'}
        </button>
      </div>
    </div>
  );
};

export default AccessTab;