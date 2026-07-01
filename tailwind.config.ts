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
				inter: ['Inter', 'sans-serif'],
				playfair: ['Playfair Display', 'serif'],
				display: ['Playfair Display', 'serif'],
				body: ['Inter', 'sans-serif'],
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
				// Professional brand colors
				primary: {
					50: '#f0f2ff',
					100: '#d9dfff',
					200: '#b3bfff',
					300: '#8a99ff',
					400: '#6273ff',
					500: '#1A237E', // Deep Navy Blue
					600: '#151b6d',
					700: '#101456',
					800: '#0a0c3d',
					900: '#050629',
					DEFAULT: '#1A237E',
					foreground: 'hsl(var(--primary-foreground))',
					light: '#4A5FBF',
					dark: '#0A0C3D'
				},
				secondary: {
					50: '#fff8f0',
					100: '#ffe8d9',
					200: '#ffd4b8',
					300: '#ffbe8a',
					400: '#ff984f',
					500: '#FF6B35', // Warm Orange
					600: '#e55a2b',
					700: '#c4421f',
					800: '#9e3319',
					900: '#7f2715',
					DEFAULT: '#FF6B35',
					foreground: 'hsl(var(--secondary-foreground))',
					light: '#FF984F'
				},
				accent: {
					50: '#ffe0e0',
					100: '#ffb3b3',
					200: '#ff8080',
					300: '#ff4d4d',
					400: '#ff2626',
					DEFAULT: '#E53935', // Clean Red
					foreground: 'hsl(var(--accent-foreground))',
					light: '#FF6B6B'
				},
				// Neutral grays
				gray: {
					50: '#f9fafb',
					100: '#f3f4f6',
					200: '#e5e7eb',
					300: '#d1d5db',
					400: '#9ca3af',
					500: '#6b7280',
					600: '#4b5563',
					700: '#374151',
					800: '#1f2937',
					900: '#111827',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1rem',
				'3xl': '1.5rem'
			},
			boxShadow: {
				'glow-sm': '0 0 10px rgba(26, 35, 126, 0.3)',
				'glow': '0 0 20px rgba(26, 35, 126, 0.5)',
				'glow-lg': '0 0 30px rgba(26, 35, 126, 0.7)',
				'primary': '0 4px 14px 0 rgba(26, 35, 126, 0.15)',
				'card': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(0, 0, 0, 0.05)',
				'card-hover': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.05), 0 16px 32px rgba(0, 0, 0, 0.05)',
				'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
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
						boxShadow: '0 0 10px rgba(26, 35, 126, 0.7)',
					},
					'50%': {
						opacity: '0.7',
						boxShadow: '0 0 20px rgba(26, 35, 126, 1)',
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
