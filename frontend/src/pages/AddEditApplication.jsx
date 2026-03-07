import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createApplication, getApplicationById, updateApplication } from '../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';

const STATUSES = ['Applied', 'Shortlisted', 'Interview', 'Rejected', 'Offer'];

const defaultForm = {
  company_name: '',
  job_role: '',
  location: '',
  application_date: new Date().toISOString().split('T')[0],
  application_status: 'Applied',
  salary: '',
  job_link: '',
  notes: '',
};

const FormField = ({ label, id, required, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

const AddEditApplication = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      getApplicationById(id)
        .then((res) => {
          const app = res.data;
          setForm({
            ...app,
            application_date: app.application_date?.split('T')[0] || app.application_date,
          });
        })
        .catch(() => toast.error('Failed to load application'))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateApplication(id, form);
        toast.success('Application updated!');
      } else {
        await createApplication(form);
        toast.success('Application added!');
      }
      navigate('/applications');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save application');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="p-8 flex items-center justify-center">
      <div className="text-slate-400">Loading...</div>
    </div>
  );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/applications')}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to Applications
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{isEdit ? 'Edit Application' : 'Add Application'}</h1>
        <p className="text-slate-400 mt-1">{isEdit ? 'Update your application details' : 'Track a new internship application'}</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Company Name" id="company_name" required>
            <input id="company_name" name="company_name" type="text" required placeholder="e.g. Google"
              className={inputClass} value={form.company_name} onChange={handleChange} />
          </FormField>
          <FormField label="Job Role" id="job_role" required>
            <input id="job_role" name="job_role" type="text" required placeholder="e.g. Software Engineer Intern"
              className={inputClass} value={form.job_role} onChange={handleChange} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Location" id="location">
            <input id="location" name="location" type="text" placeholder="e.g. San Francisco, CA"
              className={inputClass} value={form.location} onChange={handleChange} />
          </FormField>
          <FormField label="Application Date" id="application_date" required>
            <input id="application_date" name="application_date" type="date" required
              className={inputClass} value={form.application_date} onChange={handleChange} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Status" id="application_status">
            <select id="application_status" name="application_status"
              className={inputClass} value={form.application_status} onChange={handleChange}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Salary / Stipend" id="salary">
            <input id="salary" name="salary" type="text" placeholder="e.g. $2000/month"
              className={inputClass} value={form.salary} onChange={handleChange} />
          </FormField>
        </div>

        <FormField label="Job Link" id="job_link">
          <input id="job_link" name="job_link" type="url" placeholder="https://company.com/job-posting"
            className={inputClass} value={form.job_link} onChange={handleChange} />
        </FormField>

        <FormField label="Notes" id="notes">
          <textarea id="notes" name="notes" rows={4} placeholder="Any additional notes about this application..."
            className={`${inputClass} resize-none`} value={form.notes} onChange={handleChange} />
        </FormField>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            {loading ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save Changes' : 'Add Application')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/applications')}
            className="px-6 py-3 glass border border-white/10 text-slate-300 font-medium rounded-xl hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditApplication;
