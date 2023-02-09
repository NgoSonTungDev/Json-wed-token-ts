import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyTokenAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  console.log(authHeader);
  console.log(token);

  if (!token) {
    return res.status(401).send({
      statusCode: 401,
      message: "Không thể xác thực người dùng!",
    });
  }

  try {
    const decode = jwt.verify(token, String(process.env.ACCESS_TOKEN_SECRET));

    const { _id } = decode as any;
    req.userId = _id;

    next();
  } catch (error) {
    return res.status(403).send({
      statusCode: 403,
      message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!",
    });
  }
};

export const verifyAdminToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    console.log(token);

    if (!token) {
      return res.status(401).send({
        statusCode: 401,
        message: "Không thể xác thực người dùng!",
      });
    }

    const decode = jwt.verify(token, String(process.env.ACCESS_TOKEN_SECRET));
    const { _id, isAdmin } = decode as any;
    req.userId = _id;
    req.isAdmin = isAdmin;

    if (isAdmin === false) {
      return res.status(401).send({
        statusCode: 401,
        message: "Bạn không có quyền truy cập!",
      });
    } else {
      next();
    }
  } catch (error) {
    return res.status(403).send({
      statusCode: 403,
      message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!",
    });
  }
};
