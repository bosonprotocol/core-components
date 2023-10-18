export async function* batchTasks<T>(
  tasks: (() => Promise<T>)[],
  limit: number,
  taskCallback = (r: T): T => r
) {
  // iterate over tasks
  for (let i = 0; i < tasks.length; i = i + limit) {
    // grab the batch of tasks for current iteration
    const batch = tasks.slice(i, i + limit);
    // wait for them to resolve concurrently
    const result = await Promise.all(
      // optionally attach callback to perform any side effects
      batch.map((task) => task().then((r) => taskCallback(r)))
    );
    // yield the batched result and let consumer know
    yield result;
  }
}
