module.exports.validateRegisterInput = (
	firstName,
	lastName,
	titleBefore,
	titleAfter,
	email,
	telephone,
	password,
	confirmPassword,
	organisation
) => {
	const errors = {};
	if (titleBefore.trim().length > 20) {
		errors.titleBefore = "Maximum length for title is 20 characters.";
	}
	if (titleAfter.trim().length > 20) {
		errors.titleAfter = "Maximum length for title is 20 characters.";
	}
	if (firstName.trim() === "") {
		errors.firstName = "Please submit your first name.";
	}
	if (lastName.trim() === "") {
		errors.lastName = "Please submit your last name.";
	}
	if (organisation.trim() === "") {
		errors.organisation = "Please submit name of your organisation.";
	}
	if (telephone.trim() === "") {
		errors.telephone = "Please submit your telephone number.";
	}
	if (email.trim() === "") {
		errors.email = "Please submit your email address.";
	} else {
		const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!email.trim().match(regEx)) {
			errors.email = "Please submit a valid email address.";
		}
	}
	if (password.trim() === "") {
		errors.password = "Please submit your password.";
	}
	if (confirmPassword.trim() !== password.trim()) {
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
