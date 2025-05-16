import { validateEmail } from '../../utils/validators';

export default function EmailInput({ email, setEmail, error, setError, styles }) {
    return (
        <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                    setError(validateEmail(value));
                }}
                onBeforeInput={(e) => {
                    const disallowed = /[\\/*;"'()&]/;
                    if (disallowed.test(e.data)) e.preventDefault();
                }}
                required
            />
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}