import BaseCard from "../../../../components/UI/Card";

const STEPS = ["Applied", "Interviewing", "Hired"];

const HiringProgressBar = ({ status }) => {
  const currentIndex = STEPS.indexOf(status);

  return (
    <BaseCard>
      <p className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
        Hiring Progress
      </p>

      <div className="flex items-center">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent   = index === currentIndex;
          const isRejected  = status === "Rejected";

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">

              {/* Circle */}
              <div className="flex flex-col items-center gap-2">
                <div
                  style={
                    isCompleted
                      ? { background: '#3b82f6', borderColor: '#3b82f6' }
                      : isCurrent && !isRejected
                      ? { background: 'transparent', borderColor: '#3b82f6' }
                      : isCurrent && isRejected
                      ? { background: 'transparent', borderColor: '#f87171' }
                      : { background: 'transparent', borderColor: 'var(--border-main)' }
                  }
                  className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
                >
                  {isCompleted ? (
                    <i className="fas fa-check text-white text-xs"></i>
                  ) : isCurrent && isRejected ? (
                    <i className="fas fa-times text-red-400 text-xs"></i>
                  ) : (
                    <div
                      style={{ background: isCurrent ? '#3b82f6' : 'var(--border-main)' }}
                      className="w-2 h-2 rounded-full"
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  style={{
                    color: isCompleted
                      ? '#60a5fa'
                      : isCurrent && !isRejected
                      ? '#60a5fa'
                      : isCurrent && isRejected
                      ? '#f87171'
                      : 'var(--text-muted)'
                  }}
                  className="text-xs whitespace-nowrap"
                >
                  {step}
                </span>
              </div>

             
              {index < STEPS.length - 1 && (
                <div
                  style={{ background: isCompleted ? '#3b82f6' : 'var(--border-main)' }}
                  className="flex-1 h-0.5 mx-2 mb-5 transition-all"
                />
              )}

            </div>
          );
        })}
      </div>

      {/* Rejected badge */}
      {status === "Rejected" && (
        <div className="mt-3 flex justify-center">
          <span className="px-3 py-1 rounded-full bg-red-500/10 border text-[#EC3A76] bg-[#EC3A76]/20 text-xs">
            Application Rejected
          </span>
        </div>
      )}
    </BaseCard>
  );
};

export default HiringProgressBar;