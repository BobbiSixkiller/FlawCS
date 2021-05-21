var checkEmail =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//minimum eight characters, at least one letter and one number
var passwordStrength = /^((?=.*\d)(?=.*[a-zA-Z]).{8,})$/;

module.exports.validateRegister = (fields) => {
	const errors = {};
	if (fields.titleBefore && fields.titleBefore.trim().length > 20) {
		errors.titleBefore = "Maximum length for title is 20 characters.";
	}
	if (fields.titleAfter && fields.titleAfter.trim().length > 20) {
		errors.titleAfter = "Maximum length for title is 20 characters.";
	}
	if (fields.firstName.trim() === "") {
		errors.firstName = "Please submit your first name.";
	} else if (fields.firstName.trim().length > 50) {
		errors.firstName = "Maximum length for first name is 50 characters.";
	}
	if (fields.lastName.trim() === "") {
		errors.lastName = "Please submit your last name.";
	} else if (fields.lastName.trim().length > 50) {
		errors.lastName = "Maximum length for last name is 50 characters.";
	}
	if (fields.organisation.trim() === "") {
		errors.organisation = "Please submit name of your organisation.";
	} else if (fields.organisation.trim().length > 100) {
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
		if (!fields.email.trim().match(checkEmail)) {
			errors.email = "Please submit a valid email address.";
		}
	}
	if (fields.password.trim() === "") {
		errors.password = "Please submit your password.";
	} else if (!fields.password.trim().match(passwordStrength)) {
		errors.password =
			"Password must contain at least 8 characters, 1 letter and 1 number.";
	}
	if (fields.confirmPassword.trim() !== fields.password.trim()) {
		errors.confirmPassword = "Submitted passwords do not match.";
	}
	//billingInput validation
	if (fields.name.trim() === "") {
		errors.name = "Please submit your billing name.";
	} else if (fields.name.trim().length > 70) {
		errors.name = "Maximum length for billing name is 70 characters";
	}
	if (fields.address.street.trim() === "") {
		errors.street = "Please submit your address.";
	} else if (fields.address.street.trim().length > 70) {
		errors.street = "Maximum length for street name is 70 characters";
	}
	if (fields.address.city.trim() === "") {
		errors.city = "Please submit your city.";
	} else if (fields.address.city.trim().length > 70) {
		errors.city = "Maximum length for city name is 70 characters";
	}
	if (fields.address.postal.trim() === "") {
		errors.postal = "Please submit your postal code.";
	} else if (fields.address.postal.trim().length > 10) {
		errors.postal = "Maximum length for postal code is 10 characters";
	}
	if (fields.address.country.trim() === "") {
		errors.country = "Please submit your country.";
	} else if (fields.address.street.trim().length > 70) {
		errors.country = "Maximum length for country name is 70 characters";
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
	if (fields.name.trim() === "") {
		errors.name = "Please submit name of the hosting organisation.";
	}
	if (fields.billing.name.trim() === "") {
		errors.billingName = "Please billing name.";
	}
	if (fields.billing.ICO.trim() === "") {
		errors.ICO = "Please submit ICO.";
	}
	if (fields.billing.ICDPH.trim() === "") {
		errors.ICDPH = "Please submit ICDPH.";
	}
	if (fields.billing.DIC.trim() === "") {
		errors.DIC = "Please submit DIC.";
	}
	if (fields.billing.SWIFT.trim() === "") {
		errors.SWIFT = "Please submit SWIFT.";
	}
	if (fields.billing.IBAN.trim() === "") {
		errors.IBAN = "Please submit IBAN.";
	}
	if (fields.signatureUrl === "") {
		errors.signatureUrl =
			"Please upload scan of your organisation's signature.";
	}
	if (fields.logoUrl === "") {
		errors.logoUrl = "Please upload scan of your organisation's logo.";
	}
	if (fields.billing.address.street.trim() === "") {
		errors.street = "Please submit name and number of street.";
	}
	if (fields.billing.address.city.trim() === "") {
		errors.city = "Please submit name of the city.";
	}
	if (fields.billing.address.postal.trim() === "") {
		errors.postal = "Please submit postal code.";
	}
	if (fields.billing.address.country.trim() === "") {
		errors.country = "Please submit country.";
	}

	return { errors, valid: Object.keys(errors).length === 0 };
};

module.exports.validateConference = (fields) => {
	const errors = {};
	errors.conference = {};
	errors.venue = {};

	if (fields.conference.name.trim() === "") {
		errors.conference.name = "Please submit name of the conference.";
	}
	if (fields.conference.host.trim() === "") {
		errors.conference.host = "Please choose a host organisation.";
	}
	if (isNaN(Date.parse(fields.conference.start))) {
		errors.conference.start = "Please submit start date of the conference.";
	}
	if (isNaN(Date.parse(fields.conference.end))) {
		errors.conference.end = "Please submit end date of the conference.";
	}
	if (isNaN(Date.parse(fields.conference.regStart))) {
		errors.conference.regStart =
			"Please submit date when the registration starts.";
	}
	if (isNaN(Date.parse(fields.conference.regEnd))) {
		errors.conference.regEnd = "Please submit date when the registration ends.";
	}
	if (fields.conference.ticketPrice === 0) {
		errors.conference.regEnd = "Please submit price of the ticket.";
	}

	if (fields.venue.name.trim() === "") {
		errors.venue.name = "Please submit name of the venue.";
	}
	if (fields.venue.address.street.trim() === "") {
		errors.venue.street = "Please submit name of the city.";
	}
	if (fields.venue.address.city.trim() === "") {
		errors.venue.city = "Please submit name and number of the street.";
	}
	if (fields.venue.address.postal.trim() === "") {
		errors.venue.postal = "Please submit postal code of the venue.";
	}
	if (fields.venue.address.country.trim() === "") {
		errors.venue.country = "Please submit name of the country.";
	}

	return {
		errors,
		valid:
			Object.keys(errors.conference).length === 0 &&
			Object.keys(errors.venue).length === 0,
	};
};

module.exports.validateSection = (fields) => {
	const errors = {};

	if (fields.name.trim() === "") {
		errors.name = "Please submit name of the section.";
	}
	if (fields.topic.trim() === "") {
		errors.topic = "Please submit topic of the section";
	}
	if (fields.languages.length === 0 || fields.languages[0] === "") {
		errors.languages = "You must provide at least 1 language.";
	} else if (fields.languages.some((language) => language === "")) {
		errors.languages = "Empty keyword submitted.";
	} else if (
		fields.languages.some((language) => !language.match("^[A-Z]{2}$"))
	) {
		errors.languages = "Language has to consist of 2 upper case letters.";
	}

	return { errors, valid: Object.keys(errors).length === 0 };
};

module.exports.validateStaff = (name, id) => {
	const errors = {};

	if (name.trim() === "" || id.trim() === "") {
		errors.name = "Please submit name of the section's staff.";
	}

	return { errors, valid: Object.keys(errors).length === 0 };
};

module.exports.validateSubmission = (fields) => {
	const errors = {};

	if (fields.name.trim() === "") {
		errors.name = "Please submit name of your submission.";
	} else if (fields.name.trim().length > 150) {
		errors.name = "Maximum length for submission name is 150 characters.";
	}
	if (fields.abstract.trim() === "") {
		errors.abstract = "Please submit abstract of your submission.";
	} else if (fields.abstract.trim().length > 1500) {
		errors.abstract = "Maximum length for abstract is 1500 characters.";
	}
	if (fields.keywords.length === 0 || fields.keywords[0] === "") {
		errors.keywords = "You must provide at least 1 keyword.";
	} else if (fields.keywords.some((keyword) => keyword === "")) {
		errors.keywords = "Empty keyword submitted.";
	}
	if (fields.authors.length === 0) {
		errors.authors = "You must provide at least one author.";
	} else if (fields.authors.some((author) => author === "")) {
		errors.authors = "One of provided authors is an empty string.";
	}

	return { errors, valid: Object.keys(errors).length === 0 };
};
