import { Request, Response, NextFunction } from "express"
import Account from "../models/account";
import jwt from "jsonwebtoken"

const verifyJWT = (token:string): any => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY!);
};

const isDecodedAccountInDatabase = async (account_name:string): Promise<boolean> => {

    const account = await Account.findOne({
        where: { account_name: account_name }
    })
    if (!account) return false
    return true
}

export default () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.header("Authorization");
            if (!token) return res.status(400).json({ message: "No Token" })
            if (!process.env.JWT_SECRET_KEY) return new Error(`JWT_SECRET_KEY in .env was not found`)
            const decoded = verifyJWT(token)
            const isdecodedAccountInDatabase = await isDecodedAccountInDatabase(decoded.account_name)
            if (!isdecodedAccountInDatabase) return res.status(400).json({ message: "Token is not valid" })
            res.locals.decoded = decoded
            next();
            return
        } catch (error) {
            return res.status(404).json({ message: `有地方出錯了...${error}` });
        }
    };
};