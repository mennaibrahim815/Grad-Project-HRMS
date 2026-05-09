export const getCookieOptions = (days) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: days * 24 * 60 * 60 * 1000,
});
