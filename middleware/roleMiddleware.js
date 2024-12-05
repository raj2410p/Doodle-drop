export const verifyRole = (role) => {
  if (typeof role !== 'string' || !role.trim()) {
    throw new Error('Role must be a non-empty string');
  }

  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole || userRole !== role) {
      return res.status(403).json({ message: 'Access Denied: Insufficient Role' });
    }

    next();
  };
};