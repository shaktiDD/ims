import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Mail, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const { role } = useParams(); // 'manager' or 'intern'
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isManager = role === 'manager';
    const title = isManager ? 'Manager Login' : 'Intern Login';
    const endpoint = isManager ? '/api/auth/manager/login' : '/api/auth/intern/login';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(`http://localhost:5000${endpoint}`, { email });
            login(res.data.user);

            // Redirect based on role
            if (isManager) navigate('/dashboard');
            else navigate('/intern');

        } catch (err) {
            setError(err.response?.data?.error || "Login failed. Please check your email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <Link to="/login" className="text-gray-500 hover:text-white flex items-center gap-2 mb-8 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back to Selection
                </Link>

                <div className="bg-[#121212] border border-white/10 p-8 rounded-2xl shadow-xl">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                        <p className="text-gray-400 text-sm">Enter your registered email to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                                    placeholder={isManager ? "admin@wims.com" : "intern@example.com"}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg
                                ${isManager
                                    ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                                    : 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20'}
                            `}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    Login <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
