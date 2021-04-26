const puppeteer = require("puppeteer");
const { v4: uuidv4 } = require("uuid");

module.exports = async (html) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	const path = `./public/invoice/${uuidv4()}-invoice.pdf`;

	await page.setContent(html);
	const pdf = await page.pdf({
		path: path,
		format: "A4",
	});

	await browser.close();

	return { pdf, path };
};
