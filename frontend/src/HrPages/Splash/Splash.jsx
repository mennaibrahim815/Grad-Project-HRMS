// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Splash = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="h-screen w-full flex flex-col md:flex-row bg-[#0b141a] text-white overflow-hidden">
//       {/*  بالتقديم على وظيفة */}
//       <div
//         onClick={() => navigate("/job")}
//         className="flex-1 flex flex-col items-center justify-center cursor-pointer group transition-all duration-500 hover:bg-[#142129] relative border-b md:border-b-0 md:border-r border-gray-800"
//       >
//         <div className="z-10 text-center">
//           <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
//             <i className="fas fa-briefcase text-2xl text-blue-400"></i>
//           </div>
//           <h2 className="text-3xl font-bold mb-2">التقديم على وظيفة</h2>
//           <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
//             اكتشف الفرص المتاحة وانضم لفريقنا
//           </p>
//         </div>
//       </div>

//       {/* بتسجيل الدخول */}
//       <div
//         onClick={() => navigate("/login")}
//         className="flex-1 flex flex-col items-center justify-center cursor-pointer group transition-all duration-500 hover:bg-[#142129] relative"
//       >
//         <div className="z-10 text-center">
//           <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
//             <i className="fas fa-user-shield text-2xl text-blue-400"></i>
//           </div>
//           <h2 className="text-3xl font-bold mb-2">تسجيل الدخول (HR)</h2>
//           <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
//             إدارة النظام والموظفين
//           </p>
//         </div>
//       </div>

//       {/* لوجو الشركة */}
//       <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
//         <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold italic">
//           S
//         </div>
//         <span className="text-2xl font-bold tracking-tight">Staffly</span>
//       </div>
//     </div>
//   );
// };

// export default Splash;





import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // لإضافة لمسة جمالية في الدخول
import icon from "../../assets/icons/Icon.svg"; // تأكدي من مسار الأيقونة الصحيح

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-[#0b141a] flex flex-col relative overflow-hidden font-sans">
      
      {/* 1. اللوجو العلوي (Staffly) - في المنتصف تماماً فوق الفاصل */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
        <img src={icon} alt="Staffly Logo" className="w-12 h-12 shadow-lg shadow-blue-500/20" />
        <span className="text-2xl font-bold text-white tracking-tight italic">
          Staf<span className="text-blue-500">fly</span>
        </span>
      </div>

      {/* 2. الحاوية الرئيسية مقسمة لنصفين */}
      <div className="flex flex-col md:flex-row h-full">
        
        {/* النصف الأيسر: التقديم على وظيفة */}
        <div className="flex-1 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
          <div className="w-[340px] p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] text-center backdrop-blur-md shadow-2xl">
            {/* أيقونة الشنطة */}
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/5">
              <i className="fas fa-briefcase text-2xl text-blue-300"></i>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Apply for a job</h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-10 px-2">
              Start your career journey with us. Explore opportunities that match your expertise and passion.
            </p>
            
            <button 
              onClick={() => navigate("/job")}
              className="w-full bg-[#a5c0f3] hover:bg-blue-300 text-[#0b141a] py-3.5 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/10"
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* النصف الأيمن: تسجيل الدخول */}
        <div className="flex-1 flex items-center justify-center bg-[#0d1820]">
          <div className="w-[340px] p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] text-center backdrop-blur-md shadow-2xl">
            {/* أيقونة الدرع */}
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/5">
              <i className="fas fa-shield-alt text-2xl text-blue-400"></i>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Login</h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-10">
              For HR and Employees
            </p>
            
            <button 
              onClick={() => navigate("/login")}
              className="w-full border-2 border-white/20 hover:border-white/40 text-white py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              Login Now
            </button>
          </div>
        </div>

      </div>

      {/* لمسات جمالية في الخلفية (إضاءة خافتة) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
};

export default Splash;