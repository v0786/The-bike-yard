// Notification abstraction per ARCHITECTURE §8
export async function sendNotification(userId: string, title: string, message: string) {
  return { ok: true };
}
