module.exports.validateRegister = (fields) => {
	const errors = {};
	if (fields.titleBefore.trim().length > 20) {
		errors.titleBefore = "Maximum length for title is 20 characters.";
	}
	if (fields.titleAfter.trim().length > 20) {
		errors.titleAfter = "Maximum length for title is 20 characters.";
	}
	if (fields.firstName.trim() === "") {
		errors.firstName = "Please submit your first name.";
	}
	if (fields.lastName.trim() === "") {
		errors.lastName = "Please submit your last name.";
	}
	if (fields.organisation.trim() === "") {
		errors.organisation = "Please submit name of your organisation.";
	}
	if (fields.telephone.trim() === "") {
		errors.telephone = "Please submit your telephone number.";
	}
	if (fields.email.trim() === "") {
		errors.email = "Please submit your email address.";
	} else {
		const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!fields.email.trim().match(regEx)) {
			errors.email = "Please submit a valid email address.";
		}
	}
	if (fields.password.trim() === "") {
		errors.password = "Please submit your password.";
	}
	if (fields.confirmPassword.trim() !== fields.password.trim()) {
		errors.confirmPassword = "Submitted passwords do not match.";
	}
	if (fields.name.trim() === "") {
		errors.name = "Please submit your billing name";
	}

	return { errors, valid: Object.keys(errors).length === 0 };
};

module.exports.validateLogin = (email, password) => {
	const errors = {};
	if (email.trim() === "") {
		errors.email = "Please submit your email.";
	}
	if (password.trim() === "") {
		errors.password = "Please submit your password.";
	}

	return { errors, valid: Object.keys(errors).length === 0 };
};
