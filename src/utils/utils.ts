import { compare, hash } from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Response } from "express";

dotenv.config();

export function hashPass(pass: string) {
  return new Promise((resolve, reject) => {
    hash(pass, 10, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

export function comparePass(pass: string, encrypt: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    compare(pass, encrypt, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

export function createToken(data: object, expire?: string) {
  const token = jwt.sign({...data}, process.env.SECRET_KEY!, {
    expiresIn: expire?? "3h",
  });
  return token;
}

export function verifyToken(token: string) {
  const payload = jwt.verify(token, process.env.SECRET_KEY!);
  return payload;
}

export async function sendEmailVerification(email: string) {
  const tokenUrl = createToken({ email });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP,
      pass: process.env.SMTP_PASS,
    },
  });
  const url = `https://nppz8t42-8000.asse.devtunnels.ms/api/v1/auth/verify/${tokenUrl}`;
  return await transporter.sendMail({
    from: "no-reply@gmail.com",
    to: email,
    subject: "Email verification",
    text: `Thanks for the register, please verify your email by clicking ${url}`,
  });
}

export function success(
  res: Response,
  msg: string,
  statusCode: number,
  data?: any,
  pagination?: object,
  token?: string
) {
  return res.status(statusCode).json({
    success: true,
    message: msg,
    statusCode: statusCode,
    data: data,
    credentials: token,
  });
}
