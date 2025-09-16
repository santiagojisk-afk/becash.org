/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
"./app/**/*.{js,ts,jsx,tsx}",
"./src/**/*.{js,ts,jsx,tsx}",
],
theme: {
extend: {
colors: {
brand: "#0057FF",
"brand-press": "#2256B5",
},
boxShadow: {
card: "0 4px 12px rgba(0,0,0,0.05)",
},
borderRadius: {
xl: "12px",
},
},
},
plugins: [],
};

Postcss.conf

module.exports = {
plugins: {
tailwindcss: {},
autoprefixer: {},
},
};
