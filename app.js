const express = require('express');
const cors = require('cors')
require('express-async-errors')
require('dotenv').config();
require('./db');
const morgan = require('morgan')
const userRouter = require('./routers/auth-route/userRoute')

const app = express();

app.use(cors())

// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'))
// }


app.use(express.json())

app.use('/api/v1/user', userRouter)



app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message })
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
