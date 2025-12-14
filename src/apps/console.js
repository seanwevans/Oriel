import { MOCK_FS, saveFileSystem } from "../filesystem.js";

const getKernel = () => window.kernel;

function initConsole(w) {
  w.consoleState = {
    cwd: "C:\\",
    history: [],
    historyIndex: null
  };
  updateConsolePrompt(w);
  const input = w.querySelector(".console-input");
  if (input) input.focus();
}

function getConsoleState(w) {
  if (!w.consoleState) initConsole(w);
  return w.consoleState;
}

function updateConsolePrompt(w) {
  const state = getConsoleState(w);
  const prompt = w.querySelector(".console-line span");
  if (prompt) prompt.textContent = `${state.cwd}>`;
}

function consolePathFromUnix(targetPath, cwd) {
  const unixCwd = cwd.replace(/^C:\\/, "/").replace(/\\/g, "/");
  const normalized = (targetPath || ".").replace(/\\/g, "/");
  const combined = normalized.startsWith("/")
    ? normalized
    : `${unixCwd}/${normalized}`;
  const segments = combined
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.toUpperCase());
  const windowsPath = `C:${segments.length ? "\\" + segments.join("\\") : "\\"}`;
  return resolveConsolePath(windowsPath, cwd);
}

function unixifyPath(path) {
  return path.replace(/^C:\\/, "/").replace(/\\/g, "/") || "/";
}

function resolveParentAndNameFromUnix(targetPath, cwd) {
  const unixCwd = unixifyPath(cwd);
  const normalized = (targetPath || "").replace(/\\/g, "/");
  const combined = normalized.startsWith("/") ? normalized : `${unixCwd}/${normalized}`;
  const segments = combined
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);
  const name = segments.pop();
  const parentUnix = `/${segments.join("/")}`;
  const { node: parent, path: parentPath } = consolePathFromUnix(parentUnix || "/", cwd);
  return { parent, parentPath, name: name ? name.toUpperCase() : null };
}

function cashLs(pathArg, state) {
  const { node } = consolePathFromUnix(pathArg || state.cwd, state.cwd);
  if (!node || node.type !== "dir") {
    return { error: "ls: No such file or directory" };
  }
  const entries = Object.keys(node.children || {}).sort();
  return { lines: entries.length ? entries : ["(empty)"] };
}

function cashPwd(state) {
  return { lines: [unixifyPath(state.cwd)] };
}

function cashCat(pathArg, state) {
  if (!pathArg) return { error: "cat: missing file operand" };
  const { node } = consolePathFromUnix(pathArg, state.cwd);
  if (!node) return { error: `cat: ${pathArg}: No such file or directory` };
  if (node.type === "dir") return { error: `cat: ${pathArg}: Is a directory` };
  return { lines: [node.content || ""] };
}

function cashEcho(argLine) {
  return { lines: [argLine || ""] };
}

function cashMkdir(argLine, state) {
  if (!argLine) return { error: "mkdir: missing operand" };
  const segments = argLine.split(/\s+/).filter(Boolean);
  const created = [];
  for (const seg of segments) {
    const { path, node } = consolePathFromUnix(seg, state.cwd);
    if (node) return { error: `mkdir: cannot create directory '${seg}': File exists` };
    const parentPath = seg.split("/").slice(0, -1).join("/");
    const { node: parent } = consolePathFromUnix(parentPath || state.cwd, state.cwd);
    if (!parent || parent.type !== "dir") {
      return { error: `mkdir: cannot create directory '${seg}': No such file or directory` };
    }
    const newName = seg.split("/").filter(Boolean).pop().toUpperCase();
    parent.children[newName] = { type: "dir", children: {} };
    created.push(seg);
  }
  saveFileSystem();
  return { lines: created.map((c) => `created ${c}`) };
}

