export function addThread(
  threadCache: Map<`${bigint}`, number>,
  id: `${bigint}`
) {
  let base = 0;
  if (threadCache.has(id)) {
    base = threadCache.get(id);
  }
  threadCache.set(id, base + 1);
}
