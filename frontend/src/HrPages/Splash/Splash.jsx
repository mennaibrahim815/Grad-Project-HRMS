import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../../assets/icons/Icon.svg";
import { motion, AnimatePresence } from "framer-motion";

import {
  Clock,
  CreditCard,
  CheckSquare,
  ArrowRight,
  Globe,
  Users,
} from "lucide-react";

const SplashPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");

  // دالة لمراقبة التمرير وتغيير القسم النشط
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "features", "about"];
      const scrollPosition = window.scrollY + 200; // إزاحة بسيطة لتفعيل القسم قبل وصوله تماماً

      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + height
          ) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // دالة التمرير السلس
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#0b141a] text-white font-sans selection:bg-blue-500/30">
      {/* --- الناف بار الثابت (Fixed Navbar) --- */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#0b141a]/80 backdrop-blur-sm border-b border-white/5 ">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          {/* اللوجو */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection("home")}
          >
            <div className="w-9 flex items-center justify-center">
              <img src={icon} alt="Logo" className="w-8 h-8" />
            </div>

            <span className="text-xl text-white font-bold italic">
              Staf<span className="text-blue-500">fly</span>
            </span>
          </div>

          {/* روابط التنقل (تتغير حسب السكرول) */}
          <div className="hidden md:flex items-center gap-10">
            {["Home", "Features", "About"].map((item) => {
              const id = item.toLowerCase();
              return (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`relative text-sm font-medium transition-all duration-300 pb-1 ${
                    activeSection === id
                      ? "text-blue-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item}
                  {/* الخط اللي تحت الكلمة لما تكون نشطة */}
                  {activeSection === id && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 border border-white/10 rounded-lg text-sm font-semibold text-blue-500 hover:bg-white/5 transition-all"
          >
            Portal Login
          </button>
        </div>
      </nav>

      {/* --- محتوى الصفحة مقسم لـ IDs --- */}

      {/* 1. قسم الهيرو (Home) */}
      <section
        id="home"
        className="min-h-screen pt-32 pb-20 px-6 text-center flex flex-col items-center justify-center relative"
      >
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -z-10"></div>

        {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs mb-12 uppercase tracking-widest font-bold">
          The Future of Workforce Management
        </div> */}

        <div className="inline-flex items-center gap-4 pl-1.5 pr-6 py-1.5 mb-11 rounded-full bg-[#0d141c] bg-[#0B1220]/90 border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.15)] backdrop-blur-md">
          {/* الدائرة المحيطة بالأيقونة */}
          <div className="w-7 h-7 rounded-full border border-cyan-500/30 flex items-center justify-center">
            {/* الأيقونة باستخدام وسم i (تأكدي من استدعاء FontAwesome في مشروعك) */}
            <i className="fas fa-shield-alt text-[12px] text-cyan-500"></i>
          </div>

          {/* النص مع التباعد الكبير بين الحروف */}
          <span className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.25em]">
            The Future of Workforce Management
          </span>
        </div>

        <h1 className="text-3xl md:text-6xl font-bold max-w-6xl mx-auto leading-tight mb-8">
          Next-Gen HR &{" "}
          <span className="text-blue-500">Recruitment Platform</span>
        </h1>

        <p className="text-gray-400 max-w-3xl mx-auto mb-12 text-xl leading-relaxed">
          Streamline your entire employee lifecycle with precision. From
          AI-driven talent acquisition to automated payroll and real-time
          performance analytics.
        </p>

        <button
          onClick={() => navigate("/apply-job")}
          className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-blue-600/30 active:scale-95"
        >
          Explore Job Board (Apply Now) <ArrowRight size={20} />
        </button>
      </section>

      {/* 2. قسم المميزات (Features) */}
      <section
        id="features"
        className="relative py-20 px-6 max-w-7xl mx-auto overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-cyan-500/10 blur-[140px] pointer-events-none"></div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative z-10">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-blue-500 mb-8">
              Our Features
            </h2>

            <p className="text-[#94A3B8] text-[15px] leading-[1.9]">
              Engineered for high-performance teams. Deploy modules that scale
              with your organizational complexity without sacrificing
              simplicity.
            </p>
          </div>

          <div className="flex items-center gap-2 mb-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ width: ["5px", "40px", "5px"] }}
                transition={{
                  repeat: Infinity,
                  repeatDelay: 1.8 * 2, // وقت انتظار الـ dots التانية
                  duration: 1.8,
                  delay: i * 1.8,
                  ease: "easeInOut",
                }}
                className="h-[5px] rounded-full bg-[#00A3FF] shadow-[0_0_15px_rgba(0,163,255,0.8)]"
              />
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 relative z-10">
          {/* CARD 1 */}
          <div
            className="
      relative overflow-hidden rounded-[28px]
      bg-[linear-gradient(180deg,#0F1C2B_0%,#09121D_100%)]
      border border-white/[0.06]
      shadow-[0_10px_40px_rgba(0,0,0,0.45)]
      p-8 
      transition-all duration-500
      hover:-translate-y-2
      group
    "
          >
            {/* Left Glow Border */}
            <div className="absolute left-0 top-6 bottom-6 w-[2px] bg-[#00A3FF]/40 rounded-full"></div>

            {/* Top Light */}
            <div className="absolute inset-0 rounded-[28px] border-t border-white/10 pointer-events-none"></div>

            {/* Background Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top,#00a3ff15,transparent_70%)]"></div>

            {/* Icon */}
            <div
              className="
        w-14 h-14 rounded-2xl
        bg-[#172637]
        border border-white/[0.04]
        flex items-center justify-center
        shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
        mb-10
      "
            >
              <i className="far fa-clock text-[#0094FF] text-[26px] drop-shadow-[0_0_12px_rgba(0,163,255,0.9)]"></i>
            </div>

            {/* Title */}
            <h3 className="text-[#E2E8F0] text-[22px] font-semibold mb-5 tracking-[-0.02em]">
              Smart Attendance
            </h3>

            {/* Desc */}
            <p className="text-[#94A3B8] text-[15px] leading-[1.9] mb-14">
              Geofenced check-ins and facial recognition attendance tracking
              integrated with real-time reporting.
            </p>

            {/* Footer */}
            <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[#00A3FF] text-[11px] font-semibold tracking-[0.25em] uppercase">
                Live Tracking
              </span>

              <i className="fas fa-arrow-trend-up text-[#CBD5E1] text-sm"></i>
            </div>
          </div>

          {/* CARD 2 */}
          <div
            className="
      relative overflow-hidden rounded-[28px]
      bg-[linear-gradient(180deg,#0F1C2B_0%,#09121D_100%)]
      border border-white/[0.06]
      shadow-[0_10px_40px_rgba(0,0,0,0.45)]
      p-8
      transition-all duration-500
      hover:-translate-y-2
      group
    "
          >
            <div className="absolute left-0 top-6 bottom-6 w-[2px] bg-[#4ADE80]/40 rounded-full"></div>

            <div className="absolute inset-0 rounded-[28px] border-t border-white/10 pointer-events-none"></div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top,#4ade8015,transparent_70%)]"></div>

            <div
              className="
        w-14 h-14 rounded-2xl
        bg-[#132B27]
        border border-white/[0.04]
        flex items-center justify-center
        shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
        mb-10
      "
            >
              <i className="fas fa-money-check-dollar text-[#69F0AE] text-[24px] drop-shadow-[0_0_12px_rgba(52,211,153,0.9)]"></i>
            </div>

            <h3 className="text-[#E2E8F0] text-[22px] font-semibold mb-5 tracking-[-0.02em]">
              Precision Payroll
            </h3>

            <p className="text-[#94A3B8] text-[15px] leading-[1.9] mb-14">
              Automated multi-currency payroll processing with instant tax
              compliance and localized benefit management.
            </p>

            <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[#69F0AE] text-[11px] font-semibold tracking-[0.25em] uppercase">
                Global Compliance
              </span>
              <i className="fas fa-shield-alt text-[#CBD5E1] text-sm"></i>{" "}
            </div>
          </div>

          {/* CARD 3 */}
          <div
            className="
      relative overflow-hidden rounded-[28px]
      bg-[linear-gradient(180deg,#0F1C2B_0%,#09121D_100%)]
      border border-white/[0.06]
      shadow-[0_10px_40px_rgba(0,0,0,0.45)]
      p-8
      transition-all duration-500
      hover:-translate-y-2
      group
    "
          >
            <div className="absolute left-0 top-6 bottom-6 w-[2px] bg-[#FB923C]/40 rounded-full"></div>

            <div className="absolute inset-0 rounded-[28px] border-t border-white/10 pointer-events-none"></div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top,#fb923c15,transparent_70%)]"></div>

            <div
              className="
        w-14 h-14 rounded-2xl
        bg-[#2C2119]
        border border-white/[0.04]
        flex items-center justify-center
        shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
        mb-10
      "
            >
              <i className="fas fa-clipboard-check text-[#FDBA74] text-[24px] drop-shadow-[0_0_12px_rgba(251,146,60,0.9)]"></i>
            </div>

            <h3 className="text-[#E2E8F0] text-[22px] font-semibold mb-5 tracking-[-0.02em]">
              Task Tracking
            </h3>

            <p className="text-[#94A3B8] text-[15px] leading-[1.9] mb-14">
              Collaborative workflow management with milestone tracking and
              AI-assisted resource allocation.
            </p>

            <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[#FDBA74] text-[11px] font-semibold tracking-[0.25em] uppercase">
                Agile Ready
              </span>

              <i className="fas fa-rocket text-[#CBD5E1] text-sm"></i>
            </div>
          </div>
        </div>
      </section>

      {/* 3. قسم عن المنصة (About) */}
      <section
        id="about"
        className="py-30 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center"
      >
        <div>
          <h2 className="text-3xl font-bold text-blue-500 mb-8">
            About Staffly
          </h2>
          <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
            <p>
              Staffly provides the stability organizations need to thrive in a
              rapidly evolving talent landscape.
            </p>
            <p>
              A complete HRMS platform for both HR and employees, combining
              AI-powered recruitment, real-time attendance tracking, and
              automated payroll processing to deliver accuracy, efficiency, and
              seamless communication.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Item 1: Platform */}
          <div className="bg-[#0d141c] border border-white/5 rounded-xl p-6 flex items-center gap-6 group transition-all">
            <div className="w-1.5 h-12 bg-[#00a3ff] rounded-full shadow-[0_0_15px_rgba(0,163,255,0.3)]"></div>
            <div className="text-white text-xl font-medium tracking-tight">
              <span className="uppercase opacity-90">PLATFORM</span>
              <span className="mx-3 text-gray-600 font-light">–</span>
              <span className="text-gray-200">HR & Employee Portal</span>
            </div>
          </div>

          {/* Item 2: AI */}
          <div className="bg-[#0d141c] border border-white/5 rounded-xl p-6 flex items-center gap-6 group transition-all">
            <div className="w-1.5 h-12 bg-[#34d399] rounded-full shadow-[0_0_15px_rgba(52,211,153,0.3)]"></div>
            <div className="text-white text-xl font-medium tracking-tight">
              <span className="uppercase opacity-90">AI</span>
              <span className="mx-3 text-gray-600 font-light">–</span>
              <span className="text-gray-200">Smart Recruitment System</span>
            </div>
          </div>

          {/* Item 3: IOT */}
          <div className="bg-[#0d141c] border border-white/5 rounded-xl p-6 flex items-center gap-6 group transition-all">
            <div className="w-1.5 h-12 bg-[#fb923c] rounded-full shadow-[0_0_15px_rgba(251,146,60,0.3)]"></div>
            <div className="text-white text-xl font-medium tracking-tight">
              <span className="uppercase opacity-90">IOT</span>
              <span className="mx-3 text-gray-600 font-light">–</span>
              <span className="text-gray-200">Real-time Attendance</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 pb-24">
        <div className="relative overflow-hidden max-w-7xl mx-auto bg-[#0d141c] border border-white/5 rounded-[2.5rem] p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* تأثير الإضاءة الزرقاء في الركن العلوي الأيمن (Glow Effect) */}
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[80%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

          {/* الجزء الأيسر: العنوان، الوصف والزر */}
          <div className="relative z-10 flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight max-w-xl">
              Ready to transform your HR operations?
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed mb-10 mx-auto lg:mx-0">
              Experience a complete HRMS platform designed for both HR and
              employees, combining AI-powered recruitment, real-time attendance
              tracking, and automated payroll in one seamless system.
            </p>

            {/* الزر بتدرج لوني وتوهج (Gradient Button) */}
            <button
              onClick={() => navigate("/login")}
              className="px-10 py-4 bg-gradient-to-r from-[#00a3ff] to-[#006dfa] hover:brightness-110 text-white rounded-xl font-bold text-lg shadow-[0_15px_35px_rgba(0,163,255,0.3)] transition-all active:scale-95"
            >
              Get Started
            </button>
          </div>

          {/* الجزء الأيمن: الكروت التقنية (The technical boxes) */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="w-full sm:w-60 h-32 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center p-8 text-center transition-all hover:bg-white/[0.05]">
              <span className="text-[10px] text-gray-500 font-mono tracking-[0.25em] uppercase leading-relaxed">
                AI-Powered Recruitment
              </span>
            </div>

            <div className="w-full sm:w-60 h-32 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center p-8 text-center transition-all hover:bg-white/[0.05]">
              <span className="text-[10px] text-gray-500 font-mono tracking-[0.25em] uppercase leading-relaxed">
                RFID Attendance Tracking
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SplashPage;
