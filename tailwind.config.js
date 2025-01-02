// tailwind.config.js
export default {
	content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
	theme: {
	  extend: {
		fontFamily: {
		  jakarta: ["Plus Jakarta Sans", "sans-serif"],
		},
		colors: {
		  custom: {
			dark: '#140F2D'
		  }
		},
		animation: {
		  shine: "shine 2s linear infinite", // Ensure timing is correct
		},
		keyframes: {
		  shine: {
			"0%": { transform: "translateX(-100%)" },
			"100%": { transform: "translateX(100%)" },
		  },
		},
		fontWeight: {
		  thin: '100',
		  hairline: '100',
		  extralight: '200',
		  light: '300',
		  biglight: '350',
		  normal: '400',
		  medium: '500',
		  semibold: '600',
		  bold: '700',
		  extrabold: '800',
		  'extra-bold': '800',
		  black: '900',
		}
	  },
	},				
	plugins: [],
  };