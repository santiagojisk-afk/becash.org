/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
"./app/**/*.{js,ts,jsx,tsx,mdx}",
"./src/**/*.{js,ts,jsx,tsx,mdx}",
"./components/**/*.{js,ts,jsx,tsx,mdx}",
],
theme: {
extend: {
boxShadow: {
card: "0 4px 12px rgba(0, 0, 0, 0.06)",
},
colors: {
brand: "#0d1b2a", //  Azul medianoche
},
fontFamily: {
sans: ["Inter", "system-ui", "ui-sans-serif", "sans-serif"],
},
},
},
plugins: [],
};