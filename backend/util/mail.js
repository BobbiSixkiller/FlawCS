const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: "dfe6cc63fd2380",
		pass: "b7e520dba14a13",
	},
});

module.exports = async function send(options) {
	const mailOptions = {
		from: `FlawCS <noreply@flaw.uniba.sk>`,
		to: options.to.email,
		subject: options.subject,
		text: options.text,
		html: options.html,
	};

	return await transport.sendMail(mailOptions);
};
