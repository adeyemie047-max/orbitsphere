import { rmSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";

/** Kill stale Next.js dev servers so port 3000 is free and .next is not locked. */
function killDevPorts() {
  if (process.platform === "win32") {
    for (const port of [3000, 3001, 3002]) {
      const result = spawnSync("cmd", ["/c", `netstat -ano | findstr ":${port}"`], {
        encoding: "utf8",
      });
      const pids = new Set(
        (result.stdout ?? "")
          .split(/\r?\n/)
          .map((line) => line.trim().split(/\s+/).pop())
          .filter((pid) => pid && /^\d+$/.test(pid) && pid !== "0")
      );
      for (const pid of pids) {
        spawnSync("taskkill", ["/F", "/PID", pid], { stdio: "ignore" });
      }
    }
    return;
  }

  for (const port of [3000, 3001, 3002]) {
    spawnSync("sh", ["-c", `lsof -ti:${port} | xargs kill -9 2>/dev/null || true`]);
  }
}

killDevPorts();
spawnSync("node", ["-e", "setTimeout(()=>{},1500)"], { shell: true });
rmSync(".next", { recursive: true, force: true });

const child = spawn("next", ["dev", "--turbopack", "-p", "3000"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
