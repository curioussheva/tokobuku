import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
    // Termux: akses via http://192.168.1.6 (bukan HTTPS). medusa start set
    // NODE_ENV=production -> resolveSessionCookieSecurity kembali secure:true.
    // Browser menolak cookie Secure via HTTP -> login dashboard gagal.
    // cookieOptions di-spread terakhir dan menimpa flag default.
    cookieOptions: { secure: false, sameSite: false, httpOnly: true },
  }
})
