import { roleRights } from 'config/roles';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { IUser } from 'models';
import passport, { AuthorizeCallback } from 'passport';
import ApiError from 'utils/ApiError';

const verifyCallback =
  (
    req: Request,
    resolve: (value?: unknown) => void,
    reject: (error: ApiError) => void,
    requiredRights: string[]
  ): AuthorizeCallback =>
  async (err, user, info) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get((user as IUser).role);
      const hasRequiredRights = requiredRights.every((_requiredRight) => (userRights || []).includes(_requiredRight));
      if (!hasRequiredRights && req.params.userId !== (user as IUser).id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    resolve();
  };

export const auth =
  (...requiredRights: string[]): RequestHandler =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };
