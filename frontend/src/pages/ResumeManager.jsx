import { useEffect, useState, useRef } from 'react';
import { uploadResume, getResumes, deleteResume, downloadResume } from '../services/api';
import toast from 'react-hot-toast';
import { FiUpload, FiDownload, FiTrash2, FiFile, FiFileText } from 'react-icons/fi';

const ResumeManager = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchResumes = async () => {
    try {
      const res = await getResumes();
      setResumes(res.data);
    } catch {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    setUploading(true);
    try {
      const res = await uploadResume(formData);
      setResumes([res.data.resume, ...resumes]);
      toast.success('Resume uploaded successfully!');
      fileInputRef.current.value = '';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (resume) => {
    try {
      const res = await downloadResume(resume.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resume.file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Downloading...');
    } catch {
      toast.error('Failed to download resume');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await deleteResume(id);
      setResumes(resumes.filter((r) => r.id !== id));
      toast.success('Resume deleted');
    } catch {
      toast.error('Failed to delete resume');
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext === 'pdf' ? FiFileText : FiFile;
  };

  const formatSize = (filename) => filename.length > 40 ? filename.slice(0, 40) + '...' : filename;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Resume Manager</h1>
        <p className="text-slate-400 mt-1">Upload and manage your resumes for internship applications</p>
      </div>

      {/* Upload Zone */}
      <div
        className="glass rounded-2xl p-8 mb-6 border-2 border-dashed border-indigo-500/30 hover:border-indigo-500/60 transition-all cursor-pointer text-center group"
        onClick={() => fileInputRef.current.click()}
      >
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-600/30 transition-all">
          <FiUpload className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-white font-semibold mb-2">
          {uploading ? 'Uploading...' : 'Click to upload resume'}
        </h3>
        <p className="text-slate-500 text-sm">PDF, DOC, or DOCX • Max 5MB</p>
        <input
          ref={fileInputRef}
          id="resume-upload"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
        {uploading && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-indigo-400 text-sm">Uploading...</span>
          </div>
        )}
      </div>

      {/* Resumes list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <FiFile className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No resumes uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map((resume) => {
            const FileIcon = getFileIcon(resume.file_name);
            return (
              <div
                key={resume.id}
                className="glass rounded-xl px-5 py-4 flex items-center justify-between hover:bg-white/[0.08] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                    <FileIcon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{formatSize(resume.file_name)}</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Uploaded {new Date(resume.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(resume)}
                    className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all text-xs font-medium"
                  >
                    <FiDownload className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResumeManager;
