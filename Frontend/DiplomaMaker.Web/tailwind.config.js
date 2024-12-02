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
        "primary-alt": "#FFDADA",
        "primary-focus": "#ffa292",
        "secondary-focus": "#064569",
        "secondary-dark": "#092236",
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
          accent: "#D9DCFF",
          neutral: "#FFFFFF",
          "base-100": "#EDEDED",
          "base-content": "#042D45",
          info: "#EAF6FF",
          success: "#D9FFE4",
          warning: "#FFF7D9",
          error: "#AA6969",
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
