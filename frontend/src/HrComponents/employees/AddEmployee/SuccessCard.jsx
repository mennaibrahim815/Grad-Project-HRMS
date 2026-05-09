import Button from "../../../Components/UI/Button";

function SuccessCard({ onDone }) {
  return (
    <div className="bg-[#1A1A1A] rounded-3xl p-8 max-w-md w-full shadow-2xl">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Outer dark ring */}
          <div className="w-32 h-32 rounded-full bg-[#1E3A5F] flex items-center justify-center">
            {/* Inner bright blue circle */}
            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center">
              {/* Checkmark */}
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-white text-2xl font-semibold text-center mb-4">
        Data Saved Successfully!
      </h2>

      {/* Description */}
      <p className="text-gray-400 text-center mb-8 leading-relaxed">
        Employee data has been successfully added to the system. You can return to the employee list to see the latest data.
      </p>

      {/* Button */}
      <Button onClick={onDone}>Done</Button>
    </div>
  );
  
}

export default SuccessCard;