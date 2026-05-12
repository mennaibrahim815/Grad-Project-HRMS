
// import { useState } from "react";
// import { useDraggable } from "@dnd-kit/core";

// // Employees
// const defaultEmployees = [
//   { name: "Alice", image: "https://i.pravatar.cc/150?img=1" },
//   { name: "Bob", image: "https://i.pravatar.cc/150?img=2" },
//   { name: "Charlie", image: "https://i.pravatar.cc/150?img=3" },
// ];

// // Tags
// const types = [
//   { text: "UI Design", color: "bg-purple-500/20 text-purple-400" },
//   { text: "Marketing", color: "bg-green-500/20 text-green-400" },
//   { text: "Social Media", color: "bg-blue-500/20 text-blue-400" },
// ];

// const priorities = [
//   { text: "Low", color: "bg-slate-500/20 text-slate-400" },
//   { text: "Medium", color: "bg-yellow-500/20 text-yellow-400" },
//   { text: "High", color: "bg-red-500/20 text-red-400" },
// ];

// const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// export default function TaskCard({ id, title, description }) {
//   const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

//   const style = transform
//     ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
//     : undefined;

//   const [subtasks, setSubtasks] = useState([
//     { id: 1, title: "Develop Core UI Components", done: true, priority: "High" },
//     { id: 2, title: "Implement Component States", done: true, priority: "Medium" },
//     { id: 3, title: "Write Responsive Layouts", done: false, priority: "Low" },
//   ]);

//   const toggleSubtask = (subId) => {
//     setSubtasks((prev) =>
//       prev.map((s) =>
//         s.id === subId ? { ...s, done: !s.done } : s
//       )
//     );
//   };

//   const projectImage = `https://picsum.photos/300/150?random=${id}`;

//   const taskTags = [
//     getRandom(types),
//     getRandom(priorities),
//   ];

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className="
//         bg-gradient-to-br from-transparent/20 to-45% to-[#182731]
//         border border-slate-700/50
//         rounded-2xl
//         p-4
//         space-y-3
//         w-full
//         hover:bg-slate-700/30
//         hover:border-slate-600/50
//         transition-all
//         shadow-sm
//       "
//     >

//       {/* Drag */}
//       <div
//         {...listeners}
//         {...attributes}
//         className="cursor-grab text-slate-400 text-sm select-none"
//       >
//         ☰ Drag
//       </div>

//       {/* Tags */}
//       <div className="flex gap-2">
//         {taskTags.map((tag, i) => (
//           <span
//             key={i}
//             className={`text-xs px-2 py-1 rounded-lg ${tag.color}`}
//           >
//             {tag.text}
//           </span>
//         ))}
//       </div>

//       {/* Image */}
//       <div className="h-28 w-full rounded-xl overflow-hidden border border-slate-700/40">
//         <img
//           src={projectImage}
//           alt="project"
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Title */}
//       <h3 className="text-slate-100 font-semibold">{title}</h3>

//       {/* Description */}
//       <p className="text-slate-400 text-sm">{description}</p>

//       {/* Subtasks */}
//       <div className="space-y-2">
//         {subtasks.map((sub) => (
//           <div key={sub.id} className="flex items-center gap-2">

//             {/* Checkbox */}
//             <div
//               onClick={() => toggleSubtask(sub.id)}
//               className={`
//                 w-4 h-4 border rounded-sm flex items-center justify-center cursor-pointer
//                 ${sub.done
//                   ? "bg-emerald-500 border-emerald-500"
//                   : "border-slate-500"}
//               `}
//             >
//               {sub.done && <span className="text-white text-xs">✔</span>}
//             </div>

//             {/* Text */}
//             <span
//               className={`flex-1 text-sm ${
//                 sub.done
//                   ? "line-through text-slate-500"
//                   : "text-slate-200"
//               }`}
//             >
//               {sub.title}
//             </span>

//             {/* Priority */}
//             <span
//               className={`
//                 text-xs px-2 py-1 rounded-lg
//                 ${
//                   sub.priority === "High"
//                     ? "bg-red-500/20 text-red-400"
//                     : sub.priority === "Medium"
//                     ? "bg-yellow-500/20 text-yellow-400"
//                     : "bg-slate-500/20 text-slate-400"
//                 }
//               `}
//             >
//               {sub.priority}
//             </span>

//           </div>
//         ))}
//       </div>

//       {/* Employees */}
//       <div className="flex -space-x-2 pt-2">
//         {defaultEmployees.map((emp, i) => (
//           <img
//             key={i}
//             src={emp.image}
//             alt={emp.name}
//             className="w-6 h-6 rounded-full border border-slate-800"
//           />
//         ))}
//       </div>

//     </div>
//   );
// }

// import { useDraggable } from "@dnd-kit/core";
// import { Trash2, GripVertical, CheckCircle2, Circle } from "lucide-react";

// export default function TaskCard({ id, title, description, tag, avatar, onDelete }) {
//   const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

//   const style = transform
//     ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
//     : undefined;

//   // صورة افتراضية لو السيرفر مش باعت صورة
//   const displayImage = avatar || `https://picsum.photos/seed/${id}/300/150`;

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className="group relative bg-gradient-to-br from-transparent/20 to-45% to-[#182731] border border-slate-700/50 rounded-2xl p-4 space-y-3 w-full hover:bg-slate-700/30 transition-all shadow-sm"
//     >
//       {/* Header Controls */}
//       <div className="flex justify-between items-center">
//         <div {...listeners} {...attributes} className="cursor-grab text-slate-500 hover:text-slate-300">
//           <GripVertical size={18} />
//         </div>
//         <button 
//           onClick={(e) => { e.stopPropagation(); onDelete(); }}
//           className="p-1.5 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
//         >
//           <Trash2 size={16} />
//         </button>
//       </div>

//       {/* Tags */}
//       <div className="flex gap-2">
//         <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
//           {tag || "GENERAL"}
//         </span>
//         <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
//           HIGH
//         </span>
//       </div>

//       {/* Image */}
//       <div className="h-32 w-full rounded-xl overflow-hidden border border-slate-700/40">
//         <img src={displayImage} alt="project" className="w-full h-full object-cover" />
//       </div>

//       {/* Content */}
//       <div>
//         <h3 className="text-slate-100 font-bold text-base mb-1">{title}</h3>
//         <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{description}</p>
//       </div>

//       {/* Placeholder Subtasks (لحد ما نربط الـ API بتاعهم) */}
//       <div className="space-y-2 pt-2 border-t border-slate-700/30">
//         <div className="flex items-center gap-2 text-[11px] text-slate-500">
//           <CheckCircle2 size={12} className="text-emerald-500" />
//           <span className="line-through">Setup Project Environment</span>
//         </div>
//         <div className="flex items-center gap-2 text-[11px] text-slate-300">
//           <Circle size={12} className="text-slate-600" />
//           <span>Implementing Project Core Logic</span>
//         </div>
//       </div>

//       {/* Team */}
//       <div className="flex justify-between items-center pt-2">
//         <div className="flex -space-x-2">
//           <img src="https://i.pravatar.cc/150?u=a" className="w-6 h-6 rounded-full border-2 border-[#15222a]" />
//           <img src="https://i.pravatar.cc/150?u=b" className="w-6 h-6 rounded-full border-2 border-[#15222a]" />
//           <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-[#15222a] flex items-center justify-center text-[10px] text-white">+2</div>
//         </div>
//       </div>
//     </div>
//   );
// }