
// import { useState } from "react";
// import { useDraggable } from "@dnd-kit/core";

// // صور افتراضية للموظفين
// const defaultEmployees = [
//   { name: "Alice", image: "https://i.pravatar.cc/150?img=1" },
//   { name: "Bob", image: "https://i.pravatar.cc/150?img=2" },
//   { name: "Charlie", image: "https://i.pravatar.cc/150?img=3" },
// ];

// // Tags و Priorities
// const types = [
//   { text: "UI Design", color: "bg-purple-500/20 text-purple-400" },
//   { text: "Marketing", color: "bg-green-500/20 text-green-400" },
//   { text: "Social Media", color: "bg-blue-500/20 text-blue-400" },
// ];

// const priorities = [
//   { text: "Low", color: "bg-gray-500/20 text-gray-400" },
//   { text: "Medium", color: "bg-yellow-500/20 text-yellow-400" },
//   { text: "High", color: "bg-red-500/20 text-red-400" },
// ];

// const defaultProjectImages = [
//   "https://picsum.photos/300/150?random=1",
//   "https://picsum.photos/300/150?random=2",
//   "https://picsum.photos/300/150?random=3",
// ];

// const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// export default function TaskCard({ id, title, description }) {

//   const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

//   const style = transform
//     ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
//     : undefined;

//   const [subtasks, setSubtasks] = useState([
//     { id: 1, title: "Develop Core UI Components", done: true, priority: getRandom(priorities).text },
//     { id: 2, title: "Implement Component States", done: true, priority: getRandom(priorities).text },
//     { id: 3, title: "Write Responsive Layouts", done: false, priority: getRandom(priorities).text },
//   ]);

//   const [editingId, setEditingId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [adding, setAdding] = useState(false);
//   const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

//   const toggleSubtask = (subId) => {
//     setSubtasks(subtasks.map((s) =>
//       s.id === subId ? { ...s, done: !s.done } : s
//     ));
//   };

//   const handleEditSubtask = (subId) => {
//     setSubtasks(subtasks.map((s) =>
//       s.id === subId ? { ...s, title: editTitle } : s
//     ));
//     setEditingId(null);
//     setEditTitle("");
//   };

//   const handleAddSubtask = () => {
//     if (!newSubtaskTitle.trim()) return;

//     const newSubtask = {
//       id: Date.now(),
//       title: newSubtaskTitle,
//       done: false,
//       priority: getRandom(priorities).text
//     };

//     setSubtasks([...subtasks, newSubtask]);
//     setNewSubtaskTitle("");
//     setAdding(false);
//   };

//   const projectImage = getRandom(defaultProjectImages);
//   const taskTags = [getRandom(types), getRandom(priorities)];

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className="bg-[#16181C] border border-white/10 rounded-2xl p-4 space-y-3 w-full hover:border-white/20 transition"
//     >

//       {/* Drag Handle */}
//       <div
//         {...listeners}
//         {...attributes}
//         className="cursor-grab text-gray-400 text-sm select-none flex items-center gap-1"
//       >
//         ☰ Drag
//       </div>

//       {/* Tags */}
//       <div className="flex gap-2">
//         {taskTags.map((tag, i) => (
//           <span key={i} className={`text-xs px-2 py-1 rounded-lg ${tag.color}`}>
//             {tag.text}
//           </span>
//         ))}
//       </div>

//       {/* Project Image */}
//       <div className="h-28 w-full rounded-xl overflow-hidden">
//         <img
//           src={projectImage}
//           alt="Project"
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Title */}
//       <h3 className="text-white font-semibold">{title}</h3>

//       {/* Description */}
//       <p className="text-gray-400 text-sm">{description}</p>

//       {/* Subtasks */}
//       <div className="space-y-2">
//         {subtasks.map((sub) => (
//           <div key={sub.id} className="flex items-center gap-2">

//             {/* Checkbox */}
//             <div
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleSubtask(sub.id);
//               }}
//               className={`w-4 h-4 border rounded-sm flex items-center justify-center cursor-pointer
//               ${sub.done ? "bg-green-500 border-green-500" : "border-gray-500"}`}
//             >
//               {sub.done && <span className="text-white text-xs">✔</span>}
//             </div>

//             {/* Title / Edit */}
//             {editingId === sub.id ? (
//               <input
//                 className="bg-transparent border-b border-gray-500 text-white outline-none flex-1 text-sm"
//                 value={editTitle}
//                 onChange={(e) => setEditTitle(e.target.value)}
//                 onBlur={() => handleEditSubtask(sub.id)}
//                 onKeyDown={(e) => e.key === "Enter" && handleEditSubtask(sub.id)}
//                 autoFocus
//               />
//             ) : (
//               <span
//                 className={`flex-1 text-sm cursor-text
//                 ${sub.done ? "line-through text-gray-500" : "text-gray-200"}`}
//                 onDoubleClick={(e) => {
//                   e.stopPropagation();
//                   setEditingId(sub.id);
//                   setEditTitle(sub.title);
//                 }}
//               >
//                 {sub.title}
//               </span>
//             )}

