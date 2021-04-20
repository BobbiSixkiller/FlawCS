const puppeteer = require("puppeteer");

module.exports.generatePDF = async (html) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.setContent(html);
	const pdf = await page.pdf({
		path: "./public/invoice/invoice.pdf",
		format: "A4",
	});

	await browser.close();

	return pdf;
};
