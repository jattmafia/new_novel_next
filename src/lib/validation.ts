/**
 * Email validation using industry-standard regex pattern
 * Follows RFC 5322 simplified pattern for practical use
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Password validation with strength requirements
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number");
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

/**
 * Validate email and password fields
 */
export const validateLoginForm = (email: string, password: string) => {
    const errors: { [key: string]: string } = {};

    if (!email.trim()) {
        errors.email = "Email is required";
    } else if (!validateEmail(email)) {
        errors.email = "Please enter a valid email address";
    }

    if (!password) {
        errors.password = "Password is required";
    } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateSignupForm = (email: string, password: string, confirmPassword: string) => {
    const errors: { [key: string]: string } = {};
    if (!email.trim()) {
        errors.email = "Email is required";
    } else if (!validateEmail(email)) {
        errors.email = "Please enter a valid email address";
    }
    const passwordValidation = validatePassword(password);
    if (!password) {
        errors.password = "Password is required";   
    } else if (!passwordValidation.valid) {
        errors.password = passwordValidation.errors.join(". ");
    }
    if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};