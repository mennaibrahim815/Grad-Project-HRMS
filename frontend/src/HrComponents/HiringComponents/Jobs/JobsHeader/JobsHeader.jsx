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
                    className="bg-[#0095ff] hover:bg-[#0081dd] text-white px-6 py-2.5 rounded-xl
                               flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95"
                >
                    <i className="fas fa-plus text-sm" />
                    <span>Add Job Post</span>
                </button>
            </div>
        </>
    );
};

export default JobsHeader;