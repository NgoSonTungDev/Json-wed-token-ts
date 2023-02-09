import Users from "../models/auth";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IAuth } from "../types/auth";

const generateToken = (payload: any) => {
  const { _id, isAdmin } = payload;

  const accessToken = jwt.sign(
    { _id, isAdmin },
    process.env.ACCESS_TOKEN_SECRET + "",
    {
      expiresIn: "30s",
    }
  );

  const refreshToken = jwt.sign(
    { _id, isAdmin },
    process.env.REFRESH_TOKEN_SECRET + "",
    {
      expiresIn: "1h",
    }
  );

  return { accessToken, refreshToken };
};

const authController = {
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    await Users.create(req.body)
      .then((response) => {
        res.status(200).json({ mg: "Tao thanh cong." });
      })
      .catch((err) => {
        res.status(500).json({ mg: "Loi he thong. ", err: err });
      });
  },

  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Users.find({});
      res.status(200).json({ mg: "Lay thanh cong.", data: data });
    } catch (err) {
      res.status(500).json({ mg: "Loi he thong. ", err: err });
    }
  },

  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Users.findById(req.userId);
      res.status(200).json({ mg: "Lay thanh cong.", data: data });
    } catch (err) {
      res.status(500).json({ mg: "Loi he thong. ", err: err });
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: IAuth | null = await Users.findOne({
        username: req.body.username,
      });

      if (!user) {
        res.status(404).json("User not found !");
      }

      if (user) {
        const tokens = await generateToken(user);

        await Users.findByIdAndUpdate(String(user._id), {
          refreshToken: tokens.refreshToken,
        });

        res.status(202).json({ user: user, token: tokens });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) return res.sendStatus(401);

      const decode = jwt.verify(
        refreshToken,
        String(process.env.REFRESH_TOKEN_SECRET)
      );
      const { _id } = decode as any;
      const user = Users.findById(_id);

      if (!user) {
        return res.status(403).send({
          statusCode: 403,
          message: "Lỗi xác thực tài khoản!",
        });
      }

      const tokens = await generateToken(user);

      await Users.findByIdAndUpdate(_id, {
        refreshToken: tokens.refreshToken,
      });

      res.status(202).json({ token: tokens });
    } catch (err) {
      res.status(500).json({ mg: "Loi he thong. ", err: err });
    }
  },

  decentralization: async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ mg: "Thanh cong." });
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Users.findByIdAndDelete(req.params.id);
      res.status(200).json({ mg: "Xoa thanh cong." });
    } catch (err) {
      res.status(500).json({ mg: "Loi he thong. ", err: err });
    }
  },
};

export default authController;
