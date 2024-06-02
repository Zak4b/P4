import { v4 as uuidv4 } from "uuid";
import { createUser } from "./user.js";
export const cookieName = "token";
export const cookie = (req) => req.signedCookies[cookieName];
export const isLogged = (req, res) => {
    const data = cookie(req);
    console.log(data);
    return !!data;
};
export const loggin = async (username) => {
    return new Promise((resolve, reject) => {
        try {
            const uuid = uuidv4();
            const userId = createUser(username, uuid);
            resolve({ cookieContent: { userId, username, uuid } });
        }
        catch (error) {
            console.error(error);
            reject(error);
        }
    });
};
