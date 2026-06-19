

// import { useDroppable } from "@dnd-kit/core";
// import TaskCard from "@/HrComponents/ProjectPageComponents/TaskCard.jsx";

// export default function Column({ id, title, tasks, onDeleteProject }) {
//   const { setNodeRef } = useDroppable({ id });

//   return (
//     <div
//       ref={setNodeRef}
//       className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 w-full flex flex-col min-h-[600px] shadow-lg backdrop-blur-sm"
//     >
//       {/* Column Header */}
//       <div className="flex items-center gap-2 mb-6">
//         <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>
//         <h3 className="text-slate-100 font-bold text-lg uppercase tracking-wider">{title}</h3>
//         <span className="ml-auto bg-slate-700/50 text-slate-400 text-xs px-2 py-1 rounded-md">
//           {tasks?.length || 0}
//         </span>
//       </div>

//       {/* Tasks List */}
//       <div className="space-y-5">
//         {tasks?.map((task) => (
//           <TaskCard
//             key={task.id}
//             id={task.id}
//             title={task.title}
//             description={task.description}
//             tag={task.tag}
//             avatar={task.avatar}
//             priority={task.priority}
//             onDelete={() => onDeleteProject(task.id)} 
//             onEdit={task.onEdit}
//             assignedTo={task.assignedTo} 
//             onAddTask={task.onAddTask}
//             documents={task.documents}
//             subTasks={task.subTasks} // 🛠️ تم إضافة هذا السطر ليمرر المهام الفرعية للكارد بنجاح
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
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-main)',
      }}
      className="border rounded-3xl p-5 w-full flex flex-col min-h-[600px] shadow-lg backdrop-blur-sm"
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
        <h3 style={{ color: 'var(--text-main)' }} className="font-bold text-lg uppercase tracking-wider">
          {title}
        </h3>
        <span
          style={{
            background: 'var(--tab-inactive-bg)',
            color: 'var(--text-muted)',
          }}
          className="ml-auto text-xs px-2 py-1 rounded-md"
        >
          {tasks?.length || 0}
        </span>
      </div>

      {/* Tasks List */}
      <div className="space-y-5">
        {tasks?.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            tag={task.tag}
            avatar={task.avatar}
            priority={task.priority}
            onDelete={() => onDeleteProject(task.id)}
            onEdit={task.onEdit}
            assignedTo={task.assignedTo}
            onAddTask={task.onAddTask}
            documents={task.documents}
            subTasks={task.subTasks}
          />
        ))}
      </div>
    </div>
  );
}