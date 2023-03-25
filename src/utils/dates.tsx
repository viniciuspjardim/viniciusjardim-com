export function formatDate(date: Date) {
  return date
    .toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    .replace(',', '')
}
