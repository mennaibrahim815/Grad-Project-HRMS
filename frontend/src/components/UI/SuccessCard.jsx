import Button from "./Button";
function SuccessCard({ 
  onDone,
  title = "Data Saved Successfully!",           //  default value
  description = "Data has been successfully saved to the system.",
  buttonText = "Done",
}) {
  return (
    <div className="bg-[#1A1A1A] rounded-3xl p-8 max-w-md w-full shadow-2xl">
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 rounded-full bg-[#1E3A5F] flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      <h2 className="text-white text-2xl font-semibold text-center mb-4">
        {title}
      </h2>

      <p className="text-gray-400 text-center mb-8 leading-relaxed">
        {description}
      </p>

      <Button onClick={onDone}>{buttonText}</Button>
    </div>
  );
}

export default SuccessCard;