function cashTouch(argLine, state) {
  if (!argLine) return { error: "touch: missing file operand" };
  const files = argLine.split(/\s+/).filter(Boolean);
  const created = [];
  for (const file of files) {
    const { path, node } = consolePathFromUnix(file, state.cwd);
    if (node && node.type === "dir") return { error: `touch: ${file}: Is a directory` };
    const parentPath = file.split("/").slice(0, -1).join("/");
    const { node: parent } = consolePathFromUnix(parentPath || state.cwd, state.cwd);
    if (!parent || parent.type !== "dir") {
      return { error: `touch: cannot touch '${file}': No such file or directory` };
    }
    const newName = file.split("/").filter(Boolean).pop().toUpperCase();
    parent.children[newName] = parent.children[newName] || { type: "file", content: "" };
    created.push(file);
  }
  saveFileSystem();
  return { lines: created.map((c) => `updated ${c}`) };
}

function cashRm(argLine, state) {
  if (!argLine) return { error: "rm: missing operand" };
  const parts = argLine.split(/\s+/).filter(Boolean);
  const hasRecursiveFlag = parts.includes("-r");
  const targetArg = parts.find((p) => p !== "-r");

  if (!targetArg) return { error: "rm: missing operand" };

  const { node } = consolePathFromUnix(targetArg, state.cwd);
  if (!node) return { error: `rm: cannot remove '${targetArg}': No such file or directory` };
  if (node.type === "dir" && !hasRecursiveFlag)
    return { error: "rm: cannot remove a directory without -r" };

  const { parent, name } = resolveParentAndNameFromUnix(targetArg, state.cwd);
  if (!parent || !parent.children?.[name])
    return { error: `rm: cannot remove '${targetArg}': No such file or directory` };

  delete parent.children[name];
  saveFileSystem();
  return { lines: [`removed ${targetArg}`] };
}

function cashCp(argLine, state) {
  const args = argLine?.split(/\s+/).filter(Boolean) || [];
  if (args.length < 2) return { error: "cp: missing file operand" };

  const [sourceArg, destArg] = args;
  const { path: sourcePath, node: sourceNode } = consolePathFromUnix(sourceArg, state.cwd);
  if (!sourceNode) return { error: `cp: cannot stat '${sourceArg}': No such file or directory` };

  const sourceName = sourcePath.split(/\\/).filter(Boolean).pop();
  const destResolved = consolePathFromUnix(destArg, state.cwd);
  let destParent = null;
  let destParentPath = null;
  let destName = null;

  if (destResolved.node && destResolved.node.type === "dir") {
    destParent = destResolved.node;
    destParentPath = destResolved.path;
    destName = sourceName;
  } else {
    ({ parent: destParent, parentPath: destParentPath, name: destName } =
      resolveParentAndNameFromUnix(destArg, state.cwd));
  }

  if (!destParent || destParent.type !== "dir")
    return { error: `cp: cannot create file '${destArg}': No such directory` };
  if (!destName) return { error: "cp: missing destination file operand" };
  if (destParent.children?.[destName])
    return { error: `cp: cannot overwrite '${destArg}': File exists` };

  const clone = structuredClone(sourceNode);
  destParent.children[destName] = clone;
  saveFileSystem();
  return { lines: [`copied ${sourceArg} to ${destArg}`] };
}

