import { isLogged } from "./actions/auth.js";
export const auth = (redirect) => {
    return (req, res, next) => {
        if (isLogged(req, res)) {
            next();
        }
        else {
            res.redirect(redirect);
            return;
        }
    };
};
