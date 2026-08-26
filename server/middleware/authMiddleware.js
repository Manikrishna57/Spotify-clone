const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        // Get Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        // Expected format:
        // Bearer TOKEN
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store user ID in request
        req.userId = decoded.userId;

        next();

    } catch (error) {

        console.error("Authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }
};

module.exports = authMiddleware;