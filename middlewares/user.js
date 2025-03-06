const User = require('../model/user')
const ResetToken = require('../model/resetToken')

const { isValidObjectId } = require("mongoose");
const { sendError } = require("../utils/helper");

exports.isResetTokenValid = async (req, res, next) => {
    const { token, id } = req.query;
    if (!token || !id) return sendError(res, 'Invalid request!');

    if (!isValidObjectId(id)) return sendError(res, 'Invalid user!');

    const user = await User.findById(id)
    if (!user) return sendError(res, "user not found!");

    const resetToken = await ResetToken.findOne({ owner: user._id })
    if (!resetToken) return sendError(res, "Reset token not found!");

    const isValid = await resetToken.compareToken(token)
    if (!isValid) return sendError(res, "Reset token not valid!");

    req.user = user
    next()
}