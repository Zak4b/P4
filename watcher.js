import { exec, spawn } from "node:child_process";
import { watch } from "node:fs/promises";
const [node, _, file] = process.argv;

function spawnNode() {
	const childProcess = spawn(node, [file]);
	childProcess.stdout.pipe(process.stdout);
	childProcess.stderr.pipe(process.stderr);
	childProcess.on("close", (code) => {
		if (code != null) process.exit(code);
	});
	return childProcess;
}

async function watchFiles() {
	let childNodeProcess = spawnNode();
	const watcher = watch("./", { recursive: true });
	for await (const event of watcher) {
		if (event.filename.endsWith(".js")) {
			childNodeProcess.kill("SIGKILL");
			childNodeProcess = spawnNode();
		}
	}
}
watchFiles().catch((err) => console.error(err));
