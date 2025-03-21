const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/backend-template")
    // mongoose.connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // })


    // good
    .then(() => console.log('db is connected'))
    .catch((err) => console.log('db connection failed: ', err.message || err));
