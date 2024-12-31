// for checking if the user has the required role to access a route
export const verifyRole = (requiredRole) => {
  if (typeof requiredRole !== 'string' || !requiredRole.trim()) {
    throw new Error('Role must be a non-empty string');
  }

  return (req, res, next) => {
    const userRole = req.user?.roles;
    console.log(`User role: ${userRole}, Required role: ${requiredRole}`); // Add this line for debugging
    if (!userRole || userRole !== requiredRole) {
      return res.status(403).json({ message: 'Access Denied: Insufficient Role' });
    }

    next();
  };
};