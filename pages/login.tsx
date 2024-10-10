import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext'; // Ensure AuthContext is updated accordingly
import Link from 'next/link';

const LoginPage: React.FC = () => {
    const [identifier, setIdentifier] = useState(''); // Can be username or email
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { login } = useAuth(); // Destructure login function from useAuth

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Call the login function from AuthContext
            await login(identifier, password); // Ensure AuthContext handles 'identifier' correctly

            // Redirect to home page or dashboard after successful login
            router.push('/');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setLoading(false);
            setError(err.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="flex justify-center bg-gray-200">
            <div className="bg-white p-8 rounded-lg mb-52 mt-36 shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    {/* Identifier Field (Username or Email) */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="identifier">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            id="identifier"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="Username or you@example.com"
                        />
                    </div>
                    
                    {/* Password Field */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="********"
                        />
                    </div>
                    
                    {/* Error Message */}
                    {error && (
                        <div className="text-red-500 mb-4">
                            {error}
                        </div>
                    )}
                    
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 ${loading && 'opacity-50 cursor-not-allowed'}`}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Dont have an account?
                    <Link href="/register" className="text-blue-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
