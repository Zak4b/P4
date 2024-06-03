import { v4 as uuidv4 } from "uuid";
import user from "./user.js";
const cookieName = "token";
const cookie = (req) => req.signedCookies[cookieName];
const isLogged = (req, res) => {
    const data = cookie(req);
    console.log(data);
    return !!data;
};
const loggin = async (username) => {
    return new Promise((resolve, reject) => {
        try {
            const uuid = uuidv4();
            const userId = user.create(username, uuid);
            resolve({ cookieContent: { userId, username, uuid } });
        }
        catch (error) {
            console.error(error);
            reject(error);
        }
    });
};
export default { loggin, isLogged, cookie, cookieName };
