// Create and send token and save in the cookie.
const sendToken = (user, statusCode, res) => {
  // Create Jwt token
  let token = user.getJwtToken();
  token = `Bearer ${token}`;
  // Options for cookie

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRATION_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // This will make it inaccessible using Js code in frontend
  };

  // Return the token and the userInfo stored in the token/cookie.
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token, user });
};

module.exports = sendToken;
