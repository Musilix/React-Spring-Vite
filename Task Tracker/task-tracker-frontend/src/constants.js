module.exports = Object.freeze({
  __prod__: process.env.NODE_ENV === "production",
  __clearCookieOptions__: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    domain: process.env.DOMAIN,
    path: "/",
    maxAge: 0,
    crossSite: "lax",
  },
  __cookieOptions__: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    domain: process.env.DOMAIN,
    path: "/",
    maxAge: 60 * 60,
    crossSite: "lax",
  },
  __tokenOptions__: {
    algorithm: "RS256",
    expiresIn: "1h",
  },
});
