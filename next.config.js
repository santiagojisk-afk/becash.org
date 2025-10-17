const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
reactStrictMode: true,

// ✅ Autoriza cargar assets de Next desde tu LAN en DEV
experimental: {
allowedOrigins: [
"http://localhost:3000",
"http://192.168.1.21:3000", // IP:PUERTO desde donde ABRES la web en el cel
"http://192.168.1.18:3000" // (añade aquí la IP real de tu PC si es otra)
],
},

async rewrites() {
// 🔴 AJUSTA ESTA URL AL BACKEND REAL
const apiBase =
process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.21:4000";
return [{ source: "/api/:path*", destination: `${apiBase}/api/:path*` }];
},

webpack: (config) => {
config.resolve.alias["@"] = path.resolve(__dirname, "src");
return config;
},
};

module.exports = nextConfig;