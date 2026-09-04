/**
 * Global Keyboard & Input Utility
 * Ensures that focused inputs (input, textarea, select, contenteditable)
 * receive native typing events and are never hijacked by global application shortcuts or navigation.
 */

export function isEditableTarget(target: EventTarget | null): boolean {
  if (!target) {
    return false;
  }

  if (typeof HTMLElement !== 'undefined' && !(target instanceof HTMLElement)) {
    return false;
  }

  const anyTarget = target as any;
  const tagName = anyTarget.tagName ? String(anyTarget.tagName).toUpperCase() : '';

  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
    return true;
  }

  if (anyTarget.isContentEditable) {
    return true;
  }

  // Check if target is inside an input, textarea, select, or contenteditable container
  if (typeof anyTarget.closest === 'function' && anyTarget.closest('input, textarea, select, [contenteditable="true"]')) {
    return true;
  }

  return false;
}