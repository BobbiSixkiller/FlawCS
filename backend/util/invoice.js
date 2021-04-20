module.exports = (data) => {
	const { issuer, payer, invoice, invoice } = data;

	return `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Invoice</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
                    .container {
                        font-family: 'Roboto', sans-serif;	
                    }
                    .header img {
                        max-width: 150px;  
                    }
                    .footer img {
                        max-width: 250px;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    td, th {
                        border: 1px solid #dddddd;
                        text-align: left;
                        padding: 8px;
                    }
                    .container {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        max-width: 800px;
                        margin: auto;
                        padding: 15px;
                    }
                    .header {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                    }
                    .content {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                    }
                    .footer {
                        margin-top: 15px;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-around;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="http://localhost:5000/images/Praf-UK-logo.png">
                        <h1>Fakturka - danovy doklad - ${
													invoice.variableSymbol
												}</h1>
                    </div>
                    <div class="content">
                        <div class="issuer">
                            <h2>Issuer</h2>
                            <p>${issuer.billing.name}</p>
                            <p>${issuer.billing.address.street}</p>
                            <p>${issuer.billing.address.postal}, ${
		issuer.billing.address.city
	}</p>
                            <p>ICO: ${issuer.billing.ICO}, DIC: ${
		issuer.billing.DIC
	}</p>
                            <p>IC DPH: ${issuer.billing.ICDPH}</p>
                            <p>Issue Date: ${invoice.issueDate.toLocaleDateString()}</p>
                            <p>Due Date: ${invoice.dueDate.toLocaleDateString()}</p>
                            <p>VAT Date: ${invoice.vatDate.toLocaleDateString()}</p>
                            <strong>Bank connection</strong>
                            <p>IBAN: ${issuer.billing.IBAN}</p>
                            <p>SWIFT: ${issuer.billing.SWIFT}</p>
                            <p>Bank: </p>
                            <p>Form of payment: ${invoice.type}</p>
                        </div>
                        <div class="payer">
                            <h2>Payer</h2>
                            <p>${payer.name}</p>
                            <p>${payer.address.street}</p>
                            <p>${payer.address.postal}, ${
		payer.address.city
	}</p>
                            <p>${payer.address.country}</p>
                            ${
															payer.ICO &&
															`<p>ICO: ${payer.ICO}, DIC: ${payer.DIC}</p>`
														}
                            ${payer.ICDPH && `<p>IC DPH: ${payer.ICDPH}</p>`}
                            
                        </div>
                    </div>
                    <p>${invoice.body}</p>
                    <p>COMMENT: ${invoice.comment}</p>
                    <table>
                        <tr>
                            <th>Item</th>
                            <th>Price</th>
                        </tr>
                        <tr>
                            <td>Conference ticket price</td>
                            <td>${invoice.ticketPrice}</td>
                        </tr>
                        <tr>
                            <td>VAT</td>
                            <td>${invoice.vat}</td>
                        </tr>
                        <tr>
                            <td>SUM</td>
                            <td>${invoice.ticketPrice + invoice.vat}</td>
                        </tr>
                    </table>
                    <div class="footer">
                        <strong>Issued By:</strong>
                        <img src="https://via.placeholder.com/200x75">
                    </div>
                </div>
            </body>
        </html>`;
};
