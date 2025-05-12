export function validateEmail(email) {
    if (!email) return 'Email is required.';

    const notAllowed = /[\\/*;"'()&]/;
    if (notAllowed.test(email)) {
        return "Email cannot contain special symbols."
    }

    if (!email.includes('@')) {
        return '@ is required';
    }

    const parts = email.split('@');
    if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
        return 'Invalid email format.';
    }

    if (!parts[1].includes('.')) {
        return 'Email domain must include a dot (e.g. gmail.com)';
    }

    const domainParts = parts[1].split('.');
    const ending = domainParts[domainParts.length - 1];

    const tldRegex = /^[a-zA-Z]{2,}$/;
    if (!tldRegex.test(ending)) {
        return 'Email ending is not valid. For example: .com, .lt, .lv';
    }

}


export function validateUsername(username) {
    const regex = /^[a-zA-Z0-9]{5,}$/;

    if (!username) return 'Username is required';
    if (!regex.test(username)) {
        return 'Username must be at least 5 characters and contain only letters or numbers';
    }

    return '';
}


export function checkPasswordRequirements(password) {
    return {
        hasMinLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[^A-Za-z0-9\s]/.test(password),
    };
}

export function getPasswordStrength(requirements) {
    const passed = Object.values(requirements).filter(Boolean).length;

    if (passed <= 2) return 'Weak';
    if (passed <= 4) return 'Medium';
    return 'Strong';
}
