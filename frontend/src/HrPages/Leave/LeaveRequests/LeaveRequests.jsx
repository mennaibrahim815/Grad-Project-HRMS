// import LeaveHero from "../../../components/LeavePageComponents/LeaveHero.jsx";
import LeaveTable from "../../../components/LeavePageComponents/LeaveTable.jsx";


export default function LeaveRequests() {
  const leaves = [
    { id: 1, name: "Ahmed Ali", type: "Annual", from: "1 Mar", to: "3 Mar", days: 3 },
    { id: 2, name: "Sara Omar", type: "Sick", from: "2 Mar", to: "2 Mar", days: 1 },
    { id: 3, name: "Mohamed Hassan", type: "Annual", from: "5 Mar", to: "8 Mar", days: 4 },
    { id: 4, name: "Laila Samir", type: "Sick", from: "6 Mar", to: "7 Mar", days: 2 },
    { id: 5, name: "Omar Khaled", type: "Annual", from: "8 Mar", to: "12 Mar", days: 5 },
    { id: 6, name: "Nour Ahmed", type: "Sick", from: "10 Mar", to: "10 Mar", days: 1 },
    { id: 7, name: "Hossam Ali", type: "Annual", from: "12 Mar", to: "14 Mar", days: 3 },
    { id: 8, name: "Mona Adel", type: "Annual", from: "13 Mar", to: "15 Mar", days: 3 },
    { id: 9, name: "Tamer Fathy", type: "Sick", from: "14 Mar", to: "14 Mar", days: 1 },
    { id: 10, name: "Yasmine Omar", type: "Annual", from: "16 Mar", to: "18 Mar", days: 3 },
  ];

  return (
    <div className="p-6">
      {/* <LeaveHero /> */}
      <LeaveTable leaves={leaves} />
    </div>
  );
}