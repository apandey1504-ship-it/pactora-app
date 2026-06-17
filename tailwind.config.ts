import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#081A33",
        purple: "#635BFF",
        emerald: "#00C48C",
        cloud: "#F7F8FC"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(8, 26, 51, 0.10)",
        glow: "0 18px 70px rgba(99, 91, 255, 0.28)"
      }
    }
  },
  plugins: []
};

export default config;
