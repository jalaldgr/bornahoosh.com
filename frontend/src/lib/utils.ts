// ========================================
// src/lib/utils.ts - Functions کمکی
// ========================================
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fa-IR');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function calculateInstallment(total: number, count: number): number {
  return Math.ceil(total / count);
}