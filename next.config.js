// next.config.js
/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
reactStrictMode: true,

experimental: {
// ✅ clave correcta (no uses allowedOrigins)
allowedDevOrigins: [
'http://localhost:3000',
'http://192.168.1.21:3000', // ← tu IP LAN
],
},

async rewrites() {
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.21:4000';
return [{ source: '/api/:path*', destination: `${apiBase}/api/:path*` }];
},

// ✅ evita el warning de root mal inferido
outputFileTracingRoot: path.resolve(__dirname),

webpack: (config) => {
config.resolve.alias['@'] = path.resolve(__dirname, 'src');
return config;
},
};

module.exports = nextConfig;
