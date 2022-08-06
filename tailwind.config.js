module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.tsx'],
    theme: {
        minWidth: {
            '6xl': '72rem',
        },
        extend: {
            fontFamily: {
                jetbrains: ['JetBrainsMono'],
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                }
            },
            animation: {
                wiggle: 'wiggle 10s ease-in-out infinite',
            },
        },
    },
    variants: {},
    plugins: [],
};