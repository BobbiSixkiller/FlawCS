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
	} else if (fields.firstName.trim() > 50) {
		errors.firstName = "Maximum length for first name is 50 characters.";
	}
	if (fields.lastName.trim() === "") {
		errors.lastName = "Please submit your last name.";
	} else if (fields.lastName.trim() > 50) {
		errors.lastName = "Maximum length for last name is 50 characters.";
	}
	if (fields.organisation.trim() === "") {
		errors.organisation = "Please submit name of your organisation.";
	} else if (fields.organisation.trim() > 100) {
		errors.organisation = "Maximum length for first name is 100 characters.";
	}
	if (fields.telephone.trim() === "") {
		errors.telephone = "Please submit your telephone number.";
	} else if (fields.telephone.replace(/\s+/g, "").length > 13) {
		errors.telephone = "Maximum length for telephone number is 13 characters.";
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
	if (fields.street.trim() === "") {
		errors.street = "Please submit your address";
	}
	if (fields.city.trim() === "") {
		errors.city = "Please submit your city";
	}
	if (fields.postal.trim() === "") {
		errors.postal = "Please submit your postal code";
	}
	if (fields.country.trim() === "") {
		errors.country = "Please submit your country";
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

module.exports.validateHost = (fields) => {
	const errors = {};
	if (fields.name === "") {
		errors.name = "Please submit name of the hosting organisation.";
	}
	if (fields.ICO === "") {
		errors.ICO = "Please submit ICO.";
	}
	if (fields.ICDPH === "") {
		errors.ICDPH = "Please submit ICDPH.";
	}
	if (fields.DIC === "") {
		errors.DIC = "Please submit DIC.";
	}
	if (fields.SWIFT === "") {
		errors.SWIFT = "Please submit SWIFT.";
	}
	if (fields.IBAN === "") {
		errors.IBAN = "Please submit IBAN.";
	}
	if (fields.stampUrl === "") {
		errors.stampUrl = "Please upload scan of your organisation's signature.";
	}
	if (fields.street === "") {
		errors.street = "Please submit name and number of street.";
	}
	if (fields.city === "") {
		errors.city = "Please submit name of the city.";
	}
	if (fields.postal === "") {
		errors.postal = "Please submit postal code.";
	}
	if (fields.country === "") {
		errors.country = "Please submit country.";
	}

	return { errors, valid: Object.keys(errors).length === 0 };
};
