export const STORAGE_KEY = 'pathwise.journeys.v1';
export const FEEDBACK_KEY = 'pathwise.feedback.v1';
export function readRecords(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed)
      ? parsed
          .filter(
            record =>
              record &&
              typeof record === 'object' &&
              typeof record.id === 'string'
          )
          .slice(0, 30)
      : [];
  } catch {
    return [];
  }
}
export function writeRecords(key, records) {
  try {
    localStorage.setItem(key, JSON.stringify(records.slice(0, 30)));
    return true;
  } catch {
    return false;
  }
}
export function downloadFile(name, text, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(
    new Blob([text], {
      type,
    })
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

