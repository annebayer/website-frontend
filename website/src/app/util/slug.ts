export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Umlaute entfernen
    .replace(/[^a-z0-9]+/g, '-')      // Sonderzeichen -> -
    .replace(/(^-|-$)+/g, '');        // Trim
}
