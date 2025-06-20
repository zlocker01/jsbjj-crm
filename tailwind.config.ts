const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        xs: "480px",
        "2xl": "1400px",
      },
    },
    extend: {
      spacing: {
        '8': '2rem', // Añadimos explícitamente el spacing-8
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, rgba(198, 169, 97, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",
        "dark-gold-gradient":
          "linear-gradient(135deg, rgba(198, 169, 97, 0.1) 0%, rgba(14, 14, 14, 0) 100%)",
      },
      colors: {
        primaryColor: "#C6A961",
        secondaryColor: "#D4AF37",
        primaryText: "#1A1A1A",
        secondaryText: "#5A5A5A",
        accentColor: "#D4AF37",
        facebook: "#3b5998",
        gold: "#C6A961",
        goldAccent: "#D4AF37",
        silver: "#808080",
        bronze: "#bf8970",
        goldHover: "#D4AF37",
        silverHover: "#a0a0a0",
        bronzeHover: "#d19a7f",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
    },
  },
};

module.exports = config;
