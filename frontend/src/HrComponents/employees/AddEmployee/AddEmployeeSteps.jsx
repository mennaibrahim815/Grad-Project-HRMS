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
            style={
              step.id === currentStep
                ? { background: '#3b82f6', color: '#ffffff' }
                : { background: 'var(--tab-inactive-bg)', color: 'var(--text-muted)' }
            }
            className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium transition hover:opacity-80"
          >
            {step.id}
          </button>

          {/* Step label */}
          <span
            className="ml-2 text-xs whitespace-nowrap"
            style={{ color: step.id === currentStep ? 'var(--text-main)' : 'var(--text-muted)' }}
          >
            {step.label}
          </span>

          {/* Connector line */}
          {index !== steps.length - 1 && (
            <div className="flex-1 h-px mx-3" style={{ background: 'var(--border-main)' }} />
          )}

        </div>
      ))}
    </div>
  );
};

export default AddEmployeeSteps;