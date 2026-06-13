interface IconProps {
  className?: string
  size?: number
}

/** Minimal, evenly-weighted line icons — calm and understated. */
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export const HomeIcon = ({ className, size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 11.5 12 4.5l8 7" />
    <path d="M5.5 10v9h13v-9" />
    <path d="M10 19v-5h4v5" />
  </svg>
)

export const JournalIcon = ({ className, size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M5 4.5h11a2 2 0 0 1 2 2V19a1 1 0 0 1-1 1H6.5A1.5 1.5 0 0 1 5 18.5z" />
    <path d="M5 16.5h13" />
    <path d="M8.5 8.5h6M8.5 11.5h6" />
  </svg>
)

export const InsightsIcon = ({ className, size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 19h16" />
    <path d="M4 15l4-4 3 2.5L19 6" />
    <path d="M19 9.5V6h-3.5" />
  </svg>
)

export const MenuIcon = ({ className, size = 22 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const CloseIcon = ({ className, size = 22 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const ChevronLeftIcon = ({ className, size = 18 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M14.5 5 8 12l6.5 7" />
  </svg>
)

export const ChevronRightIcon = ({ className, size = 18 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M9.5 5 16 12l-6.5 7" />
  </svg>
)
