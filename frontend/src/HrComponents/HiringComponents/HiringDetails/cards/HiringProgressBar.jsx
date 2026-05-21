import BaseCard from "../../../../components/UI/Card";

const STEPS = ["Applied", "Interviewing", "Hired"];

const HiringProgressBar = ({ status }) => {
  const currentIndex = STEPS.indexOf(status);

  return (
    <BaseCard>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-4">
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                  ${isCompleted
                    ? "bg-blue-500 border-blue-500"
                    : isCurrent && !isRejected
                      ? "bg-transparent border-blue-500"
                      : isCurrent && isRejected
                        ? "bg-transparent border-red-400"
                        : "bg-transparent border-slate-600"
                  }`}
                >
                  {isCompleted ? (
                    <i className="fas fa-check text-white text-xs"></i>
                  ) : isCurrent && isRejected ? (
                    <i className="fas fa-times text-red-400 text-xs"></i>
                  ) : (
                    <div className={`w-2 h-2 rounded-full
                      ${isCurrent ? "bg-blue-500" : "bg-slate-600"}`}
                    />
                  )}
                </div>

                {/* Label */}
                <span className={`text-xs whitespace-nowrap
                  ${isCompleted                    ? "text-blue-400"  : ""}
                  ${isCurrent && !isRejected       ? "text-blue-400"  : ""}
                  ${isCurrent && isRejected        ? "text-red-400"   : ""}
                  ${!isCompleted && !isCurrent     ? "text-slate-500" : ""}
                `}>
                  {step}
                </span>
              </div>

              {/* Line بين الـ steps */}
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all
                  ${isCompleted ? "bg-blue-500" : "bg-slate-700"}`}
                />
              )}

            </div>
          );
        })}
      </div>

      {/* Rejected badge */}
      {status === "Rejected" && (
        <div className="mt-3 flex justify-center">
          <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            Application Rejected
          </span>
        </div>
      )}
    </BaseCard>
  );
};

export default HiringProgressBar;