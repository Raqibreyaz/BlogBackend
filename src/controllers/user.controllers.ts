import { ApiError } from "../utils/apiError";
import { catchAsyncError } from "../utils/catchAsyncError";
import { assignJwtToken } from "../utils/assignJwtToken";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { userModel } from "../models/user.models";

interface providedDataType {
  username?: string;
  email?: string;
  password?: string;
}

const registerUser = catchAsyncError(async (req, res, next) => {
  let { username, email, password }:providedDataType = req.body;

  if (!username || !email || !password)
    throw new ApiError(400, "Provide all details to register user");

  if (password.length < 8)
    throw new ApiError(400, "password must be at least 8 characters");

  if (await userModel.findOne({ email }))
    throw new ApiError(400, "user with this email already exists");

  if (!req.file) throw new ApiError(400, "provide user image");

  const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

  if (cloudinaryResponse) {
    // create the user
    const user = await userModel.create({
      username,
      email,
      password,
      image: {
        url: cloudinaryResponse.url,
        public_id: cloudinaryResponse.public_id,
      },
    });

    assignJwtToken(user, res, "user registered successfully");
  }
});

const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password }:providedDataType = req.body;

  if (!email || !password) throw new ApiError(400, "fill full form");

  const user = await userModel.findOne({ email });

  if (!user) throw new ApiError(404, "user does not exist");

  let checkPassword = await user.comparePassword(password);

  if (!checkPassword) throw new ApiError(400, "invalid credentials");

  assignJwtToken(user, res, "user logged in successfully");
});

const fetchUser = catchAsyncError(async (req, res, next) => {
  if (!req.user) throw new ApiError(400, "user unavailable");

  const user = await userModel.findById(req.user.id).select("-password");

  if (!user) throw new ApiError(404, "user does not exist");

  res.status(200).json({
    success: true,
    message: "user fetched successfully",
    user,
  });
});

const logoutUser = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("userToken", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "user logged out successfully",
    });
});

export { registerUser, loginUser, fetchUser, logoutUser };
