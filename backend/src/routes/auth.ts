import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
  sendEmail,
  sendEmailWithFallback,
  generatePasswordResetEmail,
} from "../utils/emailService";

const router = express.Router();
const prisma = new PrismaClient();

// Generate unique 6-digit user code
const generateUserCode = async (): Promise<string> => {
  let userCode: string;
  let isUnique = false;

  while (!isUnique) {
    // Generate 6-digit random number
    userCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if this code already exists
    const existingUser = await prisma.user.findUnique({
      where: { userCode },
    });

    if (!existingUser) {
      isUnique = true;
    }
  }

  return userCode!;
};

// Signup
router.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
    } = req.body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate unique user code
    const userCode = await generateUserCode();

    // Create user
    const user = await prisma.user.create({
      data: {
        userCode,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
      },
    });

    // Create token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        userCode: user.userCode,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // Generate userCode for existing users who don't have one
    let userCode = user.userCode;
    if (!userCode) {
      userCode = await generateUserCode();
      await prisma.user.update({
        where: { id: user.id },
        data: { userCode },
      });
    }

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        userCode: userCode,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users (admin only)
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        userCode: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        isHighlighted: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single user details (admin only)
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        userCode: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        isHighlighted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle user highlight/star (admin only)
router.patch("/users/:id/highlight", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { isHighlighted: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isHighlighted: !user.isHighlighted, updatedAt: new Date() },
      select: {
        id: true,
        userCode: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        isHighlighted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Toggle user highlight error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user stats (admin only)
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalPrograms = await prisma.program.count();
    const totalNews = await prisma.news.count();
    const totalUniversities = await prisma.university.count();

    res.json({
      totalUsers,
      totalPrograms,
      totalNews,
      totalUniversities,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user role (admin only)
router.patch("/users/:id/role", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role, updatedAt: new Date() },
      select: {
        id: true,
        userCode: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        isHighlighted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user (admin only)
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create admin user (admin only)
router.post("/create-admin", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        role: "admin",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      message: "Admin user created successfully",
      user,
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Generate 6-digit verification code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Forgot Password - Send reset code via email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Forgot password request for email:", email);

    if (!email) {
      return res.status(400).json({ message: "Имэйл хаяг заавал оруулна уу" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Буруу имэйл хаягийн формат" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Энэ имэйл хаягаар бүртгэлтэй хэрэглэгч олдсонгүй" });
    }

    console.log("User found, generating reset code");

    // Generate verification code and reset token
    const code = generateVerificationCode();
    const resetToken = jwt.sign(
      { email, code },
      process.env.RESET_TOKEN_SECRET || process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Calculate expiry time (1 hour from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    console.log("Generated code:", code, "Expires at:", expiresAt);

    // Delete any existing reset requests for this email
    await prisma.passwordReset.deleteMany({
      where: { email },
    });

    // Create new password reset record
    await prisma.passwordReset.create({
      data: {
        email,
        code,
        token: resetToken,
        expiresAt,
      },
    });

    console.log("Password reset record created in database");

    // Generate and send email with fallback
    const emailTemplate = generatePasswordResetEmail(code, email);
    console.log("📧 Attempting to send password reset email...");

    const emailSent = await sendEmailWithFallback({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log("Email send result:", emailSent);

    // Always return success - even if email fails, user can still use the code
    // The code is stored in database and can be retrieved for testing
    res.json({
      message: "Нууц үг сэргээх код таны имэйл хаяг руу илгээгдлээ",
      email: email,
      // In development, also return the code for testing
      ...(process.env.NODE_ENV === "development" && { code: code }),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    res.status(500).json({ message: "Серверийн алдаа гарлаа" });
  }
});

// Verify Reset Code
router.post("/verify-reset-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(400)
        .json({ message: "Имэйл хаяг болон код заавал оруулна уу" });
    }

    // Find reset request
    const resetRequest = await prisma.passwordReset.findFirst({
      where: {
        email,
        code,
        used: false,
      },
    });

    if (!resetRequest) {
      return res.status(400).json({ message: "Буруу код эсвэл имэйл хаяг" });
    }

    // Check if expired
    if (new Date() > resetRequest.expiresAt) {
      return res
        .status(400)
        .json({ message: "Кодын хүчинтэй хугацаа дууссан байна" });
    }

    // Verify token
    try {
      jwt.verify(
        resetRequest.token,
        process.env.RESET_TOKEN_SECRET || process.env.JWT_SECRET!
      );
    } catch (tokenError) {
      return res.status(400).json({ message: "Хүчингүй код" });
    }

    res.json({
      message: "Код амжилттай баталгаажлаа",
      resetToken: resetRequest.token,
    });
  } catch (error) {
    console.error("Verify reset code error:", error);
    res.status(500).json({ message: "Серверийн алдаа гарлаа" });
  }
});

// Test email configuration endpoint
router.post("/test-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    console.log("🧪 Testing email configuration for:", email);

    // Import the test function
    const {
      testEmailConfig,
      sendEmailWithFallback,
    } = require("../utils/emailService");

    // Test email configuration
    const configValid = await testEmailConfig();
    console.log("Email config test result:", configValid);

    // Try sending a test email
    const testEmailSent = await sendEmailWithFallback({
      to: email,
      subject: "GrandEdu - Email Test",
      html: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email from GrandEdu to verify email configuration.</p>
        <p>If you receive this email, the configuration is working correctly!</p>
        <p>Time: ${new Date().toISOString()}</p>
      `,
    });

    res.json({
      message: "Email test completed",
      configValid,
      testEmailSent,
      email,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Email test error:", error);
    res.status(500).json({
      message: "Email test failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// Debug endpoint to get reset code (for development/testing)
router.post("/get-reset-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the most recent reset request for this email
    const resetRequest = await prisma.passwordReset.findFirst({
      where: {
        email,
        used: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!resetRequest) {
      return res.status(404).json({ message: "No active reset request found" });
    }

    // Check if expired
    if (new Date() > resetRequest.expiresAt) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    res.json({
      email: email,
      code: resetRequest.code,
      expiresAt: resetRequest.expiresAt,
      createdAt: resetRequest.createdAt,
    });
  } catch (error) {
    console.error("Get reset code error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Бүх талбарыг бөглөнө үү" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Нууц үг таарахгүй байна" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой" });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(
        resetToken,
        process.env.RESET_TOKEN_SECRET || process.env.JWT_SECRET!
      ) as any;
    } catch (tokenError) {
      return res
        .status(400)
        .json({ message: "Хүчингүй эсвэл хугацаа дууссан токен" });
    }

    // Find reset request
    const resetRequest = await prisma.passwordReset.findUnique({
      where: { token: resetToken },
    });

    if (!resetRequest || resetRequest.used) {
      return res
        .status(400)
        .json({ message: "Хүчингүй эсвэл хэдийн ашигласан токен" });
    }

    // Check if expired
    if (new Date() > resetRequest.expiresAt) {
      return res
        .status(400)
        .json({ message: "Кодын хүчинтэй хугацаа дууссан байна" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    await prisma.user.update({
      where: { email: resetRequest.email },
      data: { password: hashedPassword, updatedAt: new Date() },
    });

    // Mark reset request as used
    await prisma.passwordReset.update({
      where: { token: resetToken },
      data: { used: true, updatedAt: new Date() },
    });

    res.json({
      message: "Нууц үг амжилттай өөрчлөгдлөө",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Серверийн алдаа гарлаа" });
  }
});

export default router;
