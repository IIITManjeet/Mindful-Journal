interface LogoProps {
  /** Pixel size of the square mark. */
  size?: number
  /** Show the "Mindful" wordmark next to the mark. */
  withWordmark?: boolean
  className?: string
}

/**
 * Mindful Journal brand mark — a calm sage tile with a single leaf and a
 * gentle ripple, suggesting growth, reflection, and stillness.
 */
const Logo = ({ size = 36, withWordmark = false, className = '' }: LogoProps) => {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Mindful Journal"
        className="shrink-0 drop-shadow-[0_4px_12px_rgba(80,70,55,0.18)]"
      >
        <defs>
          <linearGradient id="mj-tile" x1="0" y1="0" x2="40" y2="40">
            <stop offset="0%" stopColor="#9FBBA6" />
            <stop offset="55%" stopColor="#7C9885" />
            <stop offset="100%" stopColor="#5E7568" />
          </linearGradient>
        </defs>

        {/* Tile */}
        <rect x="0" y="0" width="40" height="40" rx="12" fill="url(#mj-tile)" />

        {/* Soft top-light sheen */}
        <rect x="0" y="0" width="40" height="20" rx="12" fill="#FFFFFF" opacity="0.06" />

        {/* Leaf */}
        <path
          d="M20 8.5C26 12.5 26.5 22 20.5 30C14.5 26 13.5 16.5 20 8.5Z"
          fill="#FCFAF6"
          opacity="0.96"
        />
        {/* Leaf central vein */}
        <path
          d="M20.4 11.5C19 17.5 19.6 23 20.4 28"
          stroke="#7C9885"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* Side veins */}
        <path
          d="M19.8 17.5L23.4 15.6M19.6 21.5L23.8 19.4M20 13.8L17.2 12.4"
          stroke="#7C9885"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Calm ripple beneath the leaf */}
        <path
          d="M11 31.5C14 30 16.5 30 20 31.2C23.5 32.4 26 32.4 29 31"
          stroke="#FCFAF6"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>

      {withWordmark && (
        <span className="font-serif text-xl font-semibold leading-none text-ink">
          Mindful
        </span>
      )}
    </span>
  )
}

export default Logo
