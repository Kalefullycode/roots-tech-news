import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				orbitron: ['Orbitron', 'monospace'],
				roboto: ['Roboto', 'sans-serif'],
				display: ['Orbitron', 'sans-serif'],
				body: ['Roboto', 'sans-serif'],
			},
			colors: {
				// CSS Variable colors (for shadcn/ui compatibility)
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
					border: 'hsl(var(--card-border))'
				},
				// New brand colors
				primary: {
					50: '#fdf4ff',
					100: '#fae8ff',
					200: '#f5d0fe',
					300: '#f0abfc',
					400: '#e879f9',
					500: '#E935FF', // Main brand purple
					600: '#c026d3',
					700: '#a21caf',
					800: '#86198f',
					900: '#701a75',
					DEFAULT: '#E935FF',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					50: '#fff7ed',
					100: '#ffedd5',
					200: '#fed7aa',
					300: '#fdba74',
					400: '#fb923c',
					500: '#FF8C00', // Main brand orange
					600: '#ea580c',
					700: '#c2410c',
					800: '#9a3412',
					900: '#7c2d12',
					DEFAULT: '#FF8C00',
					foreground: 'hsl(var(--secondary-foreground))',
					glow: 'hsl(var(--secondary-glow))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					glow: 'hsl(var(--accent-glow))'
				},
				neon: {
					green: '#00FF00',
					pink: '#FF00FF',
					blue: '#00D9FF',
					yellow: '#FFD700',
				},
				'neon-blue': {
					DEFAULT: 'hsl(var(--neon-blue))',
					glow: 'hsl(var(--neon-blue-glow))'
				},
				'cyber-pink': {
					DEFAULT: 'hsl(var(--cyber-pink))',
					glow: 'hsl(var(--cyber-pink-glow))'
				},
				dark: {
					900: '#000000',
					800: '#0a0a0a',
					700: '#1a1a1a',
					600: '#2a2a2a',
					500: '#3a3a3a',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'glow-sm': '0 0 10px rgba(233, 53, 255, 0.3)',
				'glow': '0 0 20px rgba(233, 53, 255, 0.5)',
				'glow-lg': '0 0 30px rgba(233, 53, 255, 0.7)',
				'neon-green': '0 0 20px rgba(0, 255, 0, 0.5)',
				'neon-pink': '0 0 20px rgba(255, 0, 255, 0.5)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-safe': {
					'0%, 100%': {
						opacity: '1',
						transform: 'translate3d(0, 0, 0) scale3d(1, 1, 1)'
					},
					'50%': {
						opacity: '.5',
						transform: 'translate3d(0, 0, 0) scale3d(1, 1, 1)'
					}
				},
				gradient: {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
				},
				'glow-pulse': {
					'0%, 100%': {
						opacity: '1',
						boxShadow: '0 0 10px rgba(233, 53, 255, 0.7)',
					},
					'50%': {
						opacity: '0.7',
						boxShadow: '0 0 20px rgba(233, 53, 255, 1)',
					},
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)',
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)',
					},
				},
				'slide-down': {
					'0%': {
						opacity: '0',
						transform: 'translateY(-20px)',
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)',
					},
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)',
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-safe': 'pulse-safe 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'gradient': 'gradient 3s ease infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'slide-up': 'slide-up 0.5s ease-out',
				'slide-down': 'slide-down 0.5s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
