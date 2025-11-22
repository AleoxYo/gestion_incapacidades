// src/lib/auth.ts
import type { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import type { JWT } from "next-auth/jwt";
import type { Rol as PrismaRol } from "@prisma/client";

// Define el tipo de rol que usaremos en el front (mapea al enum de Prisma)
type Rol = Extract<PrismaRol, "COLABORADOR" | "ANALISTA" | "ADMIN">;

// El usuario que devolvemos en authorize incluye el rol
type AppUser = {
  id: string;
  name: string | null;
  email: string | null;
  rol: Rol;
};

// Helpers de tipado para extender JWT y Session sin usar @ts-ignore
type AppJWT = JWT & { rol?: Rol };
type AppSessionUser = NonNullable<DefaultSession["user"]> & { rol?: Rol };

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Busca el usuario en BD
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;

        // Devuelve el usuario con rol tipado
        const appUser: AppUser = {
          id: String(user.id),
          name: user.nombre,
          email: user.email,
          rol: user.rol as Rol,
        };
        return appUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Copiamos el rol al token JWT la primera vez (en login)
      if (user) {
        const u = user as AppUser;
        const t: AppJWT = token as AppJWT;
        t.rol = u.rol;
        return t;
      }
      return token as AppJWT;
    },
    async session({ session, token }) {
      // Propagamos el rol desde el token a la sesión
      if (session.user) {
        const sUser = session.user as AppSessionUser;
        const t = token as AppJWT;
        sUser.rol = t.rol;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};
