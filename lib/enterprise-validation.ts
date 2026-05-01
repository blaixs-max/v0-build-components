export const ENTERPRISE_NO_REGEX = /^TR[0-9]{2}[0-9]{1,10}$/

export function validateEnterpriseNo(value: string): {
  valid: boolean
  error?: string
} {
  if (!value) {
    return { valid: false, error: "İşletme numarası boş olamaz." }
  }

  const trimmed = value.trim().toUpperCase()

  if (!trimmed.startsWith("TR")) {
    return { valid: false, error: "İşletme numarası 'TR' ile başlamalıdır." }
  }

  if (trimmed.length < 5) {
    return {
      valid: false,
      error: "İşletme numarası en az 5 karakter olmalıdır (TR + 2 il kodu + en az 1 rakam).",
    }
  }

  if (!ENTERPRISE_NO_REGEX.test(trimmed)) {
    return {
      valid: false,
      error: "Geçersiz format. TR ile başlamalı, 2 hane il kodu ve 1-10 arası rakam içermelidir.",
    }
  }

  return { valid: true }
}

export function formatEnterpriseDisplay(
  enterpriseNo: string,
  label?: string | null
): string {
  if (label) {
    return `${label} (${enterpriseNo})`
  }
  return enterpriseNo
}
