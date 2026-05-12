
// import { useDroppable } from "@dnd-kit/core";
// import TaskCard from "@/HrComponents/ProjectPageComponents/TaskCard.jsx";

// export default function Column({ id, title, tasks, onDeleteProject }) {
//   const { setNodeRef } = useDroppable({ id });

//   return (
//     <div
//       ref={setNodeRef}
//       className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 min-w-[300px] max-w-[320px] flex-shrink-0 shadow-sm"
//     >
//       <h3 className="text-slate-100 font-semibold mb-4">{title}</h3>

//       <div className="space-y-4">
//         {tasks?.map((task) => (
//           <TaskCard
//             key={task.id}
//             id={task.id}
//             title={task.title}
//             description={task.description}
//             // تمرير دالة المسح للكارت
//             onDelete={() => onDeleteProject(task.id)} 
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
// import { useDroppable } from "@dnd-kit/core";
// import TaskCard from "@/HrComponents/ProjectPageComponents/TaskCard.jsx";

// export default function Column({ id, title, tasks, onDeleteProject }) {
//   const { setNodeRef } = useDroppable({ id });

//   return (
//     <div
//       ref={setNodeRef}
//       className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 w-full flex flex-col min-h-[600px] shadow-lg backdrop-blur-sm"
//     >
//       <div className="flex items-center gap-2 mb-6">
//         <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>
//         <h3 className="text-slate-100 font-bold text-lg uppercase tracking-wider">{title}</h3>
//         <span className="ml-auto bg-slate-700/50 text-slate-400 text-xs px-2 py-1 rounded-md">
//           {tasks?.length || 0}
//         </span>
//       </div>

//       <div className="space-y-5">
//         {tasks?.map((task) => (
//           <TaskCard
//             key={task.id}
//             id={task.id}
//             title={task.title}
//             description={task.description}
//             tag={task.tag}
//             avatar={task.avatar}
//             onDelete={() => onDeleteProject(task.id)} 
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "@/HrComponents/ProjectPageComponents/TaskCard.jsx";

export default function Column({ id, title, tasks, onDeleteProject }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 w-full flex flex-col min-h-[600px] shadow-lg backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>
        <h3 className="text-slate-100 font-bold text-lg uppercase tracking-wider">{title}</h3>
        <span className="ml-auto bg-slate-700/50 text-slate-400 text-xs px-2 py-1 rounded-md">
          {tasks?.length || 0}
        </span>
      </div>

      <div className="space-y-5">
        {tasks?.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            tag={task.tag}
            avatar={task.avatar}
            priority={task.priority} // تأكدي إننا بنمرر الـ priority برضه
            onDelete={() => onDeleteProject(task.id)} 
            // السطر اللي كان ناقص هو ده:
            onEdit={task.onEdit} 
          />
        ))}
      </div>
    </div>
  );
}