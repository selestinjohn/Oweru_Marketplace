import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        card: 'var(--radius-card)',
        control: 'var(--radius-control)',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: 'var(--border)',
        card: 'var(--card)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        navy: 'var(--oweru-navy)',
        'navy-light': 'var(--oweru-navy-light)',
        gold: 'var(--oweru-gold)',
        'gold-hover': 'var(--oweru-gold-hover)',
        surface: 'var(--surface)',
        'surface-muted': 'var(--surface-muted)',
      },
      fontFamily: {
        sans: ['var(--oweru-font-sans)'],
        display: ['var(--oweru-font-display)'],
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        panel: 'var(--shadow-panel)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
