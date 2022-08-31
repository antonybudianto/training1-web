module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  variants: {
    animation: ["responsive"],
    bgColor: ["hover", "focus"],
    extend: {},
  },
  theme: {
    extend: {
      keyframes: {
        green: {
          "0%, 50%": { color: "green" },
          "100%": { color: "white" },
        },
        red: {
          "0%, 50%": { color: "orangered" },
          "100%": { color: "white" },
        },
      },
      animation: {
        "green-change": "green 2s linear",
        "red-change": "red 2s linear",
      },
    },
  },
  plugins: [],
};
