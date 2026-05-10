
// import { useState, useEffect } from "react";
// import { DndContext } from "@dnd-kit/core";
// import Column from "../../components/ProjectPageComponents/Column.jsx";
// import ProjectHeader from "../../components/ProjectPageComponents/ProjectHeader.jsx";

// export default function Project() {
//  
//   const [columns, setColumns] = useState({
//     Todo: [],
//     "On-going": [],
//     Pending: [],
//     Completed: [],
//   });

//   
//   useEffect(() => {
//     const fakeData = {
//       Todo: [
//         { id: "t1", title: "Landing Page", description: "Design homepage" },
//         { id: "t2", title: "Social Campaign", description: "Run Instagram ads" },
//       ],
//       "On-going": [
//         { id: "t3", title: "Prototype", description: "Interactive design" },
//         { id: "t4", title: "Wireframes", description: "Sketch pages" },
//       ],
//       Pending: [
//         { id: "t5", title: "SEO Setup", description: "Optimize pages" },
//         { id: "t6", title: "Ads Campaign", description: "Run Google ads" },
//       ],
//       Completed: [
//         { id: "t7", title: "Research", description: "Market research done" },
//         { id: "t8", title: "Logo Design", description: "Brand identity" },
//       ],
//     };

//     setColumns(fakeData);
//   }, []);

//   // Drag & Drop handler
//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (!over) return;

//     const sourceCol = Object.keys(columns).find((col) =>
//       columns[col].some((task) => task.id === active.id)
//     );
//     const targetCol = over.id;
//     if (!sourceCol || !targetCol  ||  sourceCol === targetCol) return;

//     const task = columns[sourceCol].find((t) => t.id === active.id);

//     setColumns((prev) => ({
//       ...prev,
//       [sourceCol]: prev[sourceCol].filter((t) => t.id !== active.id),
//       [targetCol]: [...prev[targetCol], task],
//     }));
//   };

//   return (
//     <div className="max-w-[1650px] mx-auto p-4 bg-transparent">
//       <ProjectHeader />
//       <DndContext onDragEnd={handleDragEnd}>
//         <div className="flex gap-6 overflow-x-auto pb-4">
//           {Object.keys(columns).map((col) => (
//             <Column key={col} id={col} title={col} tasks={columns[col]} />
//           ))}
//         </div>
//       </DndContext>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import Column from "../../components/ProjectPageComponents/Column.jsx";
import ProjectHeader from "../../components/ProjectPageComponents/ProjectHeader.jsx";

export default function Project() {
  const [columns, setColumns] = useState({
    Todo: [],
    "On-going": [],
    Pending: [],
    Completed: [],
  });

  useEffect(() => {
    const fakeData = {
      Todo: [
        { id: "t1", title: "Landing Page", description: "Design homepage" },
        { id: "t2", title: "Social Campaign", description: "Run Instagram ads" },
      ],
      "On-going": [
        { id: "t3", title: "Prototype", description: "Interactive design" },
        { id: "t4", title: "Wireframes", description: "Sketch pages" },
      ],
      Pending: [
        { id: "t5", title: "SEO Setup", description: "Optimize pages" },
        { id: "t6", title: "Ads Campaign", description: "Run Google ads" },
      ],
      Completed: [
        { id: "t7", title: "Research", description: "Market research done" },
        { id: "t8", title: "Logo Design", description: "Brand identity" },
      ],
    };

    setColumns(fakeData);
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const sourceCol = Object.keys(columns).find((col) =>
      columns[col].some((task) => task.id === active.id)
    );
    const targetCol = over.id;

    if (!sourceCol || !targetCol || sourceCol === targetCol) return;

    const task = columns[sourceCol].find((t) => t.id === active.id);

    setColumns((prev) => ({
      ...prev,
      [sourceCol]: prev[sourceCol].filter((t) => t.id !== active.id),
      [targetCol]: [...prev[targetCol], task],
    }));
  };

  return (
    <div className="max-w-[1650px] mx-auto p-4 bg-transparent">
      <ProjectHeader />

      <DndContext onDragEnd={handleDragEnd}>
        <div className="w-full overflow-hidden">
          <div
            className="flex items-start gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {Object.keys(columns).map((col) => (
              <Column
                key={col}
                id={col}
                title={col}
                tasks={columns[col]}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
}