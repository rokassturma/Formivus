export default function EmailInput({ email, setEmail, error, setError, styles }) {
    return (
        <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                    setError(value);
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
