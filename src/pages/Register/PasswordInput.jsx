export default function PasswordInput({ password, setPassword, setRequirements, setStrength, styles, checkPasswordRequirements, getPasswordStrength }) {
    return (
        <div className={styles.formGroup}>
            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                    const val = e.target.value;
                    setPassword(val);
                    const reqs = checkPasswordRequirements(val);
                    setRequirements(reqs);
                    setStrength(getPasswordStrength(reqs));
                }}
                required
            />
        </div>
    );
}
