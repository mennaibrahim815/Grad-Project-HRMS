const HeroSection = () => {
    return (
        <section className="relative flex flex-col items-center text-center px-4 pt-16 pb-12 overflow-hidden">

            {/* Background glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Badge */}
            <div
                style={{ background: "var(--input-bg)", borderColor: "var(--border-main)" }}
                className="relative flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 backdrop-blur-sm"
            >
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>
                    We Are Hiring
                </span>
            </div>

            {/* Heading */}
            <h1 className="relative text-4xl md:text-6xl font-bold leading-tight mb-5 max-w-3xl" style={{ color: "var(--text-main)" }}>
                Find your next
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    career opportunity
                </span>
            </h1>

            {/* Subtitle */}
            <p className="relative text-sm md:text-base max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Join our world-class team and help us build the future. Browse open
                positions across Engineering, Design, Product, and more.
            </p>
        </section>
    );
};

export default HeroSection;