// backend/src/services/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface LoginData {
  email: string;
  password: string;
}

interface TokenPayload {
  userId: number;
  email: string;
  rol: string;
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'secret';
  private static readonly JWT_EXPIRES_IN = '24h';
  private static readonly SALT_ROUNDS = 10;

  /**
   * Iniciar sesión
   */
  static async login(data: LoginData) {
    const { email, password } = data;

    // Buscar usuario por email
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      throw new Error('Usuario desactivado');
    }

    // Verificar contraseña
    if (!usuario.password) {
    throw new Error('Password del usuario no encontrado');
}
const passwordValida = await bcrypt.compare(password, usuario.password);

    // Generar token
    const token = this.generateToken({
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    });

    // Retornar usuario sin contraseña
    const { password: _, ...usuarioSinPassword } = usuario;

    return {
      usuario: usuarioSinPassword,
      token
    };
  }

  /**
   * Registrar nuevo usuario (solo admin)
   */
  static async register(data: any) {
    const { email, password, nombre, apellido, rol } = data;

    // Verificar si el email ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      throw new Error('El email ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Crear usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        apellido,
        rol: rol || 'agente'
      }
    });

    // Retornar usuario sin contraseña
    const { password: _, ...usuarioSinPassword } = nuevoUsuario;

    return usuarioSinPassword;
  }

  /**
   * Cambiar contraseña
   */
  static async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ) {
    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId }
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    if (!usuario.password) {
    throw new Error('Password del usuario no encontrado');
}
const passwordValida = await bcrypt.compare(oldPassword, usuario.password);

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }

  /**
   * Resetear contraseña (para admin)
   */
  static async resetPassword(userId: number, newPassword: string) {
    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId }
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { message: 'Contraseña reseteada exitosamente' };
  }

  /**
   * Verificar token
   */
  static async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  /**
   * Generar token JWT
   */
  private static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    });
  }

  /**
   * Hashear contraseña (utilidad)
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }
}