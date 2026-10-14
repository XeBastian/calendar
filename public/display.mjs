// Keep organizer wording, but present imported copy without emoji decoration.
export function cleanDisplayText(value) {
  return String(value ?? '')
    .replace(/[0-9#*]\uFE0F?\u20E3|\p{Regional_Indicator}{2}|\p{Extended_Pictographic}[\uFE0E\uFE0F\p{Emoji_Modifier}]*(?:\u200D\p{Extended_Pictographic}[\uFE0E\uFE0F\p{Emoji_Modifier}]*)*/gu, '')
    .replace(/[\uFE0E\uFE0F\u200D]/gu, '')
    .replace(/—/g, '-')
    .replace(/\s+/g, ' ').trim();
}

export function cleanDisplayRecords(records) {
  return records.map(record => Object.fromEntries(Object.entries(record).map(([key, value]) => [
    key, typeof value === 'string' && !['id', 'url', 'calendar'].includes(key) ? cleanDisplayText(value) : value
  ])));
}
