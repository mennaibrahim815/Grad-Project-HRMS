const skillSynonyms = {
    // ==========================================
    // 1. Programming Languages (لغات البرمجة)
    // ==========================================
    js: "javascript",
    es6: "javascript",
    ecmascript: "javascript",
    ts: "typescript",
    py: "python",
    python3: "python",
    cpp: "c++",
    cplusplus: "c++",
    "c sharp": "c#",
    csharp: "c#",
    golang: "go",
    "core java": "java",
    j2ee: "java",

    // ==========================================
    // 2. Frontend & Mobile
    // ==========================================
    react: "react.js",
    reactjs: "react.js",
    vue: "vue.js",
    vuejs: "vue.js",
    angularjs: "angular",
    html5: "html",
    css3: "css",
    tailwind: "tailwindcss",
    bootstrap5: "bootstrap",
    rn: "react native",
    "flutter framework": "flutter",

    // ==========================================
    // 3. Backend & Frameworks
    // ==========================================
    node: "node.js",
    nodejs: "node.js",
    express: "express.js",
    expressjs: "express.js",
    nest: "nest.js",
    nestjs: "nest.js",
    "django framework": "django",
    "spring boot": "springboot",
    dotnet: ".net",
    "asp.net": ".net",
    ror: "ruby on rails",

    // ==========================================
    // 4. Databases (قواعد البيانات)
    // ==========================================
    mongo: "mongodb",
    "mongo db": "mongodb",
    postgres: "postgresql",
    psql: "postgresql",
    mysql: "sql", // أحياناً بيفضلوها كـ SQL عامة أو ممكن تسيبها لوحدها
    "ms sql": "sql server",
    mssql: "sql server",
    dynamo: "dynamodb",

    // ==========================================
    // 5. DevOps, Cloud & Tools
    // ==========================================
    aws: "amazon web services",
    gcp: "google cloud",
    "azure cloud": "azure",
    k8s: "kubernetes",
    "ci cd": "ci/cd",
    cicd: "ci/cd",
    "github actions": "ci/cd",
    vcs: "git",

    // ==========================================
    // 6. Data Science, ML & AI
    // ==========================================
    ml: "machine learning",
    ai: "artificial intelligence",
    nlp: "natural language processing",
    tf: "tensorflow",
    sklearn: "scikit-learn",
    pytorch: "torch",
    np: "numpy",
    pd: "pandas",
};

/**
 * دالة وظيفتها تنظيف المهارة وتحويلها للاسم القياسي الموحد
 */
const normalizeSkill = (skill) => {
    // 1. تحويل لسمول وإزالة المسافات
    const cleaned = skill.toLowerCase().trim();

    // 2. لو المهارة ليها مرادف مشهور في القاموس، رجع الاسم القياسي، لو ملهاش سيبها زي ما هي
    return skillSynonyms[cleaned] || cleaned;
};

export const calculateSkillsMatch = (jobSkills = [], applicantSkills = []) => {
    if (jobSkills.length === 0) return 1.0;

    // تطبيق الـ Normalization على مهارات الوظيفة والمتقدم وتحويلهم لـ Sets
    const jSkills = new Set(jobSkills.map((s) => normalizeSkill(s)));
    const aSkills = new Set(applicantSkills.map((s) => normalizeSkill(s)));

    // حساب التقاطع (المشترك الفعلي بدقة)
    const intersection = new Set([...jSkills].filter((x) => aSkills.has(x)));

    // النسبة المئوية
    return intersection.size / jSkills.size;
};

export const calculateEducationMatch = (jobEducation, applicantEducation) => {
    const educationWeights = {
        "High School": 1,
        "Bachelor's": 2,
        "Master's": 3,
        PhD: 4,
    };

    const jobWeight = educationWeights[jobEducation] || 2;
    const applicantWeight = educationWeights[applicantEducation] || 0;

    return applicantWeight >= jobWeight ? 1.0 : 0.0;
};
