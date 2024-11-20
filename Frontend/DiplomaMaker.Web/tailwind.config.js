/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-focus": "#ffa292",
        "secondary-focus": "#064569",
        "secondary-dark": "#092236",
        "accent-light": "#FFDADA",
      },
    },
    fontFamily: {
      display: ["Poppins", ...defaultTheme.fontFamily.sans],
      body: ["Manrope", ...defaultTheme.fontFamily.sans],
    },
  },
  daisyui: {
    themes: [
      {
        salt: {
          primary: "#FF7961",
          secondary: "#042D45",
          "secondary-content": "#D5E7F6",
          accent: "#F35C7E",
          neutral: "#FFFFFF",
          "base-100": "#EDEDED",
          "base-content": "#042D45",
          info: "#ECF7FA",
          success: "#E1FFED",
          warning: "#FDE68A",
          error: "#FCA5A5",
        },
      },
    ],
  },
  plugins: [
    daisyui,
    typography,
    plugin(function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus"]);
    }),
  ],
};
