function isEmailLike(value) {
  const trimmed = value?.trim();
  return Boolean(trimmed && trimmed.includes('@'));
}

/** Greeting name for header — never raw email when we can avoid it. */
export function displayNameFromUser(user) {
  if (!user) return '';

  const given = user.given_name?.trim();
  if (given && !isEmailLike(given)) return given;

  const full = user.name?.trim();
  if (full && !isEmailLike(full)) {
    return full.split(/\s+/)[0];
  }

  const email = user.email?.trim();
  if (email) {
    const local = email.split('@')[0] ?? '';
    if (local) {
      return local.charAt(0).toUpperCase() + local.slice(1);
    }
  }

  return '';
}
