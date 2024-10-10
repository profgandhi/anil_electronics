import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { registerUser } from '../services/api'; // Ensure this function handles all fields

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [landlineNumber, setLandlineNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [dateOfAnniversary, setDateOfAnniversary] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate required fields
        if (!username || !email || !password || !confirmPassword) {
            setError("Username, Email, and Password are required");
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Password and Confirm Password do not match");
            return;
        }

        setError('');
        setLoading(true);

        try {
            const userData = {
                username,
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
                landline_number: landlineNumber,
                date_of_birth: dateOfBirth,
                date_of_anniversary: dateOfAnniversary,
                gender
            };

            const response = await registerUser(userData);
            setLoading(false);
            if (response.status === 201) {
                setSuccessMessage("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="yourusername"
                        />
                    </div>
                    
                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="you@example.com"
                        />
                    </div>
                    
                    {/* Password Field */}
                    <div className="mb-4">
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
                    
                    {/* Confirm Password Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="********"
                        />
                    </div>

                    {/* Additional Fields */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="first-name">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="first-name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="John"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="last-name">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="last-name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="Doe"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="phone-number">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone-number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="+1234567890"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="landline-number">
                            Landline Number
                        </label>
                        <input
                            type="tel"
                            id="landline-number"
                            value={landlineNumber}
                            onChange={(e) => setLandlineNumber(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="+0987654321"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="date-of-birth">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            id="date-of-birth"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="date-of-anniversary">
                            Date of Anniversary
                        </label>
                        <input
                            type="date"
                            id="date-of-anniversary"
                            value={dateOfAnniversary}
                            onChange={(e) => setDateOfAnniversary(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="gender">
                            Gender
                        </label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Error and Success Messages */}
                    {error && <div className='text-red-500 mb-1'>{error}</div>}
                    {successMessage && <div className='text-green-500 mb-1'>{successMessage}</div>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 ${loading && 'opacity-50 cursor-not-allowed'}`}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