//             {/* Priority */}
//             <span
//               className={`text-xs px-2 py-1 rounded-lg
//               ${
//                 sub.priority === "High"
//                   ? "bg-red-500/20 text-red-400"
//                   : sub.priority === "Medium"
//                   ? "bg-yellow-500/20 text-yellow-400"
//                   : "bg-gray-500/20 text-gray-400"
//               }`}
//             >
//               {sub.priority}
//             </span>

//           </div>
//         ))}
//       </div>

//       {/* Add new subtask */}
//       {adding ? (
//         <input
//           type="text"
//           value={newSubtaskTitle}
//           onChange={(e) => setNewSubtaskTitle(e.target.value)}
//           onBlur={handleAddSubtask}
//           onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
//           placeholder="Enter subtask name..."
//           className="w-full text-xs p-1 rounded border border-gray-600 bg-[#16181C] text-white outline-none"
//           autoFocus
//         />
//       ) : (
//         <div
//           className="flex items-center gap-2 text-sm text-blue-400 cursor-pointer hover:underline"
//           onClick={(e) => {
//             e.stopPropagation();
//             setAdding(true);
//           }}
//         >
//           <span className="text-lg font-bold">+</span>
//           <span>Add new subtask</span>
//         </div>
//       )}

//       {/* Employees */}
//       <div className="flex -space-x-2 mt-3">
//         {defaultEmployees.map((emp, i) => (
//           <img
//             key={i}
//             src={emp.image}
//             alt={emp.name}
//             className="w-6 h-6 rounded-full border border-[#16181C]"
//           />
//         ))}
//       </div>

//     </div>
//   );
// }

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";

// Employees
const defaultEmployees = [
  { name: "Alice", image: "https://i.pravatar.cc/150?img=1" },
  { name: "Bob", image: "https://i.pravatar.cc/150?img=2" },
  { name: "Charlie", image: "https://i.pravatar.cc/150?img=3" },
];

// Tags
const types = [
  { text: "UI Design", color: "bg-purple-500/20 text-purple-400" },
  { text: "Marketing", color: "bg-green-500/20 text-green-400" },
  { text: "Social Media", color: "bg-blue-500/20 text-blue-400" },
];

const priorities = [
  { text: "Low", color: "bg-slate-500/20 text-slate-400" },
  { text: "Medium", color: "bg-yellow-500/20 text-yellow-400" },
  { text: "High", color: "bg-red-500/20 text-red-400" },
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function TaskCard({ id, title, description }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const [subtasks, setSubtasks] = useState([
    { id: 1, title: "Develop Core UI Components", done: true, priority: "High" },
    { id: 2, title: "Implement Component States", done: true, priority: "Medium" },
    { id: 3, title: "Write Responsive Layouts", done: false, priority: "Low" },
  ]);

  const toggleSubtask = (subId) => {
    setSubtasks((prev) =>
      prev.map((s) =>
        s.id === subId ? { ...s, done: !s.done } : s
      )
    );
  };

  const projectImage = `https://picsum.photos/300/150?random=${id}`;

  const taskTags = [
    getRandom(types),
    getRandom(priorities),
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
        bg-gradient-to-br from-transparent/20 to-45% to-[#182731]
        border border-slate-700/50
        rounded-2xl
        p-4
        space-y-3
        w-full
        hover:bg-slate-700/30
        hover:border-slate-600/50
        transition-all
        shadow-sm
      "
    >

      {/* Drag */}
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab text-slate-400 text-sm select-none"
      >
        ☰ Drag
      </div>

      {/* Tags */}
      <div className="flex gap-2">
        {taskTags.map((tag, i) => (
          <span
            key={i}
            className={`text-xs px-2 py-1 rounded-lg ${tag.color}`}
          >
            {tag.text}
          </span>
        ))}
      </div>

      {/* Image */}
      <div className="h-28 w-full rounded-xl overflow-hidden border border-slate-700/40">
        <img
          src={projectImage}
          alt="project"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <h3 className="text-slate-100 font-semibold">{title}</h3>

      {/* Description */}
      <p className="text-slate-400 text-sm">{description}</p>

      {/* Subtasks */}
      <div className="space-y-2">
        {subtasks.map((sub) => (
          <div key={sub.id} className="flex items-center gap-2">

            {/* Checkbox */}
            <div
              onClick={() => toggleSubtask(sub.id)}
              className={`
                w-4 h-4 border rounded-sm flex items-center justify-center cursor-pointer
                ${sub.done
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-slate-500"}
              `}
            >
              {sub.done && <span className="text-white text-xs">✔</span>}
            </div>

            {/* Text */}
            <span
              className={`flex-1 text-sm ${
                sub.done
                  ? "line-through text-slate-500"
                  : "text-slate-200"
              }`}
            >
              {sub.title}
            </span>

            {/* Priority */}
            <span
              className={`
                text-xs px-2 py-1 rounded-lg
                ${
                  sub.priority === "High"
                    ? "bg-red-500/20 text-red-400"
                    : sub.priority === "Medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-slate-500/20 text-slate-400"
                }
              `}
            >
              {sub.priority}
            </span>

          </div>
        ))}
      </div>

      {/* Employees */}
      <div className="flex -space-x-2 pt-2">
        {defaultEmployees.map((emp, i) => (
          <img
            key={i}
            src={emp.image}
            alt={emp.name}
            className="w-6 h-6 rounded-full border border-slate-800"
          />
        ))}
      </div>

    </div>
  );
}