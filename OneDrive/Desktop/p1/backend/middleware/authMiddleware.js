const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "servicenow_jwt_secret_key_2024_development");
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (err) { return res.status(401).json({ message: "Not authorized" }); }
    } else {
        return res.status(401).json({ message: "No token provided" });
    }
};

exports.admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Admin access required" });
    }
};
