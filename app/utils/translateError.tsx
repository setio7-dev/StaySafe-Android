export function translateError(message?: string): string {
  if (!message) {
    return "Terjadi kesalahan. Silakan coba lagi.";
  }

  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return "Email atau kata sandi salah";
  }

  if (lower.includes("email not confirmed")) {
    return "Email belum dikonfirmasi. Silakan cek email Anda.";
  }

  if (lower.includes("user already registered") || lower.includes("already exists")) {
    return "Email sudah terdaftar";
  }

  if (lower.includes("password should be at least")) {
    return "Kata sandi terlalu pendek";
  }

  if (lower.includes("rate limit")) {
    return "Terlalu banyak percobaan. Silakan coba lagi nanti.";
  }

  if (lower.includes("network") || lower.includes("fetch")) {
    return "Koneksi bermasalah. Periksa internet Anda.";
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
}
