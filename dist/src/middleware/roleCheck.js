"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleCheck = void 0;
const roleCheck = (roles) => {
    return (req, res, next) => {
        //console.log("roleCheck : ", req.user);
        // console.log("role : ", req.user.role);
        // console.log("roles : ", roles);
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const isAuth = roles.some((role) => {
            const hasRole = req.user.role?.map(String).includes(String(role));
            console.log("checking:", role, "=>", hasRole);
            return hasRole;
        });
        if (!isAuth) {
            return res.status(403).json({
                message: `Require ${roles} role`,
            });
        }
        next();
    };
};
exports.roleCheck = roleCheck;
