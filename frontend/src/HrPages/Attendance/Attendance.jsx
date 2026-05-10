// import AttendanceTable from "../../components/AttendanceComponents/AttendanceTable"
// const getAvatarUrl = (name, background = '0D8ABC', color = 'fff') => {
//   return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${background}&color=${color}&size=80&bold=true&rounded=true`
// }

// // Sample employee data
// const employeesData = [
//   {
//     id: 'ID00021290',
//     name: 'Ryan Henry',
//     email: 'ryanhen@gmail.com',
//     department: 'Developer',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'On-time',
//     avatar: getAvatarUrl('Ryan Henry', '1e3a5f', '6ee7b7')
//   },
//   {
//     id: 'ID00021291',
//     name: 'Isabella Chloe',
//     email: 'isabella@gmail.com',
//     department: 'SMM',
//     date: '1 Jan 2025',
//     type: 'Contract',
//     attendance: 'Part-time',
//     avatar: getAvatarUrl('Isabella Chloe', '134e4a', '2dd4bf')
//   },
//   {
//     id: 'ID00021290',
//     name: 'Bessie Cooper',
//     email: 'bessieco@gmail.com',
//     department: 'Marketing',
//     date: '1 Jan 2025',
//     type: 'Part-time',
//     attendance: 'Late',
//     avatar: getAvatarUrl('Bessie Cooper', '7c2d12', 'fbbf24')
//   },
//   {
//     id: 'ID00026609',
//     name: 'Robert Fox',
//     email: 'robbert@gmail.com',
//     department: 'Design',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'Late',
//     avatar: getAvatarUrl('Robert Fox', '3f3f46', '94a3b8')
//   },
//   {
//     id: 'ID002211232',
//     name: 'Leslie Alexander',
//     email: 'leslie@gmail.com',
//     department: 'Editor',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'On-time',
//     avatar: getAvatarUrl('Leslie Alexander', '1e3a5f', '6ee7b7')
//   },
//   {
//     id: 'ID00021291',
//     name: 'Cody Fisher',
//     email: 'codyf@gmail.com',
//     department: 'Manager',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'Late',
//     avatar: getAvatarUrl('Cody Fisher', '4c1d95', 'c4b5fd')
//   },
//   {
//     id: 'ID00021290',
//     name: 'Bessie Cooper',
//     email: 'bessie@gmail.com',
//     department: 'Content',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'On-time',
//     avatar: getAvatarUrl('Bessie C', '0f766e', '5eead4')
//   },
//   {
//     id: 'ID00021291',
//     name: 'Dianne Russell',
//     email: 'dianner@gmail.com',
//     department: 'Finance',
//     date: '1 Jan 2025',
//     type: 'Contract',
//     attendance: 'Absent',
//     avatar: getAvatarUrl('Dianne Russell', '7c2d12', 'fed7aa')
//   },
//   {
//     id: 'ID00021290',
//     name: 'Annette Black',
//     email: 'Annete@gmail.com',
//     department: 'Marketing',
//     date: '1 Jan 2025',
//     type: 'Contract',
//     attendance: 'On-time',
//     avatar: getAvatarUrl('Annette Black', '1e3a5f', '6ee7b7')
//   },
//   {
//     id: 'ID00021291',
//     name: 'Theresa Webb',
//     email: 'therese@gmail.com',
//     department: 'Developer',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'Absent',
//     avatar: getAvatarUrl('Theresa Webb', '581c87', 'd8b4fe')
//   },
//   {
//     id: 'ID00021292',
//     name: 'Michael Scott',
//     email: 'mscott@gmail.com',
//     department: 'Manager',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'On-time',
//     avatar: getAvatarUrl('Michael Scott', '164e63', '22d3ee')
//   },
//   {
//     id: 'ID00021293',
//     name: 'Pam Beesly',
//     email: 'pbeesly@gmail.com',
//     department: 'Reception',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'On-time',
//     avatar: getAvatarUrl('Pam Beesly', '831843', 'f9a8d4')
//   },
//   {
//     id: 'ID00021294',
//     name: 'Jim Halpert',
//     email: 'jhalpert@gmail.com',
//     department: 'Sales',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'Late',
//     avatar: getAvatarUrl('Jim Halpert', '1e40af', '93c5fd')
//   },
//   {
//     id: 'ID00021295',
//     name: 'Dwight Schrute',
//     email: 'dschrute@gmail.com',
//     department: 'Sales',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'On-time',
//     avatar: getAvatarUrl('Dwight Schrute', '713f12', 'fde047')
//   },
//   {
//     id: 'ID00021296',
//     name: 'Angela Martin',
//     email: 'amartin@gmail.com',
//     department: 'Finance',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'On-time',
//     avatar: getAvatarUrl('Angela Martin', '4c1d95', 'c4b5fd')
//   },
//   {
//     id: 'ID00021297',
//     name: 'Kevin Malone',
//     email: 'kmalone@gmail.com',
//     department: 'Finance',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'Late',
//     avatar: getAvatarUrl('Kevin Malone', '7c2d12', 'fbbf24')
//   },
//   {
//     id: 'ID00021298',
//     name: 'Oscar Martinez',
//     email: 'omartinez@gmail.com',
//     department: 'Finance',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'On-time',
//     avatar: getAvatarUrl('Oscar Martinez', '0f766e', '5eead4')
//   },
//   {
//     id: 'ID00021299',
//     name: 'Stanley Hudson',
//     email: 'shudson@gmail.com',
//     department: 'Sales',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'Late',
//     avatar: getAvatarUrl('Stanley Hudson', '3f3f46', 'e2e8f0')
//   },
//   {
//     id: 'ID00021300',
//     name: 'Phyllis Vance',
//     email: 'pvance@gmail.com',
//     department: 'Sales',
//     date: '1 Jan 2025',
//     type: 'Part-time',
//     attendance: 'On-time',
//     avatar: getAvatarUrl('Phyllis Vance', '831843', 'f9a8d4')
//   },
//   {
//     id: 'ID00021301',
//     name: 'Kelly Kapoor',
//     email: 'kkapoor@gmail.com',
//     department: 'Customer Service',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'Absent',
//     avatar: getAvatarUrl('Kelly Kapoor', '9d174d', 'fda4af')
//   },
//   {
//     id: 'ID00021302',
//     name: 'Ryan Howard',
//     email: 'rhoward@gmail.com',
//     department: 'Temp',
//     date: '1 Jan 2025',
//     type: 'Contract',
//     attendance: 'Late',
//     avatar: getAvatarUrl('Ryan Howard', '1e3a5f', '60a5fa')
//   },
//   {
//     id: 'ID00021303',
//     name: 'Meredith Palmer',
//     email: 'mpalmer@gmail.com',
//     department: 'Supplier Relations',
//     date: '1 Jan 2025',
//     type: 'Full-time',
//     attendance: 'Absent',
//     avatar: getAvatarUrl('Meredith Palmer', '581c87', 'd8b4fe')
//   }
// ]
// export default function Attendance(){
//     return(
//       <AttendanceTable attendanceList={employeesData} />
//     )
// }
import AttendanceTable from "../../HrComponents/AttendanceComponents/AttendanceTable";
export default function Attendance(){
    return(
      <AttendanceTable  />
    )
}