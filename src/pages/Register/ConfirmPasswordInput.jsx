export default function ConfirmPasswordInput({ confirmPassword, setConfirmPassword, styles }) {
  return (
    <div className={styles.formGroup}>
      <label htmlFor="confirmPassword">Please confirm password:</label>
      <input
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
    </div>
  );
}
