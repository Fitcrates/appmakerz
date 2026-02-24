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
		  },
		  indigo: {
			950: '#1e1b4b',
		  }
		},
		animation: {
			'nebula-1': 'nebula-1 58s infinite ease-in-out',
			'nebula-2': 'nebula-2 52s infinite ease-in-out',
			'nebula-3': 'nebula-3 71s infinite ease-in-out',
			'nebula-4': 'nebula-4 51s infinite ease-in-out',
			'nebula-5': 'nebula-5 52s infinite ease-in-out',
			'nebula-simple-2': 'nebula-simple-2 17s infinite ease-in-out',
			'nebula-simple-3': 'nebula-simple-3 23s infinite ease-in-out',
			'nebula-simple-4': 'nebula-simple-4 29s infinite ease-in-out',
			'nebula-minimal': 'nebula-minimal 10s infinite ease-in-out',
		  },
		// Remove the keyframes from Tailwind - we'll use the CSS ones instead
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
  