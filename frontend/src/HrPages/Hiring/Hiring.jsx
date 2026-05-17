import HiringTable from "../../HRComponents/HiringComponents/HiringTable/HiringTable";
import HiringHeader from "../../HrComponents/HiringComponents/HiringHeader/HiringHeader";
export default function Hiring() {
  return (
     <div className="max-w-[1650px] mx-auto p-4 bg-transparent">
      <HiringHeader/>
      <HiringTable/>
     </div>
    
  );
}
