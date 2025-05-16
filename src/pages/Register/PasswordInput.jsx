import { useState } from 'react';

export default function PasswordInput({
    password,
    setPassword,
    setRequirements,
    setStrength,
    styles,
    checkPasswordRequirements,
    getPasswordStrength
}) {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const val = e.target.value;
        setPassword(val);

        const reqs = checkPasswordRequirements(val);
        setRequirements(reqs);

        const strength = getPasswordStrength(reqs);
        setStrength(strength);
    };

    return (
        <div className={styles.formGroup}>
            <label htmlFor="password">Password:</label>

            <div className={styles.passwordWrapper}>
                <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={handleChange}
                    required
                />
                <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>
        </div>
    );
}
