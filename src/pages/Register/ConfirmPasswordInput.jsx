import { useState } from 'react';

export default function ConfirmPasswordInput({ confirmPassword, setConfirmPassword, styles }) {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className={styles.formGroup}>
      <label htmlFor="confirmPassword">Please confirm password:</label>

      <div className={styles.passwordWrapper}>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className={styles.togglePassword}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  );
}
