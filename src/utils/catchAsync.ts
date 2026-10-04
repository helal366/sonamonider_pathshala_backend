import type {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

export const catchAsync = <P extends Request["params"] = Request["params"]>(
  fn: RequestHandler<P>,
): (req: Request, res: Response, next: NextFunction) => void => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as Request<P>, res, next)).catch(next);
  };
};