const CustomError = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  // only admin and the connected user can acces this
  if (requestUser?.role === "admin") return
  if (requestUser?.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError("Not authorized to access this route");
}

module.exports = checkPermissions;