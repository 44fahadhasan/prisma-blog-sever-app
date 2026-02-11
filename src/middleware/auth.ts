import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export type TUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: TUser;
    }
  }
}

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await betterAuth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!session.user.emailVerified) {
      return res
        .status(401)
        .json({ success: false, message: "Email not verified" });
    }

    if (roles.length && !roles.includes(session.user.role!)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role!,
    };

    next();
  };
};

export default auth;