function cashMv(argLine, state) {
  const args = argLine?.split(/\s+/).filter(Boolean) || [];
  if (args.length < 2) return { error: "mv: missing file operand" };

  const [sourceArg, destArg] = args;
  const { path: sourcePath, node: sourceNode } = consolePathFromUnix(sourceArg, state.cwd);
  if (!sourceNode) return { error: `mv: cannot stat '${sourceArg}': No such file or directory` };

  const sourceName = sourcePath.split(/\\/).filter(Boolean).pop();
  const { parent: sourceParent } = resolveParentAndNameFromUnix(sourceArg, state.cwd);
  if (!sourceParent || !sourceParent.children?.[sourceName])
    return { error: `mv: cannot move '${sourceArg}': No such file or directory` };

  const destResolved = consolePathFromUnix(destArg, state.cwd);
  let destParent = null;
  let destParentPath = null;
  let destName = null;

  if (destResolved.node && destResolved.node.type === "dir") {
    destParent = destResolved.node;
    destParentPath = destResolved.path;
    destName = sourceName;
  } else {
    ({ parent: destParent, parentPath: destParentPath, name: destName } =
      resolveParentAndNameFromUnix(destArg, state.cwd));
  }

  if (!destParent || destParent.type !== "dir")
    return { error: `mv: cannot move to '${destArg}': No such directory` };
  if (!destName) return { error: "mv: missing destination file operand" };

  const destFullPath = destParentPath.endsWith("\\")
    ? `${destParentPath}${destName}`
    : `${destParentPath}\\${destName}`;

  if (sourceNode.type === "dir") {
    const normalizedSourcePath = sourcePath.replace(/\\+$/, "");
    const normalizedDestPath = destFullPath.replace(/\\+$/, "");
    if (
      normalizedDestPath === normalizedSourcePath ||
      normalizedDestPath.startsWith(`${normalizedSourcePath}\\`)
    ) {
      return { error: "mv: cannot move a directory into itself" };
    }
  }

  if (destParent.children?.[destName])
    return { error: `mv: cannot overwrite '${destArg}': File exists` };

  destParent.children[destName] = sourceNode;
  delete sourceParent.children[sourceName];
  saveFileSystem();
  return { lines: [`moved ${sourceArg} to ${destArg}`] };
}

function registerDefaultConsoleCommands() {
  const kernel = getKernel();
  if (!kernel) return;

  const register = (name, handler) => kernel.registerCommand(name, handler);

  register("ls", ({ argLine, state }) => cashLs(argLine || state.cwd, state));
  register("dir", ({ argLine, state }) => cashLs(argLine || state.cwd, state));
  register("pwd", ({ state }) => cashPwd(state));
  register("cat", ({ argLine, state }) => cashCat(argLine, state));
  register("echo", ({ argLine }) => cashEcho(argLine));
  register("mkdir", ({ argLine, state }) => cashMkdir(argLine, state));
  register("touch", ({ argLine, state }) => cashTouch(argLine, state));
  register("rm", ({ argLine, state }) => cashRm(argLine, state));
  register("cp", ({ argLine, state }) => cashCp(argLine, state));
  register("mv", ({ argLine, state }) => cashMv(argLine, state));
  register("cd", ({ argLine, state, updatePrompt }) => {
    if (!argLine) return { lines: [state.cwd] };
    const { path, node } = consolePathFromUnix(argLine, state.cwd);
    if (node && node.type === "dir" && path) {
      state.cwd = path;
      if (updatePrompt) updatePrompt();
      return { lines: [] };
    }
    return { error: `cd: ${argLine}: No such file or directory` };
  });
}

function registerConsoleCommands() {
  registerDefaultConsoleCommands();
}

function processCashCommand(w, cmd, argLine, rawCmd, state) {
  const kernel = getKernel();
  const handler = kernel?.getCommandHandler(cmd);
  if (!handler)
    return { error: `'${rawCmd}' is not recognized as an internal or external command.` };

  const context = {
    argLine,
    args: argLine ? argLine.split(/\s+/).filter(Boolean) : [],
    rawCmd,
    state,
    window: w,
    updatePrompt: () => updateConsolePrompt(w),
    appendLine: (line) => appendConsoleLine(w, line)
  };

  return handler(context) || { lines: [] };
}

function getPathSegments(pathStr) {
  if (!pathStr) return [];
  const cleaned = pathStr.replace(/^[A-Za-z]:/, "").replace(/^\\+/, "");
  return cleaned ? cleaned.split(/\\+/).filter(Boolean) : [];
}

