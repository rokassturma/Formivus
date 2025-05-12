export default function UsernameInput({ username, setUsername, error, setError, styles }) {
  return (
    <div className={styles.formGroup}>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => {
          const value = e.target.value;
          setUsername(value);
          setError(value);
        }}
        onBeforeInput={(e) => {
          const allowed = /^[a-zA-Z0-9]*$/;
          if (!allowed.test(e.data)) e.preventDefault();
        }}
        required
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
