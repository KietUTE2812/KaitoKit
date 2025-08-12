/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Nunito", "ui-sans-serif", "system-ui"],
            },
            colors: {
                bg: '#fff7ed',        // Background - Cam nhạt
                text: '#7c2d12',      // Text - Nâu đậm
                primary: '#545dd5',   // Primary - Cam
                secondary: '#b94600', // Secondary - Đỏ
                accent: '#fbbf24',    // Accent - Vàng
                border: '#fed7aa',    // Border - Cam nhạt
                muted: '#78716c',     // Muted - Xám nâu
                success: '#16a34a',   // Success - Xanh lá
                error: '#dc2626',     // Error - Đỏ
                warning: '#f59e0b',   // Warning - Vàng cam
                info: '#2563eb',      // Info - Xanh dương
                light: '#fef3c7',     // Light - Vàng nhạt
                dark: '#451a03',      // Dark - Nâu đậm
                white: '#ffffff',     // White - Trắng
                card: 'hsl(var(--card))',
                'card-foreground': 'hsl(var(--card-foreground))',
                popover: 'hsl(var(--popover))',
                'popover-foreground': 'hsl(var(--popover-foreground))',
                destructive: 'hsl(var(--destructive))',
                'destructive-foreground': 'hsl(var(--destructive-foreground))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
            },
            fontSize: {
                xs: "0.75rem",
                sm: "0.875rem",
                base: "1rem",
                lg: "1.125rem",
                xl: "1.25rem",
            },
            spacing: {
                '2xs': '2px',
                'xs': '4px',
                'sm': '8px',
                'md': '16px',
                'lg': '24px',
                'xl': '32px',
                '2xl': '48px',
                '3xl': '64px',
                '4xl': '96px',
            },
        },
    },
    plugins: ['tailwindcss-perspective'],
}; 