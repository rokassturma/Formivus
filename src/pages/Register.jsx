import { useState } from 'react';
import axios from 'axios';
import styles from './pagesStyles/Register.module.scss';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    function checkPasswordStrength(password) {
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);
        const lengthValid = password.length >= 8;

        if (hasUpper && hasLower && hasNumber && hasSymbol && lengthValid) {
            return 'strong';
        }
        if ((hasUpper && hasLower && hasNumber && lengthValid)) {
            return 'medium';
        }
        return 'weak';
    }

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === 'password') {
            const strength = checkPasswordStrength(value);
            setPasswordStrength(strength);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (formData.username.length < 5) {
            setMessage('Username must be at least 5 characters long');
            setStatus('error');
            return;
        }

        if (formData.password.length < 8) {
            setMessage('Password must be at least 8 characters long');
            setStatus('error');
            return;
        }

        if (passwordStrength === 'weak') {
            setMessage('Password is too weak');
            setStatus('error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.(com|lt|org|net|edu|gov)$/i;

        if (!emailRegex.test(formData.email)) {
            setMessage('Email must end with .com, .lt, .org, .net, .edu or .gov');
            setStatus('error');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/register', formData);
            setMessage(res.data.message);
            setStatus('success');
            setFormData({
                username: '',
                email: '',
                password: '',
            });
            setPasswordStrength('');
        } catch (err) {
            if (err.response) {
                setMessage(err.response.data.message);
            } else {
                setMessage('Something went wrong');
            }
            setStatus('error');
        }

        setTimeout(() => {
            setMessage('');
            setStatus('');
        }, 3000);
    }

    return (
        <div className={styles.registerContainer}>
            <h2>Create an Account</h2>

            {message && (
                <div
                    className={
                        status === 'success'
                            ? styles.successMessage
                            : styles.errorMessage
                    }
                >
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.registerForm}>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                            const allowed = /^[a-zA-Z0-9_]$/;
                            if (
                                e.key.length === 1 &&
                                !allowed.test(e.key)
                            ) {
                                e.preventDefault();
                            }
                        }}
                        minLength={5}
                        required
                    />
                </label>

                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Password:
                    <div className={styles.passwordWrapper}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={styles.toggleButton}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </label>

                {passwordStrength && (
                    <p
                        className={
                            passwordStrength === 'strong'
                                ? styles.strong
                                : passwordStrength === 'medium'
                                    ? styles.medium
                                    : styles.weak
                        }
                    >
                        Password strength: {passwordStrength}
                    </p>
                )}

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
