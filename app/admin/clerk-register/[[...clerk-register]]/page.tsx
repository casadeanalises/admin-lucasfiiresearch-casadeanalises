import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin - Clerk Registro</h1>
          <p className="mt-2 text-gray-600">Crie uma conta Clerk para acessar o painel administrativo</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm',
              card: 'shadow-lg',
            }
          }}
        />
        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Ou faça login com o sistema tradicional
          </a>
        </div>
      </div>
    </div>
  )
}
