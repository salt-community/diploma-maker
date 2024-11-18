/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
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
          accent: "#ECF7FA",
          neutral: "#ffffff",
          "base-100": "#f9f9f9",
          "base-content": "#042D45",
          info: "#FAECF8",
          success: "#E1FFED",
          warning: "#fde68a",
          error: "#fca5a5",
        },
      },
    ],
  },
  plugins: [daisyui, typography],
};