function resolveConsolePath(targetPath, cwd) {
  let baseSegments = getPathSegments(cwd);
  let remaining = targetPath || "";
  const driveMatch = remaining.match(/^([A-Za-z]):/);
  if (driveMatch) {
    if (driveMatch[1].toUpperCase() !== "C") return { path: null, node: null };
    baseSegments = [];
    remaining = remaining.slice(driveMatch[0].length);
  }
  if (remaining.startsWith("\\")) {
    baseSegments = [];
    remaining = remaining.replace(/^\\+/, "");
  }
  const additional = getPathSegments(remaining);
  const segments = [...baseSegments];
  additional.forEach((seg) => {
    if (!seg || seg === ".") return;
    if (seg === "..") segments.pop();
    else segments.push(seg.toUpperCase());
  });
  let node = MOCK_FS["C\\"] || MOCK_FS["C:\\"];
  segments.forEach((seg) => {
    if (!node || !node.children) return;
    const key = Object.keys(node.children).find(
      (k) => k.toUpperCase() === seg
    );
    node = key ? node.children[key] : null;
  });
  const normalizedPath =
    "C:\\" + (segments.length ? segments.join("\\") : "");
  return { path: normalizedPath.replace(/\\\\+/g, "\\"), node };
}

function appendConsoleLine(w, text = "") {
  const output = w.querySelector(".console-output");
  if (!output) return;
  const line = document.createElement("div");
  line.textContent = text;
  output.appendChild(line);
  const consoleEl = w.querySelector(".console");
  if (consoleEl) consoleEl.scrollTop = consoleEl.scrollHeight;
}

async function processConsoleCommand(w, input) {
  const state = getConsoleState(w);
  appendConsoleLine(w, `${state.cwd}>${input}`);
  if (!input.trim()) {
    updateConsolePrompt(w);
    return;
  }
  const [rawCmd, ...rest] = input.trim().split(/\s+/);
  const cmd = rawCmd.toLowerCase();
  const argLine = rest.join(" ");
  const lowerArgs = argLine.trim();
  if (cmd === "cls") {
    const output = w.querySelector(".console-output");
    if (output) output.innerHTML = "";
    updateConsolePrompt(w);
    return;
  }
  if (cmd === "help") {
    [
      "Egg Oriel Console Commands:",
      "HELP    - Show this help text",
      "DIR/LS  - List files and folders",
      "CD      - Change directory (works with Unix-style paths)",
      "PWD     - Print working directory",
      "CAT     - Print file contents",
      "TOUCH   - Create an empty file",
      "MKDIR   - Create folders",
      "CLS     - Clear the screen",
      "ECHO    - Print text"
    ].forEach((line) => appendConsoleLine(w, line));
    updateConsolePrompt(w);
    return;
  }

  const result = await Promise.resolve(
    processCashCommand(w, cmd, lowerArgs, rawCmd, state)
  );
  if (result?.error) appendConsoleLine(w, result.error);
  (result?.lines || []).forEach((line) => appendConsoleLine(w, line));
  updateConsolePrompt(w);
}

async function handleConsoleKey(e) {
  const win = e.target.closest(".window");
  if (!win) return;
  const state = getConsoleState(win);
  if (e.key === "Enter") {
    e.preventDefault();
    await processConsoleCommand(win, e.target.value);
    if (e.target.value.trim()) {
      state.history.push(e.target.value.trim());
    }
    state.historyIndex = null;
    e.target.value = "";
    setTimeout(() => e.target.focus(), 0);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (!state.history.length) return;
    if (state.historyIndex === null) state.historyIndex = state.history.length - 1;
    else if (state.historyIndex > 0) state.historyIndex--;
    e.target.value = state.history[state.historyIndex] || "";
    e.target.setSelectionRange(e.target.value.length, e.target.value.length);
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (state.historyIndex === null) return;
    if (state.historyIndex < state.history.length - 1) state.historyIndex++;
    else state.historyIndex = null;
    e.target.value =
      state.historyIndex === null ? "" : state.history[state.historyIndex];
    e.target.setSelectionRange(e.target.value.length, e.target.value.length);
  }
}

