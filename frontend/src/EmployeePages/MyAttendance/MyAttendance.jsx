import AttendanceHeader from "../../EmployeeComponents/MyAttendanceComponents/AttendanceHeader";
import AttendanceStats from "../../EmployeeComponents/MyAttendanceComponents/AttendanceStats";
export default function MyAttendance() {
  
  return (
    <>
    <AttendanceHeader />
    <div className="mb-[12px]">
        <AttendanceStats/>
      </div>
     
    </>

  )
}