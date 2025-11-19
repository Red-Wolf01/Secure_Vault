export function generatePassword(length = 16): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

export function calculatePasswordStrength(password: string): number {
  let strength = 0
  if (password.length >= 8) strength += 25
  if (password.length >= 12) strength += 25
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
  if (/\d/.test(password)) strength += 12.5
  if (/[!@#$%^&*]/.test(password)) strength += 12.5
  return Math.min(strength, 100)
}

export function getPasswordStrengthLabel(strength: number): "Weak" | "Fair" | "Good" | "Strong" {
  if (strength < 40) return "Weak"
  if (strength < 70) return "Fair"
  if (strength < 90) return "Good"
  return "Strong"
}

export function getPasswordStrengthColor(strength: number): string {
  if (strength < 40) return "bg-destructive"
  if (strength < 70) return "bg-yellow-500"
  if (strength < 90) return "bg-accent"
  return "bg-green-500"
}
