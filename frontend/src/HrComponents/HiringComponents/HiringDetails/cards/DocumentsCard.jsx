import BaseCard from "../../../../components/UI/Card";
import React from 'react'
function DocumentsCard({ applicant }) {
    const { documents } = applicant || {};
    return (
        <BaseCard className="flex flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Documents
            </p>
            <div className="flex gap-3">
                {documents?.resume ? (
                    <a
                    
                        href={documents.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/20 transition-all"
                    >
                        <i className="fas fa-file-pdf text-sm"></i>
                        View Resume
                    </a>
                ) : (
                    <span
                        style={{ background: 'var(--tab-inactive-bg)', borderColor: 'var(--border-main)', color: 'var(--text-muted)' }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm cursor-not-allowed"
                    >
                        <i className="fas fa-file-pdf text-sm"></i>
                        No Resume
                    </span>
                )}
                {documents?.portfolio ? (
                    <a
                        href={documents.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        style={{ background: 'var(--tab-inactive-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm hover:opacity-80 transition-all"
                    >
                        <i className="fas fa-globe text-sm"></i>
                        Portfolio
                    </a>
                ) : (
                    <span
                        style={{ background: 'var(--tab-inactive-bg)', borderColor: 'var(--border-main)', color: 'var(--text-muted)' }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm cursor-not-allowed"
                    >
                        <i className="fas fa-globe text-sm"></i>
                        No Portfolio
                    </span>
                )}
            </div>
        </BaseCard>
    );
}

export default DocumentsCard;