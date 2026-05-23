// composables/useFormat.ts
export const useFormat = () => {
  const formatPrice = (n: number) => Math.round(n).toLocaleString('ar-EG')
  const formatWeight = (kg: number) => {
    if (kg >= 1) return `${kg.toFixed(2).replace(/\.?0+$/, '')} كجم`
    return `${(kg * 1000).toFixed(0)} جم`
  }
  return { formatPrice, formatWeight }
}
