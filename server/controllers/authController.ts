import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Semua bidang (nama, email, password) wajib diisi' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password minimal harus 6 karakter' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ message: 'Email sudah terdaftar, silakan gunakan email lain' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT
    const secret = process.env.JWT_SECRET || 'supersecretkey';
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      secret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    console.error('Error in registration:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat registrasi', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email dan password wajib diisi' });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ message: 'Email atau password salah' });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Email atau password salah' });
      return;
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET || 'supersecretkey';
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      secret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat login', error: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as any; // Cast to access user property from middleware
    if (!authReq.user) {
      res.status(401).json({ message: 'Tidak diizinkan' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: authReq.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User tidak ditemukan' });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
};
