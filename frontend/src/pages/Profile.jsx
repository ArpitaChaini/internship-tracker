import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../services/api';
import { FiUser, FiMail, FiCalendar } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, []);

  const data = profile || user;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-slate-400 mt-1">Your account information</p>
      </div>

      <div className="glass rounded-2xl p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-indigo-500/30">
            {data?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{data?.name}</h2>
            <p className="text-indigo-400 text-sm mt-0.5">Student</p>
          </div>
        </div>

        {/* Info fields */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center">
              <FiUser className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Full Name</p>
              <p className="text-white font-medium mt-0.5">{data?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
              <FiMail className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Email Address</p>
              <p className="text-white font-medium mt-0.5">{data?.email}</p>
            </div>
          </div>

          {profile?.created_at && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Member Since</p>
                <p className="text-white font-medium mt-0.5">
                  {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20">
          <p className="text-indigo-300 text-sm">
            🎓 Keep tracking your internship applications to land your dream role!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
