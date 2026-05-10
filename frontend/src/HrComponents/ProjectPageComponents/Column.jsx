

// import { useDroppable } from "@dnd-kit/core";
// import TaskCard from "./TaskCard.jsx";

// export default function Column({ id, title, tasks }) {
//   const { setNodeRef } = useDroppable({ id });

//   return (
//     <div
//       ref={setNodeRef}
//       className="bg-[#1B1E22] rounded-2xl p-4 w-[320px] flex-shrink-0 border border-white/10"
//     >
//       <h3 className="text-white font-semibold mb-4">{title}</h3>

//       <div className="space-y-4">
//         {tasks.map((task) => (
//           <TaskCard
//             key={task.id}
//             id={task.id}
//             title={task.title}
//             description={task.description}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard.jsx";

export default function Column({ id, title, tasks }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="
        bg-slate-800/50
        border border-slate-700/50
        rounded-2xl
        p-4
        min-w-[300px]
        max-w-[320px]
        flex-shrink-0
        shadow-sm
      "
    >
      <h3 className="text-slate-100 font-semibold mb-4">
        {title}
      </h3>

      <div className="space-y-4">
        {tasks?.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
          />
        ))}
      </div>
    </div>
  );
}