import jwt from "jsonwebtoken";
import { getEnvironmentVar } from "./getEnvironmentVar.js";
export const assignJwtToken = (user, res, message) => {
    let tokenName = `userToken`;
    let token = jwt.sign({ id: user._id, email: user.email }, getEnvironmentVar("JWT_SECRET_KEY"), { expiresIn: getEnvironmentVar("JWT_EXPIRY") });
    res
        .status(200)
        .cookie(tokenName, token, {
        expires: new Date(Date.now() + parseInt(getEnvironmentVar("COOKIE_EXPIRY")) * 1000 * 86400),
        httpOnly: true,
    })
        .json({
        success: true,
        message,
    });
};
