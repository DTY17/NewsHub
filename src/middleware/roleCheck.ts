import { NextFunction, Request, Response } from "express";

export interface AUthRequest extends Request {
  user?: any;
}

export const roleCheck = (roles: Role[]) => {
  return (req: AUthRequest, res: Response, next: NextFunction) => {
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
