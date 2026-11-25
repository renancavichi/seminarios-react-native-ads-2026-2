/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        white: "#E1E1E6",
        green: {
          500: "#073B1E",
        },
      },
      fontFamily: {
        regular: "Roboto_400Regular",
        bold: "Roboto_700Bold",
        medium: "Roboto_500Medium",
      },
    },
  },
  plugins: [],
}
