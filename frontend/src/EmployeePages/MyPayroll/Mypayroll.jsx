import { useRef } from "react";
import PayrollHeader from "../../EmployeeComponents/MyPayrollComponents/PayrollHeader";
import PayrollStats from "../../EmployeeComponents/MyPayrollComponents/PayrollStats";
import PayrollYearlyChart from "../../EmployeeComponents/MyPayrollComponents/PayrollYearlyChart";
import EmployeePayrollTable from "../../EmployeeComponents/MyPayrollComponents/EmployeePayrollTable";

export default function MyPayroll() {
  const printRef = useRef(null);

  return (
    <>
      <PayrollHeader printRef={printRef} />

      <div ref={printRef} className="flex flex-col gap-3">
        <PayrollStats />
        <PayrollYearlyChart />
        <EmployeePayrollTable />
      </div>
    </>
  );
}