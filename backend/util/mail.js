const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: "dfe6cc63fd2380",
		pass: "b7e520dba14a13",
	},
});

module.exports = async function (to, subject, text, html, attachments) {
	const mailOptions = {
		from: `FlawCS <noreply@flaw.uniba.sk>`,
		to,
		subject,
		text,
		html,
		attachments,
	};

	return await transport.sendMail(mailOptions);
};
