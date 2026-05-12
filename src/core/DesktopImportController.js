export class DesktopImportController {
  constructor({ dragDropTarget, filesystem, publish } = {}) {
    this.dragDropTarget = dragDropTarget;
    this.fs = filesystem;
    this.publish = publish;
  }

  initDragAndDropImport() {
    const target = this.dragDropTarget;
    if (!target) return;

    target.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    target.addEventListener("drop", async (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer?.files || []);
      if (!files.length) return;

      await this.importDroppedFiles(files);
    });
  }

  getImportTargetDirectory() {
    const cDrive = this.fs.MOCK_FS["C\\"];
    if (!cDrive?.children) return null;

    if (!cDrive.children.DOCUMENTS) {
      cDrive.children.DOCUMENTS = { type: "dir", children: {} };
    }

    const documents = cDrive.children.DOCUMENTS;
    return documents?.type === "dir" ? documents : null;
  }

  getAppForExtension(name = "") {
    const ext = name.toLowerCase().split(".").pop();
    if (!ext || ext === name.toLowerCase()) return "notepad";

    if (["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(ext)) return "imageviewer";
    if (ext === "pdf") return "pdfreader";
    if (ext === "md" || ext === "markdown") return "markdown";

    return "notepad";
  }

  getUniqueFileName(dir, desiredName) {
    if (!dir?.children || !desiredName) return desiredName;
    if (!dir.children[desiredName]) return desiredName;

    const lastDot = desiredName.lastIndexOf(".");
    const base = lastDot > 0 ? desiredName.slice(0, lastDot) : desiredName;
    const ext = lastDot > 0 ? desiredName.slice(lastDot) : "";
    let counter = 1;
    let candidate = `${base} (${counter})${ext}`;

    while (dir.children[candidate]) {
      counter += 1;
      candidate = `${base} (${counter})${ext}`;
    }

    return candidate;
  }

  readFileForImport(file, app) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        if (app === "imageviewer" || app === "pdfreader") {
          resolve({ name: file.name, src: result });
        } else {
          resolve(result);
        }
      };

      reader.onerror = () => reject(reader.error);

      if (app === "imageviewer" || app === "pdfreader") {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  }

  async importDroppedFiles(files) {
    const targetDir = this.getImportTargetDirectory();
    if (!targetDir) return;

    for (const file of files) {
      const app = this.getAppForExtension(file.name);
      try {
        const content = await this.readFileForImport(file, app);
        const filename = this.getUniqueFileName(targetDir, file.name || "Untitled");
        targetDir.children[filename] = {
          type: "file",
          app,
          content
        };
      } catch (err) {
        console.error(`Failed to import file ${file.name}:`, err);
      }
    }

    await this.fs.saveFileSystem();
    this.publish("fs:change");
  }
}
