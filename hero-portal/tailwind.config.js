/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        voidBlue: '#081024',
        neonCyan: '#00FFFF',
        arcanePurple: '#8B5CF6',
        legendaryGold: '#FFD700',
      },
      fontFamily: {
        space: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
