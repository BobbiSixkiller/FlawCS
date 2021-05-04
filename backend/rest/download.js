const router = require("express").Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Invoice = require("../models/Invoice");
const generatePdf = require("../util/pdf");
const invoiceHtml = require("../util/invoice");

function verifyAuth(req, res, next) {
	const authHeader = req.header("authorization");
	if (authHeader) {
		const token = authHeader.split("Bearer ")[1];
		if (token) {
			try {
				const user = jwt.verify(token, process.env.SECRET);
				req.token = token;
				req.user = user;
				next();
			} catch (err) {
				res.status(401).send({ error: err.message });
			}
		} else {
			res.status(400).send({
				error: "Authentication token must be: 'Bearer [token]'",
			});
		}
	} else {
		res.status(401).send({ error: "Unauthenticated, please log in!" });
	}
}

router.get("/invoice/:invoiceId", verifyAuth, async (req, res) => {
	const invoice = await Invoice.findOne({ _id: req.params.invoiceId });
	if (!invoice) {
		res.status(400).send({ error: "Invoice not found." });
	}
	if (invoice.userId != req.user.id) {
		res.status(401).send({ error: "Unauthorized access!" });
	}

	const { path } = await generatePdf(invoiceHtml(invoice));

	res.download(path, "invoice.pdf", function () {
		fs.unlink(path, function (err) {
			if (err) {
				console.log(err);
			}
		});
	});
});

module.exports = router;
