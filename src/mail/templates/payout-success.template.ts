export const payoutSuccessTemplate = (data: {
    userName: string;
    amount: string;
    currency: string;
    payoutMethod: string;
    beneficiaryName: string;
    reference: string;
    dateTime: string;
    dashboardLink: string;
}) => `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <link rel="preload" as="image" href="https://res.cloudinary.com/dyw35frw3/image/upload/v1755147409/NC_Green_Trans_BG_gdbg3v.png">
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
    <meta name="x-apple-disable-message-reformatting">
</head>
<body style="background-color: #f6f9fc">
    <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
      <tbody>
        <tr>
          <td style="
              background-color: #f6f9fc;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;
            ">
            <div style="display: none; overflow: hidden; line-height: 1px; opacity: 0; max-height: 0; max-width: 0;">
              Your payout of ${data.amount} ${data.currency} was successful.
            </div>
            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="
                max-width: 37.5em;
                background-color: #ffffff;
                margin: 0 auto;
                padding: 20px 0 48px;
                margin-bottom: 64px;
              ">
              <tbody>
                <tr style="width: 100%">
                  <td>
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding: 0 48px">
                      <tbody>
                        <tr>
                          <td>
                            <img alt="Novacrust" height="21" src="https://res.cloudinary.com/dyw35frw3/image/upload/v1755147409/NC_Green_Trans_BG_gdbg3v.png" style="
                                display: block;
                                outline: none;
                                border: none;
                                text-decoration: none;
                              ">
                            <hr style="
                                width: 100%;
                                border: none;
                                border-top: 1px solid #eaeaea;
                                border-color: #e6ebf1;
                                margin: 20px 0;
                              ">
                            <p style="
                                font-size: 16px;
                                line-height: 24px;
                                color: #525f7f;
                                text-align: left;
                                margin-top: 16px;
                                margin-bottom: 16px;
                              ">
                              Hi ${data.userName || 'Customer'},
                            </p>
                            <p style="
                                font-size: 16px;
                                line-height: 24px;
                                color: #525f7f;
                                text-align: left;
                                margin-top: 16px;
                                margin-bottom: 16px;
                              ">
                              Your payout request has been completed successfully. 🎉
                            </p>
                            <p style="
                                font-size: 16px;
                                line-height: 24px;
                                color: #525f7f;
                                font-weight: bold;
                                text-align: left;
                                margin-top: 16px;
                                margin-bottom: 8px;
                              ">
                              Transaction Details:
                            </p>
                            <ul style="list-style-type: none; padding: 0; margin: 0;">
                                <li style="font-size: 16px; line-height: 24px; color: #525f7f; text-align: left; margin-bottom: 8px;">
                                    <strong>Amount Paid Out:</strong> ${data.amount || '0.00'} ${data.currency || ''}
                                </li>
                                <li style="font-size: 16px; line-height: 24px; color: #525f7f; text-align: left; margin-bottom: 8px;">
                                    <strong>Payout Method:</strong> ${data.payoutMethod || 'Bank Transfer'}
                                </li>
                                <li style="font-size: 16px; line-height: 24px; color: #525f7f; text-align: left; margin-bottom: 8px;">
                                    <strong>Beneficiary Name:</strong> ${data.beneficiaryName || 'N/A'}
                                </li>
                                <li style="font-size: 16px; line-height: 24px; color: #525f7f; text-align: left; margin-bottom: 8px;">
                                    <strong>Transaction Reference:</strong> ${data.reference || 'N/A'}
                                </li>
                                <li style="font-size: 16px; line-height: 24px; color: #525f7f; text-align: left;">
                                    <strong>Date/Time:</strong> ${data.dateTime || new Date().toISOString()}
                                </li>
                            </ul>
                            <a href="${data.dashboardLink || '#'}" style="
                                line-height: 100%;
                                text-decoration: none;
                                display: block;
                                max-width: 100%;
                                background-color: #0e0d0d;
                                border-radius: 5px;
                                color: #fff;
                                font-size: 16px;
                                font-weight: bold;
                                text-align: center;
                                padding: 10px;
                                margin-top: 24px;
                                margin-bottom: 16px;
                              " target="_blank">
                              <span>👉 View transaction details and your updated wallet balance.</span>
                            </a>
                            <p style="
                                font-size: 16px;
                                line-height: 24px;
                                color: #525f7f;
                                text-align: left;
                                margin-top: 16px;
                                margin-bottom: 16px;
                              ">
                              Thank you for using Novacrust to power your global payments.
                            </p>
                            <p style="
                                font-size: 16px;
                                line-height: 24px;
                                color: #525f7f;
                                text-align: left;
                                margin-top: 16px;
                                margin-bottom: 16px;
                              ">
                              Cheers,
                            </p>
                            <p style="
                                font-size: 16px;
                                line-height: 24px;
                                color: #525f7f;
                                text-align: left;
                                margin-top: 16px;
                                margin-bottom: 16px;
                              ">
                              The Novacrust Team
                            </p>
                            <hr style="
                                width: 100%;
                                border: none;
                                border-top: 1px solid #eaeaea;
                                border-color: #e6ebf1;
                                margin: 20px 0;
                              ">
                            <p style="
                                font-size: 12px;
                                line-height: 16px;
                                color: #8898aa;
                                margin-top: 16px;
                                margin-bottom: 16px;
                              ">
                              Novacrust, 354 Oyster Point Blvd, South San Francisco, CA 94080
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
</body>
</html>
`;
