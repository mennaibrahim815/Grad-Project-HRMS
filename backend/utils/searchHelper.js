export const buildNameSearchQuery = (employeeName, fNamePath, lNamePath) => {
    if (!employeeName) return {};

    const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safeName = escapeRegex(employeeName.trim());
    const terms = safeName.split(/\s+/);

    let matchStage = {};

    if (terms.length === 1) {
        matchStage.$or = [
            { [fNamePath]: { $regex: terms[0], $options: "i" } },
            { [lNamePath]: { $regex: terms[0], $options: "i" } },
        ];
    } else if (terms.length >= 2) {
        const firstTerm = terms[0];
        const restOfTerms = terms.slice(1).join(" ");
        matchStage.$and = [
            { [fNamePath]: { $regex: firstTerm, $options: "i" } },
            { [lNamePath]: { $regex: restOfTerms, $options: "i" } },
        ];
    }

    return matchStage;
};
