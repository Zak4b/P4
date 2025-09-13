import authM from "./actions/auth.js";
export const auth = (redirect) => {
    return (req, res, next) => {
        if (authM.isLogged(req, res)) {
            next();
        }
        else {
            res.redirect(redirect);
            return;
        }
    };
};
