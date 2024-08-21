import { ApiError } from "./apiError.js";
import envs from "./getEnvironmentVar.js";
export const assignJwtToken = (user, res, message) => {
    let tokenName = `userToken`;
    const cookieExpiry = envs.COOKIE_EXPIRY;
    if (!cookieExpiry) {
        throw new ApiError(400, "environment variable not setted");
    }
    let token = user.generateToken();
    res
        .status(200)
        .cookie(tokenName, token, {
        expires: new Date(Date.now() + parseInt(cookieExpiry) * 1000 * 86400),
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
        .json({
        success: true,
        message,
    });
};
