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
card: "0 4px 12px rgba(0,0,0,.06)",
},
colors: {
brand: "#2D6CDF",
},
fontFamily: {
sans: ["Inter", "system-ui", "ui-sans-serif", "sans-serif"],
},
},
},
plugins: [],
};