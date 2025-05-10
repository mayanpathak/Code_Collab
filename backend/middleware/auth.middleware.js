import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import { getProjectById } from "../services/project.service.js";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

export const authUser = async (req, res, next) => {
  try {
    // First check Authorization header, then fallback to cookies
    // With this more comprehensive check:
    const getToken = (req) => {
      // Check Authorization header
      const authHeader = req.header("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.replace("Bearer ", "");
      }

      // Check cookies
      if (req.cookies && req.cookies.token) {
        return req.cookies.token;
      }

      // Check query parameter (sometimes useful for testing)
      if (req.query && req.query.token) {
        return req.query.token;
      }

      return null;
    };

    const token = getToken(req);

    // Log the token existence (not the actual token) for debugging
    console.log("Token found:", !!token);
    console.log("Auth header exists:", !!req.header("Authorization"));
    console.log("Cookies exist:", !!req.cookies);

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Not authorized, no token provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (tokenError) {
      if (tokenError.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "error",
          message: "Your session has expired. Please log in again.",
          code: "TOKEN_EXPIRED",
        });
      }

      if (tokenError.name === "JsonWebTokenError") {
        return res.status(401).json({
          status: "error",
          message: "Invalid token. Please log in again.",
          code: "INVALID_TOKEN",
        });
      }

      throw tokenError;
    }

    if (!decoded) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    }

    const user = await User.findOne({ email: decoded.email }).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
    }

    req.user = user;

    // Check if this is a project-related route and load project data
    const projectIdParam = req.params.projectId;
    if (projectIdParam) {
      try {
        // Load project data for validation
        const project = await Project.findById(projectIdParam);

        if (!project) {
          return res.status(404).json({
            status: "error",
            message: "Project not found",
          });
        }

        // Check if user has access to the project
        const hasAccess = project.users.some(
          (userId) => userId.toString() === user._id.toString()
        );

        if (!hasAccess) {
          return res.status(403).json({
            status: "error",
            message: "You do not have access to this project",
          });
        }

        // Attach project to request for use in controllers
        req.project = project;
      } catch (error) {
        console.error("Error validating project access:", error);
        return res.status(500).json({
          status: "error",
          message: "Error validating project access",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};
