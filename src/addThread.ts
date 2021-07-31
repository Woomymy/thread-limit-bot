export function addThread(threadCache: Map<string, number>, id: string) {
  let base = 0;
  if (threadCache.has(id)) {
    base = threadCache.get(id);
  }
  threadCache.set(id, base + 1);
}
