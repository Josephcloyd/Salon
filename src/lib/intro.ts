/**
 * Tiny signal shared by the preloader, smooth-scroll and hero:
 * "the curtain has opened, start the show".
 */
type Listener = () => void;

let ready = false;
const listeners = new Set<Listener>();

export function markIntroReady(): void {
  if (ready) return;
  ready = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

export function isIntroReady(): boolean {
  return ready;
}

/** Calls `listener` once the intro finishes (immediately if it already has). Returns an unsubscribe. */
export function onIntroReady(listener: Listener): () => void {
  if (ready) {
    listener();
    return () => undefined;
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