async function runCompiler(e) {
  const win = e?.target?.closest(".window") || document.querySelector(".window.active");
  const output = win?.querySelector("#compiler-out");
  const editor = win?.querySelector(".compiler-editor");

  if (!output) return;

  const code = editor?.value || "";
  if (!code.trim()) {
    output.innerHTML = `<pre>No source code provided.</pre>`;
    return;
  }

  output.innerHTML = `<pre>Sending code to Compiler Explorer...</pre>`;

  const payload = {
    source: code,
    options: {
      userArguments: "",
      compilerOptions: { executorRequest: true },
      filters: { execute: true },
      executeParameters: { args: [] }
    }
  };

  const lines = [];
  try {
    const res = await fetch("https://godbolt.org/api/compiler/g131/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`compiler service responded with ${res.status}`);
    }

    const data = await res.json();
    const compilerStdout = (data.stdout || []).map((s) => s.text).join("\n").trim();
    const compilerStderr = (data.stderr || []).map((s) => s.text).join("\n").trim();
    const execStdout = (data.execResult?.stdout || [])
      .map((s) => s.text)
      .join("\n")
      .trim();
    const execStderr = (data.execResult?.stderr || [])
      .map((s) => s.text)
      .join("\n")
      .trim();
    const exitCode = data.execResult?.code ?? data.code;

    lines.push("Compilation via Compiler Explorer (gcc 13.1)");
    if (compilerStdout || compilerStderr) {
      lines.push("Compiler output:");
      if (compilerStdout) lines.push(compilerStdout);
      if (compilerStderr) lines.push(compilerStderr);
    }
    lines.push(`Exit code: ${exitCode}`);
    if (execStderr) {
      lines.push("Stderr:");
      lines.push(execStderr);
    }
    lines.push("Program output:");
    lines.push(execStdout || "(no output)");
  } catch (err) {
    lines.push(`Compilation failed: ${err.message}`);
  }

  output.innerHTML = `<pre>${lines.join("\n")}</pre>`;
}

async function runPython(e) {
  const win = e?.target?.closest(".window") || document.querySelector(".window.active");
  const output = win?.querySelector("#python-out");
  const editor = win?.querySelector(".compiler-editor");

  if (!output) return;

  const code = editor?.value || "";

  if (!code.trim()) {
    output.innerHTML = `<pre>No script provided.</pre>`;
    return;
  }

  const body = {
    source: code,
    options: {
      executeParameters: { args: [], stdin: "" },
      compilerOptions: {},
      filters: { execute: true },
      tools: []
    }
  };

  output.innerHTML = `<pre>Sending code to Compiler Explorer...</pre>`;

  try {
    const response = await fetch("https://godbolt.org/api/compiler/python312/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    if (!response.ok) throw new Error(text || response.statusText);

    const pre = document.createElement("pre");
    pre.textContent = text;
    output.innerHTML = "";
    output.appendChild(pre);
  } catch (err) {
    const pre = document.createElement("pre");
    pre.textContent = `Execution failed: ${err.message}`;
    output.innerHTML = "";
    output.appendChild(pre);
  }
}

function calcInput(e, v) {
  const d = e.target.closest(".window").querySelector("#calc-disp"),
    val = d.dataset.val;
  if (v === "C") d.dataset.val = "0";
  else if (v === "=") {
    try {
      const sanitized = val.replace(/\s+/g, "");
      const mathPattern = /^-?(\d+(?:\.\d+)?)([+\-*/]-?\d+(?:\.\d+)?)*$/;
      if (!mathPattern.test(sanitized)) {
        throw new Error("Invalid expression");
      }

      // Evaluate the sanitized expression using Function for isolation.
      // This avoids the broad security risks of eval while still supporting
      // basic arithmetic used by the calculator UI.
      // eslint-disable-next-line no-new-func
      const result = new Function(`"use strict"; return (${sanitized});`)();

      if (!Number.isFinite(result)) throw new Error("Invalid result");

      d.dataset.val = result.toString();
    } catch {
      d.dataset.val = "Err";
    }
  } else d.dataset.val = val === "0" && !"+-*/".includes(v) ? v : val + v;
  d.innerText = d.dataset.val;
}

export {
  calcInput,
  handleConsoleKey,
  initConsole,
  registerConsoleCommands,
  runCompiler,
  runPython
};
