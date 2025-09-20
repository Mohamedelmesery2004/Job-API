import JWT from 'jsonwebtoken';

import unauthenteation from "../errors/unauthenticated.js"

const authToken = async(req,res,next)=>{
    const header = req.headers.authorization;
    if(!header||!header.startsWith("Bearer "))
    {
        throw new unauthenteation ("authentication invalid token");
    }

    const token = header.split(" ")[1];
    try {
        const payload = JWT.verify(token,process.env.secert)
        req.user = {userID:payload.userID, username:payload.name};
        next();
    } catch (error) {
        throw new unauthenteation ("authentication invalid wrong");
    }
}
export default authToken;