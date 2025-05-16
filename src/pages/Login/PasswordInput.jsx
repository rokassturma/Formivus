import { useState } from 'react';

export default function PasswordInput({ password, setPassword, styles }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.formGroup}>
      <label htmlFor="password">Password:</label>

      <div className={styles.passwordWrapper}>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
