import AttendanceHeader from "../../EmployeeComponents/MyAttendanceComponents/AttendanceHeader";
import AttendanceStats from "../../EmployeeComponents/MyAttendanceComponents/AttendanceStats";
import AttendanceTrend from "../../EmployeeComponents/MyAttendanceComponents/AttendanceTrend";
import EmployeeAttendanceTable from "../../EmployeeComponents/MyAttendanceComponents/EmployeeAttendanceTable";
export default function MyAttendance() {
  
  return (
    <>
    <AttendanceHeader />
    <div className="mb-[12px]">
        <AttendanceStats/>
    </div>
    <div className="mb-[12px]">
     <AttendanceTrend/>
     </div>
    
    <EmployeeAttendanceTable/>
    
   

     
    </>

  )
}