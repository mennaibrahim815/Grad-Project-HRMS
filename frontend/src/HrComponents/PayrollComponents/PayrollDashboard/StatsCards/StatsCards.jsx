  const StatsCards = ({ stats }) => {

    
     const cards = [
       {
         title: "Payroll cost",
         value: stats?.payroll_cost?.value,
         change: stats?.payroll_cost?.percentage,
         up:stats?.payroll_cost?.status ,
         
       },
       {
         title: "Total expense",
         value: stats?.total_expense?.value,
         change: stats?.total_expense?.percentage,
         up:stats?.total_expense?.status ,
       },
       {
         title: "Pending payments",
         value: stats?.pending_payments?.value,
         change: stats?.pending_payments?.percentage,
         up:stats?.pending_payments?.status ,
       },
       {
         title:"Total income",
         value: stats?.total_income?.value,
         change: stats?.total_income?.percentage,
         up:stats?.total_income?.status ,
       },
     ];
     return (
       <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
         {cards.map((card, i) => (
           <div
             key={i}
             className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-7 rounded-[2rem] border border-gray-800/50 relative group transition-all hover:border-blue-500/30"
           >
             <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">
               {card.title}
               
             </p>
   
            <h2 className="text-3xl font-black text-white mb-4">
           {card.value?.toLocaleString() || "0"}
            </h2>

        <div
        className={`text-xs font-bold flex items-center gap-1 ${
        card.up === "up" ? "text-green-500" : "text-pink-500"
        }`}
        >
        <i className={`fas fa-arrow-${card.up === "up" ? "up" : "down"}`}></i>
        {card.change}%
       <span className="text-gray-600 font-medium ml-1 text-[10px]">
       vs last month
       </span>
       </div>
   
           
        </div>
         ))}
       </div>
     );
   };
   
   export default StatsCards;
   