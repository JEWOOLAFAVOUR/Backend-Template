const multer = require('multer');

const storage = multer.diskStorage({})

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.includes('image')) {
        return cb("Invalid image format", false)
    }
    cb(null, true)

}

module.exports = multer({ storage, fileFilter })

