const BaseCard = ({ children, className = '', padding = 'p-5' }) => {
  return (
    <div
      style={{
        background: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)',
        borderColor: 'var(--card-border)',
      }}
      className={`
        backdrop-blur-sm
        rounded-[2rem] border
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default BaseCard;