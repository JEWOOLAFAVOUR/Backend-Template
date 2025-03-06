const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/swep-project")
    // mongoose.connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // })


    // good
    .then(() => console.log('db is connected'))
    .catch((err) => console.log('db connection failed: ', err.message || err));

// mailTransport().sendMail({
//   from: 'emailverification@email.com',
//   to: newUser.email,
//   subject: "Verify your email account",
//   html: generateEmailTemplate(OTP)
// });
