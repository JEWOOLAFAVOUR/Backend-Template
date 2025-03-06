const nodemailer = require('nodemailer')
const elasticemail = require('elasticemail')


const senderInfo = {
    user: "user@brevo.com",
    password: "xxxxxxxxx",
    name: "Mauricio",
};

exports.sendEmail = async (recipient, subject, text) => {
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "jewoolafavour2020@gmail.com",
                pass: "gr1wCMZzHLkap43q",
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"${"StudyPadi"}" ${"jewoolafavour2020@gmail.com"}`,
            to: recipient,
            subject: subject,
            text: text,
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

// Example usage








exports.elaticeClient = elasticemail.createClient({
    apiKey: process.env.ELASTICE_EMAIL
});





exports.generateOTP = () => {
    let otp = "";
    for (let i = 0; i <= 3; i++) {
        const randVal = Math.round(Math.random() * 9)
        otp = otp + randVal
    }
    return otp;
}

exports.mailTransport = () => nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD
    }
});

exports.generateEmailTemplate = code => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <style>
        @media only screen and (max-width: 620px){
            h1{
                font-size: 20px;
                padding: 5px;
            }
        }
        </style>
    </head>
    <body>
        <div>
        <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727;">
        <h1 style="background: #f6f6f6; padding: 10px; text-align: center; color: #272727;">
        We are delighted to welcome you to our team!</h1>
        <p>Please Verify Your Email To Continue Your verification code is:</p>
        <p style="width: 80px; margin: 0 auto; font-weight: bold; text-align: center;
        background: #f6f6f6; border-radius: 5px; font-size: 25px;">${code}</p>
        </div>
        </div>
    </body>
</html>
    `;
};

exports.plainEmailTemplate = (heading, message) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <style>
        @media only screen and (max-width: 620px){
            h1{
                font-size: 20px;
                padding: 5px;
            }
        }
        </style>
    </head>
    <body>
        <div>
        <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727;">
        <h1 style="background: #f6f6f6; padding: 10px; text-align: center; color: #272727;">
        ${heading}</h1>
        <p style="color: #272727; text-align: center;">${message}</p>
        </div>
        </div>
    </body>
</html>
    `;
}

exports.generatePasswordResetTemplate = url => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <style>
        @media only screen and (max-width: 620px){
            h1{
                font-size: 20px;
                padding: 5px;
            }
        }
        </style>
    </head>
    <body>
        <div>
        <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727;">
            <h1 style="background: #f6f6f6; padding: 10px; text-align: center; color: #272727;">
            Response to your Password Request</h1>
            <p style="color: #272727;">Click Link Below to Reset Password</p>
        <div style="text-align: center;">
            <a href="${url}" style="padding: 20px; margin: 0 auto; font-family: sans-serif; background: #272727;
            border-radius: 5px; font-size: 20px 10px; color: #fff; cursor: pointer;
            text-decoration: none; display: inline-block;">Reset Password</a>
        </div>
        </div>
    </body>
</html>
    `;
}

exports.plainEmailTemplate = (heading, message) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <style>
        @media only screen and (max-width: 620px){
            h1{
                font-size: 20px;
                padding: 5px;
            }
        }
        </style>
    </head>
    <body>
        <div>
        <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727;">
        <h1 style="background: #f6f6f6; padding: 10px; text-align: center; color: #272727;">
        ${heading}</h1>
        <p style="color: #272727; text-align: center;">${message}</p>
        </div>
        </div>
    </body>
</html>
    `;
}


// https://smsexperience.com/api/sms/sendsms?username=xxx&password=xxx&sender=@@sender@@&recipient=@@recipient@@&message=@@message@@
exports.goodOne = () => {
    var username = "jewoolafavour2020@gmail.com";
    var password = "Favour-281102";
    var message = "Hello";
    var sender = "Campus Gist";
    var recipient = "08051296282";

    var url = "https://www.bulksmslive.com/tools/geturl/Sms.php?username=" + username + "&password=" + password + "&sender=" + sender + "&message=" + message + "&flash=0&sendtime=2009-10- 18%2006:30&listname=friends&recipients=" + recipient;

    var request = new XMLHttpRequest();

    request.open('GET', url);

    request.onload = function () {
        console.log(request.responseText);
    }

    request.send();

}


