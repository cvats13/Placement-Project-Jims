const https = require('https');

/**
 * Send an email using Brevo (Sendinblue) API v3
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.toName - Recipient name
 * @param {string} options.subject - Email subject
 * @param {string} options.htmlContent - Email body in HTML
 */
exports.sendBrevoEmail = async ({ to, toName, subject, htmlContent, textContent }) => {
    const apiKey = process.env.BREVO_API_KEY;
    
    if (!apiKey) {
        throw new Error('BREVO_API_KEY is not configured in .env');
    }

    const data = JSON.stringify({
        sender: { 
            name: "JIMS Placement Portal", 
            email: "hardikdhawan9311@gmail.com" 
        },
        to: [{ 
            email: to, 
            name: toName || to 
        }],
        subject: subject,
        htmlContent: htmlContent,
        textContent: textContent || ''
    });

    const options = {
        hostname: 'api.brevo.com',
        port: 443,
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
            'api-key': apiKey,
            'content-type': 'application/json',
            'accept': 'application/json',
            'content-length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(responseData));
                } else {
                    reject(new Error(`Brevo API error: ${res.statusCode} - ${responseData}`));
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.write(data);
        req.end();
    });
};
