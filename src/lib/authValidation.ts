/**
 * Extended Validation Functions
 * Includes validators for signup fields following best practices
 */

/**
 * Validate full name
 */
export const validateName = (name: string): { valid: boolean; error?: string } => {
    if (!name.trim()) {
        return { valid: false, error: "Full name is required" };
    }
    if (name.length < 3) {
        return { valid: false, error: "Name must be at least 3 characters" };
    }
    if (name.length > 50) {
        return { valid: false, error: "Name must be less than 50 characters" };
    }
    return { valid: true };
};

/**
 * Validate gender
 */
export const validateGender = (gender: string): { valid: boolean; error?: string } => {
    const validGenders = ["male", "female", "other", "prefer_not_to_say"];
    if (!gender) {
        return { valid: false, error: "Gender is required" };
    }
    if (!validGenders.includes(gender)) {
        return { valid: false, error: "Please select a valid gender" };
    }
    return { valid: true };
};

/**
 * Validate date of birth
 * Must be at least 13 years old, less than 120 years old
 */
export const validateDOB = (dob: string): { valid: boolean; error?: string } => {
    if (!dob) {
        return { valid: false, error: "Date of birth is required" };
    }

    const selectedDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();

    if (age < 13) {
        return { valid: false, error: "You must be at least 13 years old" };
    }
    if (age > 120) {
        return { valid: false, error: "Please enter a valid date of birth" };
    }

    return { valid: true };
};

/**
 * Validate email
 */
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
    if (!email.trim()) {
        return { valid: false, error: "Email is required" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: "Please enter a valid email address" };
    }
    return { valid: true };
};

/**
 * Validate password strength
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
 * Validate complete signup form with all fields
 */
export const validateCompleteSignup = (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    gender: string,
    dob: string
) => {
    const errors: { [key: string]: string } = {};

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
        errors.name = nameValidation.error!;
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        errors.email = emailValidation.error!;
    }

    // Validate password
    if (!password) {
        errors.password = "Password is required";
    } else {
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            errors.password = passwordValidation.errors.join(". ");
        }
    }

    // Validate confirm password
    if (password && password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    // Validate gender
    const genderValidation = validateGender(gender);
    if (!genderValidation.valid) {
        errors.gender = genderValidation.error!;
    }

    // Validate DOB
    const dobValidation = validateDOB(dob);
    if (!dobValidation.valid) {
        errors.dob = dobValidation.error!;
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};
