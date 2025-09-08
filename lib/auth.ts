import * as jose from "jose";
import { cookies } from "next/headers";

// Chave secreta para assinar os tokens JWT (convertida para Uint8Array para jose)
const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || "sua-chave-super-secreta-e-unica-123",
);

// Função para gerar token JWT
export async function signJWT(payload: any) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);
}

// Função para verificar token JWT
export async function verifyJWT(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}

// Função para verificar se o usuário está autenticado
export async function isAuthenticated() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_OPTIONS.name)?.value;

  if (!token) {
    return false;
  }

  const payload = await verifyJWT(token);
  return !!payload;
}

// Função para obter o payload do token
export async function getAuthPayload() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_OPTIONS.name)?.value;

  if (!token) {
    return null;
  }

  return await verifyJWT(token);
}

// Configurações do cookie
export const COOKIE_OPTIONS = {
  name: "admin_token",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24, // 24 horas
  path: "/",
};

// Função para verificar autenticação usando Clerk ou sistema personalizado
export async function checkAuthentication() {
  // Primeiro, tenta verificar com Clerk
  try {
    const { auth } = await import("@clerk/nextjs/server");
    const authResult = await auth();
    if (authResult.userId) {
      return { type: 'clerk', userId: authResult.userId, authenticated: true };
    }
  } catch (error) {
    console.log('Clerk não disponível ou não autenticado');
  }

  // Se Clerk não estiver disponível, usa o sistema personalizado
  const isAuth = await isAuthenticated();
  if (isAuth) {
    const payload = await getAuthPayload();
    return { type: 'custom', payload, authenticated: true };
  }

  return { authenticated: false };
}

// Função para verificar se é admin usando qualquer sistema
export async function isAdmin() {
  const authResult = await checkAuthentication();
  
  if (!authResult.authenticated) {
    return false;
  }

  if (authResult.type === 'clerk') {
    // Para Clerk, você pode configurar roles/permissions aqui
    // Por enquanto, assumindo que qualquer usuário autenticado no Clerk é admin
    return true;
  }

  if (authResult.type === 'custom') {
    return authResult.payload?.type === 'admin';
  }

  return false;
}
