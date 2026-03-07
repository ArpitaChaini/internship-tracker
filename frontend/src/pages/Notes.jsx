import { useEffect, useState } from 'react';
import { createNote, getNotes, updateNote, deleteNote } from '../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiFileText } from 'react-icons/fi';

const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm";

const emptyForm = { company: '', role: '', questions: '', experience: '', tips: '' };

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await getNotes();
      setNotes(res.data);
    } catch {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (note) => {
    setForm({ company: note.company, role: note.role, questions: note.questions || '', experience: note.experience || '', tips: note.tips || '' });
    setEditingId(note.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const res = await updateNote(editingId, form);
        setNotes(notes.map((n) => n.id === editingId ? res.data.note : n));
        toast.success('Note updated!');
      } else {
        const res = await createNote(form);
        setNotes([res.data.note, ...notes]);
        toast.success('Note added!');
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Interview Notes</h1>
          <p className="text-slate-400 mt-1">Document your interview experiences and preparation tips</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-indigo-500/25"
        >
          <FiPlus className="w-4 h-4" /> Add Note
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 border border-indigo-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{editingId ? 'Edit Note' : 'New Interview Note'}</h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white transition-colors">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Company *</label>
                <input id="note-company" name="company" required placeholder="Company name" className={inputClass} value={form.company} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Role *</label>
                <input id="note-role" name="role" required placeholder="Job role" className={inputClass} value={form.role} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Interview Questions</label>
              <textarea name="questions" rows={3} placeholder="Questions asked during the interview..." className={`${inputClass} resize-none`} value={form.questions} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Experience</label>
              <textarea name="experience" rows={3} placeholder="How was the experience? What did you learn?" className={`${inputClass} resize-none`} value={form.experience} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Tips for Others</label>
              <textarea name="tips" rows={2} placeholder="Tips for future interviews at this company..." className={`${inputClass} resize-none`} value={form.tips} onChange={handleChange} />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition-all">
                <FiCheck className="w-4 h-4" /> {saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Note')}
              </button>
              <button type="button" onClick={resetForm} className="px-5 py-2.5 glass border border-white/10 text-slate-300 text-sm rounded-xl hover:bg-white/10 transition-all">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Notes grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="glass rounded-2xl h-48 animate-pulse" />)}
        </div>
      ) : notes.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <FiFileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No interview notes yet. Start documenting your experiences!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div key={note.id} className="glass rounded-2xl p-6 hover:bg-white/[0.08] transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">{note.company}</h3>
                  <p className="text-indigo-400 text-sm mt-0.5">{note.role}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(note)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(note.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {note.questions && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Questions Asked</p>
                  <p className="text-slate-300 text-sm line-clamp-3">{note.questions}</p>
                </div>
              )}
              {note.experience && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Experience</p>
                  <p className="text-slate-300 text-sm line-clamp-2">{note.experience}</p>
                </div>
              )}
              {note.tips && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tips</p>
                  <p className="text-slate-300 text-sm line-clamp-2">{note.tips}</p>
                </div>
              )}
              <p className="text-xs text-slate-600 mt-4">{new Date(note.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
