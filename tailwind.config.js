/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E23E3E",
          0: "#FCECEC",
          10: "#F9D8D8",
          20: "#F3B2B2",
          30: "#EE8B8B",
          40: "#E86565",
          60: "#CB3838",
          70: "#B53232",
          80: "#9E2B2B",
          90: "#882525",
          100: "#711F1F",
        },
        neutral: {
          DEFAULT: "#181818",
          10: "#F1F1F1",
          20: "#D9D9D9",
          30: "#C1C1C1",
          40: "#A9A9A9",
          50: "#919191",
          60: "#797979",
          70: "#606060",
          80: "#484848",
          90: "#303030",
        },
        rating: {
          DEFAULT: "#FFB660",
        },
        green: {
          10:"#CEECD7",
          100: "#31B057",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
