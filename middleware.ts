import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT, COOKIE_OPTIONS } from "@/lib/auth";

// Lista de rotas que precisam de autenticação admin
const ADMIN_PROTECTED_ROUTES = [
  "/admin",
  "/api/admin",
];

// Lista de rotas admin que são públicas
const ADMIN_PUBLIC_ROUTES = ["/api/admin/login"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Se não for uma rota admin, permite o acesso
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Se for uma rota pública de admin, permite o acesso
  if (ADMIN_PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Verifica se tem token de autenticação
  const token = request.cookies.get(COOKIE_OPTIONS.name)?.value;

  if (!token) {
    // Se for a página inicial e não tiver token, permite o acesso (página de login)
    if (pathname === "/") {
      return NextResponse.next();
    }
    
    // Se não tiver token, redireciona para a página inicial (login)
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Verifica se o token é válido
    const decoded = await verifyJWT(token);
    if (!decoded || decoded.type !== "admin") {
      throw new Error("Token inválido");
    }

    // Se o token for válido, permite o acesso
    return NextResponse.next();
  } catch (error) {
    // Se o token for inválido, redireciona para a página inicial (login)
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Configuração do matcher para o middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
