export const getCommonProfileData = async (req, res, next) => {
    try {
      req.profileData = {
        userId: req.user._id,
        role: req.user.role,
        profileCompleted: req.user.profileCompleted
      };
      next();
    } catch (error) {
      next(error);
    }
  };