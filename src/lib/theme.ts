import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  globalCss: {
    'html, body': { bg: '#080c12', color: '#f9fafb', fontFamily: `'Inter', 'Segoe UI', sans-serif` },
    '::selection': { bg: '#8b5cf6', color: 'white' },
    '::-webkit-scrollbar': { width: '6px' },
    '::-webkit-scrollbar-thumb': { bg: '#374151', borderRadius: '999px' },
  },
  theme: {
    tokens: {
      colors: {
        violet: { 400: { value: '#a78bfa' }, 500: { value: '#8b5cf6' }, 600: { value: '#7c3aed' }, 700: { value: '#6d28d9' } },
        gray: { 800: { value: '#1f2937' }, 850: { value: '#161d2b' }, 900: { value: '#111827' }, 925: { value: '#0d1117' }, 950: { value: '#080c12' } },
        emerald: { 400: { value: '#34d399' }, 500: { value: '#10b981' } },
        rose: { 400: { value: '#fb7185' }, 500: { value: '#f43f5e' } },
        amber: { 400: { value: '#fbbf24' }, 500: { value: '#f59e0b' } },
        sky: { 400: { value: '#38bdf8' } },
      },
    },
    semanticTokens: {
      colors: {
        'bg.canvas': { value: '#080c12' },
        'bg.surface': { value: '#111827' },
        'bg.elevated': { value: '#161d2b' },
        'bg.overlay': { value: '#1f2937' },
        'bg.muted': { value: '#0d1117' },
        'text.primary': { value: '#f9fafb' },
        'text.secondary': { value: '#9ca3af' },
        'text.muted': { value: '#4b5563' },
        'border.subtle': { value: '#1f2937' },
        'border.default': { value: '#374151' },
        'border.strong': { value: '#4b5563' },
        'brand.default': { value: '#8b5cf6' },
        'brand.subtle': { value: 'rgba(139,92,246,0.12)' },
        'brand.border': { value: 'rgba(139,92,246,0.3)' },
      },
    },
    keyframes: {
      fadeIn: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      spin: { to: { transform: 'rotate(360deg)' } },
    },
  },
});

export const system = createSystem(defaultConfig, config);
