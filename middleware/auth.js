import jwt from 'jsonwebtoken'

export const check = (req, res, next) => {
    const token = req.header("x-auth-token")

    if(!token) {
        return res.status(401).json({ message: "No token, Not authorized!" })
    }

    try {
        const check = jwt.verify(token, process.env.JWT_Secret)

        req.user = check

        next()
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" })
    }
}