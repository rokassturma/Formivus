import classNames from 'classnames';

export default function PasswordRequirements({ requirements, strength, styles }) {

    if (!requirements || Object.keys(requirements).length === 0) {
        return null;
    }

    return (
        <>
            <ul className={styles.requirementsList}>
                <li className={classNames(styles.requirementItem, { [styles.valid]: requirements.hasMinLength })}>
                    At least 8 characters
                </li>
                <li className={classNames(styles.requirementItem, { [styles.valid]: requirements.hasUpperCase })}>
                    At least 1 uppercase letter
                </li>
                <li className={classNames(styles.requirementItem, { [styles.valid]: requirements.hasLowerCase })}>
                    At least 1 lowercase letter
                </li>
                <li className={classNames(styles.requirementItem, { [styles.valid]: requirements.hasNumber })}>
                    At least 1 number
                </li>
                <li className={classNames(styles.requirementItem, { [styles.valid]: requirements.hasSpecialChar })}>
                    At least 1 special character
                </li>
            </ul>

            <p className={`${styles.strength} ${styles[strength.toLowerCase()]}`}>
                Password strength: {strength}
            </p>
        </>
    );
}
