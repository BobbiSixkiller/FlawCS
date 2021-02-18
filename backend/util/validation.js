module.exports.validateRegisterInput = (
	// firstName,
	// lastName,
	// titleBefore,
	// titleAfter,
	// email,
	// telephone,
	// password,
	// confirmPassword,
	// organisation
	{ ...registerInput }
) => {
	const errors = {};
	if (registerInput.titleBefore.trim().length > 20) {
		errors.titleBefore = "Maximum length for title is 20 characters.";
	}
	if (registerInput.titleAfter.trim().length > 20) {
		errors.titleAfter = "Maximum length for title is 20 characters.";
	}
	if (registerInput.firstName.trim() === "") {
		errors.firstName = "Please submit your first name.";
	}
	if (registerInput.lastName.trim() === "") {
		errors.lastName = "Please submit your last name.";
	}
	if (registerInput.organisation.trim() === "") {
		errors.organisation = "Please submit name of your organisation.";
	}
	if (registerInput.telephone.trim() === "") {
		errors.telephone = "Please submit your telephone number.";
	}
	if (registerInput.email.trim() === "") {
		errors.email = "Please submit your email address.";
	} else {
		const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!registerInput.email.trim().match(regEx)) {
			errors.email = "Please submit a valid email address.";
		}
	}
	if (registerInput.password.trim() === "") {
		errors.password = "Please submit your password.";
	}
	if (registerInput.confirmPassword.trim() !== registerInput.password.trim()) {
		errors.confirmPassword = "Submitted passwords do not match.";
	}

	return { errors, valid: Object.keys(errors).length === 0 };
};

module.exports.validateLoginInput = (email, password) => {
	const errors = {};
	if (email.trim() === "") {
		errors.email = "Please submit your email.";
	}
	if (password.trim() === "") {
		errors.password = "Please submit your password.";
	}

	return { errors, valid: Object.keys(errors).length === 0 };
};
