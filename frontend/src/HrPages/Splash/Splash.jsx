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
import ThemeToggle from "../../components/NavbarComponents/ThemeToggle";


const SplashPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "features", "about"];
      const scrollPosition = window.scrollY + 200;

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

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardEntrance = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div 
      style={{ backgroundColor: 'var(--bg-deep)', color: 'var(--text-main)' }}
      className="font-sans selection:bg-blue-500/30 relative overflow-x-hidden z-0"
    >
      
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[90%] md:w-[70%] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.05)_40%,transparent_70%)] blur-[100px]"></div>
        
        <div className="absolute top-[30%] left-[-10%] w-[50%] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] blur-[120px]"></div>
        <div className="absolute top-[60%] right-[-10%] w-[50%] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] blur-[120px]"></div>
      </div>
      {/* ----------------------------------------------------- */}

      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
        className="fixed top-0 left-0 w-full z-50 bg-opacity-60 backdrop-blur-md border-b"
      >
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection("home")}
          >
            <motion.div 
              className="w-9 flex items-center justify-center"
            >
              <img src={icon} alt="Logo" className="w-8 h-8" />
            </motion.div>

            <span className="text-xl font-bold italic" style={{ color: 'var(--text-main)' }}>
              Staf<span className="text-blue-500">fly</span>
            </span>
          </div>
                    


          <div className="hidden md:flex items-center gap-10">
            {["Home", "Features", "About"].map((item) => {
              const id = item.toLowerCase();
              return (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  style={{ color: activeSection === id ? '#0095ff' : 'var(--text-muted)' }}
                  className={`relative text-sm font-medium transition-all duration-300 pb-1 hover:opacity-80`}
                >
                  {item}
                  {activeSection === id && (
                    <motion.span 
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 rounded-full" 
                    />
                  )}
                </button>
              );
            })}<ThemeToggle />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            style={{ borderColor: 'var(--border-main)', color: 'var(--accent-cyan)' }}
            className="px-6 py-2 border rounded-lg text-sm font-semibold hover:bg-white/5 transition-all"
          >

            Portal Login
          </motion.button>
        </div>
      </motion.nav>

      <section
        id="home"
        className="min-h-screen pt-32 pb-20 px-6 text-center flex flex-col items-center justify-center relative"
      >
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -z-10 pointer-events-none"
        ></motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
          className="inline-flex items-center gap-4 pl-1.5 pr-6 py-1.5 mb-11 rounded-full bg-opacity-90 border shadow-[0_0_30px_rgba(59,130,246,0.15)] backdrop-blur-md relative z-10"
        >
          <div className="w-7 h-7 rounded-full border border-cyan-500/30 flex items-center justify-center relative overflow-hidden">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-t-2 border-cyan-500 rounded-full opacity-50"
            ></motion.div>
            <i className="fas fa-shield-alt text-[12px] text-cyan-500 z-10"></i>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: 'var(--text-muted)' }}>
            The Future of Workforce Management
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ color: 'var(--text-main)' }}
          className="text-3xl md:text-6xl font-bold max-w-6xl mx-auto leading-tight mb-8 relative z-10"
        >
          Next-Gen HR &{" "}
          <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Recruitment Platform</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ color: 'var(--text-muted)' }}
          className="max-w-3xl mx-auto mb-12 text-xl leading-relaxed relative z-10"
        >
          Streamline your entire employee lifecycle with precision. From
          AI-driven talent acquisition to automated payroll and real-time
          performance analytics.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(37,99,235,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/apply-job")}
          className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-blue-600/30 group relative z-10"
        >
          Explore Job Board (Apply Now) 
          <motion.div className="group-hover:translate-x-1 transition-transform">
            <ArrowRight size={20} />
          </motion.div>
        </motion.button>
      </section>

      <section
        id="features"
        className="relative py-20 px-6 max-w-7xl mx-auto overflow-hidden"
      >
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative z-10"
        >
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-blue-500 mb-8">
              Our Features
            </h2>
            <p style={{ color: 'var(--text-muted)' }} className="text-[15px] leading-[1.9]">
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
                  repeatDelay: 1.8,
                  duration: 1.8,
                  delay: i * 0.6,
                  ease: "easeInOut",
                }}
                className="h-[5px] rounded-full bg-[#00A3FF] shadow-[0_0_15px_rgba(0,163,255,0.8)]"
              />
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-7 relative z-10"
        >
          {/* CARD 1 */}
          <motion.div
            variants={cardEntrance}
            whileHover={{ y: -10 }}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
            className="relative overflow-hidden rounded-[28px] bg-opacity-80 backdrop-blur-md border shadow-[0_10px_40px_rgba(0,0,0,0.45)] p-8 transition-all duration-300 group"
          >
            <div className="absolute left-0 top-6 bottom-6 w-[2px] bg-[#00A3FF]/40 rounded-full"></div>
            <div className="absolute inset-0 rounded-[28px] border-t border-white/10 pointer-events-none"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top,#00a3ff15,transparent_70%)] pointer-events-none"></div>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)' }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] mb-10"
            >
              <i className="far fa-clock text-[#0094FF] text-[26px] drop-shadow-[0_0_12px_rgba(0,163,255,0.9)]"></i>
            </motion.div>
            <h3 style={{ color: 'var(--text-main)' }} className="text-[22px] font-semibold mb-5 tracking-[-0.02em]">Smart Attendance</h3>
            <p style={{ color: 'var(--text-muted)' }} className="text-[15px] leading-[1.9] mb-14">
              Geofenced check-ins and facial recognition attendance tracking integrated with real-time reporting.
            </p>
            <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[#00A3FF] text-[11px] font-semibold tracking-[0.25em] uppercase">Live Tracking</span>
              <i className="fas fa-arrow-trend-up text-[#CBD5E1] text-sm group-hover:text-[#00A3FF] transition-colors"></i>
            </div>
          </motion.div>

          {/* CARD 2 */}
          <motion.div
            variants={cardEntrance}
            whileHover={{ y: -10 }}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
            className="relative overflow-hidden rounded-[28px] bg-opacity-80 backdrop-blur-md border shadow-[0_10px_40px_rgba(0,0,0,0.45)] p-8 transition-all duration-300 group"
          >
            <div className="absolute left-0 top-6 bottom-6 w-[2px] bg-[#4ADE80]/40 rounded-full"></div>
            <div className="absolute inset-0 rounded-[28px] border-t border-white/10 pointer-events-none"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top,#4ade8015,transparent_70%)] pointer-events-none"></div>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -5 }}
              style={{ background: 'var(--icon-green-bg)', borderColor: 'var(--border-main)' }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] mb-10"
            >
              <i className="fas fa-money-check-dollar text-[#69F0AE] text-[24px] drop-shadow-[0_0_12px_rgba(52,211,153,0.9)]"></i>
            </motion.div>
            <h3 style={{ color: 'var(--text-main)' }} className="text-[22px] font-semibold mb-5 tracking-[-0.02em]">Precision Payroll</h3>
            <p style={{ color: 'var(--text-muted)' }} className="text-[15px] leading-[1.9] mb-14">
              Automated multi-currency payroll processing with instant tax compliance and localized benefit management.
            </p>
            <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[#69F0AE] text-[11px] font-semibold tracking-[0.25em] uppercase">Global Compliance</span>
              <i className="fas fa-shield-alt text-[#CBD5E1] text-sm group-hover:text-[#69F0AE] transition-colors"></i>
            </div>
          </motion.div>

          {/* CARD 3 */}
          <motion.div
            variants={cardEntrance}
            whileHover={{ y: -10 }}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
            className="relative overflow-hidden rounded-[28px] bg-opacity-80 backdrop-blur-md border shadow-[0_10px_40px_rgba(0,0,0,0.45)] p-8 transition-all duration-300 group"
          >
            <div className="absolute left-0 top-6 bottom-6 w-[2px] bg-[#FB923C]/40 rounded-full"></div>
            <div className="absolute inset-0 rounded-[28px] border-t border-white/10 pointer-events-none"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top,#fb923c15,transparent_70%)] pointer-events-none"></div>
            <motion.div 
              whileHover={{ scale: 1.1, y: -3 }}
              style={{ background: 'var(--icon-orange-bg)', borderColor: 'var(--border-main)' }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] mb-10"
            >
              <i className="fas fa-clipboard-check text-[#FDBA74] text-[24px] drop-shadow-[0_0_12px_rgba(251,146,60,0.9)]"></i>
            </motion.div>
            <h3 style={{ color: 'var(--text-main)' }} className="text-[22px] font-semibold mb-5 tracking-[-0.02em]">Task Tracking</h3>
            <p style={{ color: 'var(--text-muted)' }} className="text-[15px] leading-[1.9] mb-14">
              Collaborative workflow management with milestone tracking and AI-assisted resource allocation.
            </p>
            <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[#FDBA74] text-[11px] font-semibold tracking-[0.25em] uppercase">Agile Ready</span>
              <i className="fas fa-rocket text-[#CBD5E1] text-sm group-hover:text-[#FDBA74] transition-colors"></i>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section
        id="about"
        className="py-30 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-blue-500 mb-8">
            About Staffly
          </h2>
          <div className="space-y-6 text-lg leading-relaxed">
            <p style={{ color: 'var(--text-main)' }}>
              Staffly provides the stability organizations need to thrive in a
              rapidly evolving talent landscape.
            </p>
            <p style={{ color: 'var(--text-muted)' }}>
              A complete HRMS platform for both HR and employees, combining
              AI-powered recruitment, real-time attendance tracking, and
              automated payroll processing to deliver accuracy, efficiency, and
              seamless communication.
            </p>
          </div>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-4"
        >
          {/* Item 1: Platform */}
          <motion.div 
            variants={fadeInUp} 
            whileHover={{ x: 10 }}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
            className="bg-opacity-60 backdrop-blur-sm border rounded-xl p-6 flex items-center gap-6 group transition-all cursor-pointer hover:bg-opacity-80"
          >
            <div className="w-1.5 h-12 bg-[#00a3ff] rounded-full shadow-[0_0_15px_rgba(0,163,255,0.3)]"></div>
            <div className="text-xl font-medium tracking-tight">
              <span className="uppercase opacity-90" style={{ color: 'var(--text-main)' }}>PLATFORM</span>
              <span className="mx-3 font-light" style={{ color: 'var(--text-muted)' }}>–</span>
              <span style={{ color: 'var(--text-muted)' }}>HR & Employee Portal</span>
            </div>
          </motion.div>

          {/* Item 2: AI */}
          <motion.div 
            variants={fadeInUp} 
            whileHover={{ x: 10 }}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
            className="bg-opacity-60 backdrop-blur-sm border rounded-xl p-6 flex items-center gap-6 group transition-all cursor-pointer hover:bg-opacity-80"
          >
            <div className="w-1.5 h-12 bg-[#34d399] rounded-full shadow-[0_0_15px_rgba(52,211,153,0.3)]"></div>
            <div className="text-xl font-medium tracking-tight">
              <span className="uppercase opacity-90" style={{ color: 'var(--text-main)' }}>AI</span>
              <span className="mx-3 font-light" style={{ color: 'var(--text-muted)' }}>–</span>
              <span style={{ color: 'var(--text-muted)' }}>Smart Recruitment System</span>
            </div>
          </motion.div>

          {/* Item 3: IOT */}
          <motion.div 
            variants={fadeInUp} 
            whileHover={{ x: 10 }}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
            className="bg-opacity-60 backdrop-blur-sm border rounded-xl p-6 flex items-center gap-6 group transition-all cursor-pointer hover:bg-opacity-80"
          >
            <div className="w-1.5 h-12 bg-[#fb923c] rounded-full shadow-[0_0_15px_rgba(251,146,60,0.3)]"></div>
            <div className="text-xl font-medium tracking-tight">
              <span className="uppercase opacity-90" style={{ color: 'var(--text-main)' }}>IOT</span>
              <span className="mx-3 font-light" style={{ color: 'var(--text-muted)' }}>–</span>
              <span style={{ color: 'var(--text-muted)' }}>Real-time Attendance</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <footer className="px-6 pb-24 mt-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
          className="relative overflow-hidden max-w-7xl mx-auto bg-opacity-80 backdrop-blur-lg border rounded-[2.5rem] p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl"
        >
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[80%] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 flex-1 text-center lg:text-left">
            <h2 style={{ color: 'var(--text-main)' }} className="text-3xl md:text-4xl font-bold mb-6 leading-tight max-w-xl">
              Ready to transform your HR operations?
            </h2>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm md:text-base max-w-md leading-relaxed mb-10 mx-auto lg:mx-0">
              Experience a complete HRMS platform designed for both HR and
              employees, combining AI-powered recruitment, real-time attendance
              tracking, and automated payroll in one seamless system.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="px-10 py-4 bg-gradient-to-r from-[#00a3ff] to-[#006dfa] text-white rounded-xl font-bold text-lg shadow-[0_10px_30px_rgba(0,163,255,0.4)] transition-all border border-blue-400/30"
            >
              Get Started
            </motion.button>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-main)' }}
              className="w-full sm:w-60 h-32 border rounded-2xl flex items-center justify-center p-8 text-center transition-all cursor-default backdrop-blur-sm hover:opacity-90"
            >
              <span style={{ color: 'var(--text-muted)' }} className="text-[10px] font-mono tracking-[0.25em] uppercase leading-relaxed font-bold">
                AI-Powered Recruitment
              </span>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-main)' }}
              className="w-full sm:w-60 h-32 border rounded-2xl flex items-center justify-center p-8 text-center transition-all cursor-default backdrop-blur-sm hover:opacity-90"
            >
              <span style={{ color: 'var(--text-muted)' }} className="text-[10px] font-mono tracking-[0.25em] uppercase leading-relaxed font-bold">
                RFID Attendance Tracking
              </span>
            </motion.div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

export default SplashPage;