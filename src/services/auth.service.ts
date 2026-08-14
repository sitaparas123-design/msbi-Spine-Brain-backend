import prisma from '../plugins/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginInput } from '../validators/auth.schema';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export class AuthService {
  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.roleName },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.roleName,
        departmentId: user.departmentId
      }
    };
  }

  async getCurrentUser(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roleName: true,
        isActive: true,
        department: true,
      }
    });
  }
}

export const authService = new AuthService();
