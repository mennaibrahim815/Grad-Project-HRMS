// performanceUtils.js
export const getPerformanceColors = (status) => {
  const map = {
    Excellent: {
      bg: "var(--pill-green-bg)",
      border: "var(--pill-green-border)",
      text: "var(--pill-green-text)",
    },
    Good: {
      bg: "var(--pill-blue-bg)",
      border: "var(--pill-blue-border)",
      text: "var(--pill-blue-text)",
    },
    Average: {
      bg: "var(--pill-orange-bg)",
      border: "var(--pill-orange-border)",
      text: "var(--pill-orange-text)",
    },
    Poor: {
      bg: "var(--pill-red-bg)",
      border: "var(--pill-red-border)",
      text: "var(--pill-red-text)",
    },
  };
  return map[status] || map.Poor;
};

export const getPerformanceIconColors = (status) => {
  const map = {
    Excellent: { bg: "var(--icon-green-bg)", color: "var(--icon-green-color)" },
    Good: { bg: "var(--icon-blue-bg)", color: "var(--icon-blue-color)" },
    Average: { bg: "var(--icon-orange-bg)", color: "var(--icon-orange-color)" },
    Poor: { bg: "var(--icon-pink-bg)", color: "var(--icon-pink-color)" },
  };
  return map[status] || map.Poor;
};
export const getPerformanceMessage = (status) => {
  const map = {
    Excellent: "Outstanding work! Keep up the great momentum.",
    Good: "Solid performance this period.",
    Average: "There's room to grow — keep pushing.",
    Poor: "Performance needs attention this period.",
  };
  return map[status] || map.Poor;
};
export const getScoreColor = (score) => {
  if (score >= 90) return "var(--pill-green-text)";
  if (score >= 75) return "var(--pill-blue-text)";
  if (score >= 50) return "var(--pill-orange-text)";
  return "var(--pill-red-text)";
};