"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuperAdmin = void 0;
const isSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied. Superadmin role required.' });
    }
};
exports.isSuperAdmin = isSuperAdmin;
