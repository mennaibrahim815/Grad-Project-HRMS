export const setFilesToBody = (fieldNames) => (req, res, next) => {
    if (req.files) {
        Object.entries(fieldNames).forEach(([key, path]) => {
            if (req.files[key] && req.files[key].length > 0) {
                const fileData =
                    req.files[key].length === 1
                        ? req.files[key][0].path ||
                          req.files[key][0].filename ||
                          req.files[key][0].originalname
                        : req.files[key].map((f) => ({
                              name: f.path || f.filename || f.originalname,
                          }));

                if (path.includes(".")) {
                    const [parent, child] = path.split(".");
                    req.body[parent] = req.body[parent] || {};
                    req.body[parent][child] = fileData;
                } else {
                    req.body[path] = fileData;
                }
            }
        });
    }
    next();
};
