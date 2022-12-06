import { Router as expressRouter, Express } from "express";
import Account from "../models/account";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/verify_token";

export default (ctx: { [key: string]: any }, app: Express) => {
    const router = expressRouter();
    const database = ctx.sequelize; 

    // 登入
    router.post("/login", async (req, res) => {
        const accountEmail = req.body.email;
        const accountPassword = req.body.password;
        try {
            await database.sync()
            const account = await Account.findOne({
                where: {
                    email: accountEmail,
                }
            })
            if (account == null) {
                return res.status(404).json({ message: "Can't find member" })
            }
            if (account.password !== accountPassword) {
                return res.status(404).json({ message: "Password is wrong" })
            }
            if (!account.status) return res.status(403).json({ message: "尚未開啟帳號" })
            const info = { account_name: account.account_name };
            const token = jwt.sign(info, process.env.JWT_SECRET_KEY!, { expiresIn: 1000 * 60 * 15 });
            return res.status(200).json({ message: "登入成功", token: token });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(500).json({ message: err.message });
            }
            res.status(500).json({ message: "Some Error happend..." });
        }

    });

    //取得所有帳號
    router.get("/getall", verifyToken(), async (req, res) => {
        try {
            await database.sync()
            const account = await Account.findAll()
            return res.status(200).json(account)
        } catch (err) {
            if (err instanceof Error) {
                return res.status(500).json({ message: err.message });
            }
            res.status(500).json({ message: "Some Error happend..." });
        }
    })

    // 點擊新增會員
    router.post("/add", async (req, res) => {
        const accountName = req.body.account_name
        const email = req.body.email
        const password = req.body.password
        try {
            await database.sync()
            const account = await Account.findOne({
                where: {
                    email: email,
                }
            })
            if (account !== null) {
                return res.status(403).json({ message: "信箱已重複" });
            }
            await Account.create({
                account_name: accountName,
                status: true,
                password: password,
                email: email
            })
            return res.status(200).send("新增成功");
        } catch (err) {
            res.status(400).json({ message: "新增會員失敗，請重新再試一次", error: err })
        }
    });

    //刪除帳號
    router.delete("/delete/:id", verifyToken(), async (req, res) => {
        try {
            const account_id = req.params.id
            await database.sync()
            const account = await Account.findOne({
                where: {
                    account_id: account_id
                }
            })
            if (account == null) {
                return res.status(404).json({ message: "無此用戶" });
            }
            await account.destroy()
            return res.status(200).json({ message: "刪除成功" });
        } catch (err) {
            //資料庫操作錯誤將回傳500及錯誤訊息
            res.status(500).json({ message: "remove product failed" })
        }
    });

    //更新帳號
    router.patch("/update", verifyToken(), async (req, res) => {
        const accountId = req.body.account_id;
        const accountName = req.body.account_name;
        try {
            await database.sync()
            const account = await Account.findOne({
                where: {
                    account_id: accountId,
                }
            })
            if (!account) {
                return res.status(404).json({ message: "無此用戶" });
            }
            await account.update({
                account_name: accountName
            })
            return res.status(200).json({ message: "更改人員成功" });
        } catch (err) {
            res.status(400).json({ message: "更改失敗，請重新再試一次", error: err });
        }
    })

    app.use("/account", router);
}