import { useState } from "react";
import AddJobModal from "../AddJobModal/AddJobModal";

const JobsHeader = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <AddJobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <div className="flex items-center justify-between mb-10 mt-6">
                <h1 className="text-2xl font-bold text-white tracking-tight">Job posts</h1>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#0095ff] hover:bg-[#0081dd] text-white w-10 h-10 sm:w-auto sm:h-auto sm:px-6 sm:py-2.5 rounded-full sm:rounded-xl
                               flex items-center justify-center sm:gap-2 font-bold shadow-lg transition-all active:scale-95 shrink-0"
                >
                    <i className="fas fa-plus text-sm" />
                    <span className="hidden sm:inline">Add Job Post</span>
                </button>
            </div>
        </>
    );
};

export default JobsHeader;