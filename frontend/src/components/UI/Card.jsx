/**
 * BaseCard - A generic card component with minimal shared UI styles.
 * Extended using composition and Tailwind utility classes.
 */
const BaseCard = ({
  children,
  className = '',
  padding = 'p-5',
}) => {
  return (
    <div
      className={`
        bg-gradient-to-br from-transparent/20 to-45% to-[#182731]
        backdrop-blur-sm
        rounded-[2rem] border border-gray-800/50
        border border-slate-700/50
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default BaseCard