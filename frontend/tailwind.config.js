/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    "colors": {
        "admin-primary": {
            50: "#EEF2FF",
            100: "#E0E7FF",
            200: "#C7D2FE",
            300: "#A5B4FC",
            400: "#818CF8",
            500: "#6366F1",
            600: "#4F46E5",
            700: "#4338CA",
            800: "#3730A3",
            900: "#312E81",
        },
        "admin-bg": "#F9FAFB",
        "admin-surface": "#FFFFFF",
        "admin-surface-secondary": "#F3F4F6",
        "admin-border": "#E5E7EB",
        "admin-border-strong": "#D1D5DB",
        "admin-text-primary": "#111827",
        "admin-text-secondary": "#4B5563",
        "admin-text-muted": "#6B7280",
        "admin-text-disabled": "#9CA3AF",
        "admin-success": "#16A34A",
        "admin-success-bg": "#F0FDF4",
        "admin-success-border": "#BBF7D0",
        "admin-warning": "#D97706",
        "admin-warning-bg": "#FFFBEB",
        "admin-warning-border": "#FDE68A",
        "admin-error": "#DC2626",
        "admin-error-bg": "#FEF2F2",
        "admin-error-border": "#FECACA",
        "admin-info": "#0284C7",
        "admin-info-bg": "#F0F9FF",
        "admin-info-border": "#BAE6FD",
        "on-tertiary-fixed-variant": "#76330d",
        "tertiary-fixed": "#ffdbcc",
        "error-container": "#ffdad6",
        "secondary": "#9b4500",
        "secondary-container": "#fd8a42",
        "on-background": "#151c27",
        "accent-bronze": "#B45309",
        "status-error": "#B91C1C",
        "surface-variant": "#dce2f3",
        "surface-container-high": "#e2e8f8",
        "on-primary-fixed-variant": "#404758",
        "tertiary-fixed-dim": "#ffb693",
        "surface-container-highest": "#dce2f3",
        "surface": "#f9f9ff",
        "accent-terracotta": "#C2410C",
        "secondary-fixed-dim": "#ffb68e",
        "on-surface-variant": "#45464c",
        "on-error-container": "#93000a",
        "surface-tint": "#575e70",
        "outline": "#76777d",
        "on-primary-container": "#7d8497",
        "surface-container-lowest": "#ffffff",
        "on-primary": "#ffffff",
        "text-secondary": "#4B5563",
        "tertiary-container": "#351000",
        "text-muted": "#9CA3AF",
        "text-primary": "#111827",
        "border-subtle": "#E5E7EB",
        "secondary-fixed": "#ffdbca",
        "surface-canvas": "#F4F4F0",
        "on-secondary-container": "#682c00",
        "border-hairline": "#EEEEEC",
        "primary-fixed": "#dce2f7",
        "on-tertiary-fixed": "#351000",
        "surface-dim": "#d3daea",
        "primary": "#000000",
        "on-tertiary-container": "#c16e44",
        "on-secondary-fixed": "#331200",
        "on-primary-fixed": "#141b2b",
        "on-surface": "#151c27",
        "surface-bright": "#f9f9ff",
        "surface-container-low": "#f0f3ff",
        "outline-variant": "#c6c6cd",
        "inverse-surface": "#2a313d",
        "surface-alabaster": "#FBFBF9",
        "on-secondary-fixed-variant": "#763300",
        "on-error": "#ffffff",
        "error": "#ba1a1a",
        "primary-container": "#141b2b",
        "inverse-on-surface": "#ebf1ff",
        "status-success": "#15803D",
        "inverse-primary": "#c0c6db",
        "surface-pure": "#FFFFFF",
        "background": "#f9f9ff",
        "surface-container": "#e7eefe",
        "on-secondary": "#ffffff",
        "on-tertiary": "#ffffff",
        "tertiary": "#000000",
        "primary-fixed-dim": "#c0c6db"
    },
    "borderRadius": {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
    },
    "spacing": {
        "max-width-content": "1360px",
        "space-xs": "0.5rem",
        "space-lg": "1.5rem",
        "space-3xl": "4rem",
        "space-xl": "2rem",
        "space-2xs": "0.25rem",
        "max-width-editorial": "840px",
        "space-4xl": "6rem",
        "space-sm": "0.75rem",
        "gutter-desktop": "1.5rem",
        "space-2xl": "3rem",
        "space-md": "1rem",
        "margin-desktop": "3rem",
        "gutter-mobile": "1rem",
        "margin-mobile": "1.25rem"
    },
    "fontFamily": {
        "display-hero-mobile": [
            "Be Vietnam Pro"
        ],
        "headline-lg": [
            "Be Vietnam Pro"
        ],
        "body-md": [
            "Be Vietnam Pro"
        ],
        "headline-sm": [
            "Be Vietnam Pro"
        ],
        "headline-xl-mobile": [
            "Be Vietnam Pro"
        ],
        "price-lg": [
            "Be Vietnam Pro"
        ],
        "body-lg": [
            "Be Vietnam Pro"
        ],
        "display-hero": [
            "Be Vietnam Pro"
        ],
        "body-sm": [
            "Be Vietnam Pro"
        ],
        "headline-xl": [
            "Be Vietnam Pro"
        ],
        "label-caps": [
            "Be Vietnam Pro"
        ],
        "headline-md": [
            "Be Vietnam Pro"
        ],
        "price-md": [
            "Be Vietnam Pro"
        ]
    },
    "fontSize": {
        "display-hero-mobile": [
            "32px",
            {
                "lineHeight": "40px",
                "letterSpacing": "-0.01em",
                "fontWeight": "400"
            }
        ],
        "headline-lg": [
            "28px",
            {
                "lineHeight": "36px",
                "letterSpacing": "-0.01em",
                "fontWeight": "400"
            }
        ],
        "body-md": [
            "14px",
            {
                "lineHeight": "22px",
                "letterSpacing": "0",
                "fontWeight": "400"
            }
        ],
        "headline-sm": [
            "18px",
            {
                "lineHeight": "26px",
                "letterSpacing": "0",
                "fontWeight": "600"
            }
        ],
        "headline-xl-mobile": [
            "26px",
            {
                "lineHeight": "34px",
                "letterSpacing": "-0.01em",
                "fontWeight": "400"
            }
        ],
        "price-lg": [
            "20px",
            {
                "lineHeight": "24px",
                "letterSpacing": "-0.01em",
                "fontWeight": "600"
            }
        ],
        "body-lg": [
            "16px",
            {
                "lineHeight": "26px",
                "letterSpacing": "0",
                "fontWeight": "400"
            }
        ],
        "display-hero": [
            "48px",
            {
                "lineHeight": "56px",
                "letterSpacing": "-0.02em",
                "fontWeight": "300"
            }
        ],
        "body-sm": [
            "12px",
            {
                "lineHeight": "18px",
                "letterSpacing": "0.01em",
                "fontWeight": "400"
            }
        ],
        "headline-xl": [
            "36px",
            {
                "lineHeight": "44px",
                "letterSpacing": "-0.02em",
                "fontWeight": "400"
            }
        ],
        "label-caps": [
            "11px",
            {
                "lineHeight": "16px",
                "letterSpacing": "0.12em",
                "fontWeight": "600"
            }
        ],
        "headline-md": [
            "22px",
            {
                "lineHeight": "30px",
                "letterSpacing": "-0.01em",
                "fontWeight": "500"
            }
        ],
        "price-md": [
            "15px",
            {
                "lineHeight": "20px",
                "letterSpacing": "0",
                "fontWeight": "600"
            }
        ]
    }
}
  },
  plugins: [],
}
