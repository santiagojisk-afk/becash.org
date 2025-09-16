const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  async rewrites() {
    // En dev, proxyea /api/* al backend público
    return process.env.NEXT_PUBLIC_API_URL
      ? [] // si está puesta la URL pública, no proxyees
      : [{ source: "/api/:path*", destination: "https://api.beqash.org/api/:path*" }];
  },

  webpackDevMiddleware: (config) => {
    // Ignora archivos del sistema de Windows que provocan warnings
    config.watchOptions.ignored = [
      "/node_modules/",
      "/.git/",
      "C:/pagefile.sys",
      "C:/hiberfil.sys",
      "C:/swapfile.sys",
      "C:/System Volume Information/**",
      "C:/DumpStack.log.tmp",
    ];
    return config;
  },

  webpack: (config) => {
    // Alias @ que apunta a src/
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

module.exports = nextConfig;