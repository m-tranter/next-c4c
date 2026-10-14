const memStr = (m: number) => `${Math.round(m / 1024 / 1024)}MB`;
export const logMemory = () => {
  const mem = process.memoryUsage();

  console.log(`Memory usage at ${new Date().toLocaleString("en-GB")}:`);
  console.log(`- RSS: ${memStr(mem.rss)}`);
  console.log(`- Heap used: ${memStr(mem.heapUsed)}`);
  console.log(`- Heap total: ${memStr(mem.heapTotal)}`);

  console.log(`- External: ${memStr(mem.external)}`);
};

export const logKeys = () => {
  const keys = Object.keys(process.env);
  keys.sort();
  keys.forEach((k) => {
    console.log(`${k}: ${process.env[k]}`);
  });
};
