import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getApplications, deleteApplication } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiExternalLink, FiFilter, FiBriefcase } from 'react-icons/fi';

const STATUSES = ['All', 'Applied', 'Shortlisted', 'Interview', 'Rejected', 'Offer'];

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('date_desc');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlStatus = searchParams.get('status');
    if (urlStatus) setStatus(urlStatus);
  }, [searchParams]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = { search, sort };
      if (status !== 'All') params.status = status;
      const res = await getApplications(params);
      setApplications(res.data);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, [status, sort, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await deleteApplication(id);
      toast.success('Application deleted');
      setApplications(applications.filter((a) => a.id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Applications</h1>
          <p className="text-slate-400 mt-1">Track all your internship applications</p>
        </div>
        <Link
          to="/applications/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-indigo-500/25"
        >
          <FiPlus className="w-4 h-4" /> Add Application
        </Link>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            id="search-input"
            type="text"
            placeholder="Search company, role, location..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <FiFilter className="text-slate-400 w-4 h-4" />
          {STATUSES.map((s) => (
            <button
              key={s}
              id={`filter-${s.toLowerCase()}`}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                status === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <select
          id="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="date_desc">Date (Newest)</option>
          <option value="date_asc">Date (Oldest)</option>
          <option value="company">Company A-Z</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <FiBriefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No applications found.</p>
          <Link to="/applications/add" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 text-sm">
            Add your first application →
          </Link>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Location</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Salary</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/10 flex items-center justify-center text-xs font-bold text-indigo-300">
                          {app.company_name.charAt(0)}
                        </div>
                        <span className="text-white font-medium text-sm">{app.company_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{app.job_role}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm hidden md:table-cell">{app.location || '—'}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm hidden lg:table-cell">
                      {new Date(app.application_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={app.application_status} /></td>
                    <td className="px-6 py-4 text-slate-400 text-sm hidden lg:table-cell">{app.salary || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {app.job_link && (
                          <a href={app.job_link} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                            <FiExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <Link to={`/applications/edit/${app.id}`} className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(app.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;

