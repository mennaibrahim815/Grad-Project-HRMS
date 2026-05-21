export const setFilesToBody2 = () => (req, res, next) => {
    if (req.files && Array.isArray(req.files)) {
        req.files.forEach((file) => {
            // path هنا هو الـ Key اللي إنت كاتبه في Postman
            const path = file.fieldname; 
            const fileValue = file.path || file.filename;

            // تحويل الـ String (مثلاً: assignment[assignedTo][0][avatar]) لـ Real Object
            const cleanPath = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
            const keys = cleanPath.split('.');
            
            let current = req.body;
            for (let i = 0; i < keys.length - 1; i++) {
                const k = keys[i];
                if (!current[k]) {
                    // لو الكي اللي جاي رقم، بنعمل Array، لو كلمة بنعمل Object
                    current[k] = isNaN(keys[i + 1]) ? {} : [];
                }
                current = current[k];
            }
            // بنحط الـ URL بتاع Cloudinary في مكانه النهائي
            current[keys[keys.length - 1]] = fileValue;
        });
    }
    next();
};