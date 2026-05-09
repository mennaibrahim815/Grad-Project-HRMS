const steps = [
  { id: 1, label: 'General' },
  { id: 2, label: 'Experiance' },
  { id: 3, label: 'Employee' },

];

const AddEmployeeSteps = ({ currentStep, onStepChange }) => {
  return (
    <div className="flex items-center justify-between px-4 mb-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">

          {/* Step circle */}
          <button
            onClick={() => onStepChange(step.id)}
            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium transition
              ${
                step.id === currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/50 hover:bg-white/20'
              }`}
          >
            {step.id}
          </button>

          {/* Step label */}
          <span
            className={`ml-2 text-xs whitespace-nowrap
              ${
                step.id === currentStep
                  ? 'text-white'
                  : 'text-white/40'
              }`}
          >
            {step.label}
          </span>

          {/* Connector line */}
          {index !== steps.length - 1 && (
            <div className="flex-1 h-px bg-white/10 mx-3" />
          )}

        </div>
      ))}
    </div>
  );
};

export default AddEmployeeSteps;


