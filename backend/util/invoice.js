module.exports = (data) => `
    <!DOCTYPE html>
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
                    <h1>Fakturka - danovy doklad - 123456789</h1>
                </div>
                <div class="content">
                    <div class="issuer">
                        <h2>Issuer</h2>
                        <p>Name</p>
                        <p>Address</p>
                        <p>ICO: DIC: </p>
                        <p>IC DPH: </p>
                        <p>Issue Date: </p>
                        <p>Due Date: </p>
                        <p>VAT Date: </p>
                        <strong>Bank connection</strong>
                        <p>IBAN: </p>
                        <p>SWIFT: </p>
                        <p>Bank: </p>
                        <p>Form of payment: </p>
                    </div>
                    <div class="payer">
                        <h2>Payer</h2>
                        <p>Name</p>
                        <p>Address</p>
                        <p>ICO: DIC: </p>
                        <p>IC DPH: </p>
                    </div>
                </div>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                <p>COMMENT: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the</p>
                <table>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                    </tr>
                    <tr>
                        <td>Conference ticket price</td>
                        <td>260</td>
                    </tr>
                    <tr>
                        <td>VAT</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>SUM</td>
                        <td>1260</td>
                    </tr>
                </table>
                <div class="footer">
                    <strong>Vystavil:</strong>
                    <img src="https://via.placeholder.com/200x75">
                </div>
            </div>
        </body>
    </html>
`;
