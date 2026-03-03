import os
from pathlib import Path

# Configuration
ROOT_DIR = Path(r"d:\stk\stock-verify-system")
OUTPUT_FILE = Path(r"d:\stk\stock-verify-system\CODEBASE_DUMP.txt")

# Directories and files to exclude
EXCLUDE_DIRS = {
    ".git",
    ".idea",
    ".vscode",
    "__pycache__",
    "venv",
    "env",
    "node_modules",
    ".expo",
    "dist",
    "build",
    "android",
    "ios",
    "coverage",
    ".pytest_cache",
    ".mypy_cache",
    "site-packages",
    ".gemini",
    "coverage_html",
    "htmlcov",
}
EXCLUDE_EXTENSIONS = {
    ".exe",
    ".dll",
    ".so",
    ".dylib",
    ".apk",
    ".aab",
    ".zip",
    ".tar",
    ".gz",
    ".7z",
    ".rar",
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".ico",
    ".webp",
    ".mp4",
    ".mov",
    ".avi",
    ".pyc",
    ".pyo",
    ".pyd",
    ".lock",
    ".log",
    ".sqlite",
    ".db",
    ".env",
}
EXCLUDE_FILES = {
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "CODEBASE_DUMP.txt",
    "generate_dump.py",
}


def generate_tree(dir_path: Path, prefix: str = ""):
    tree_str = ""
    try:
        # Get and sort entries
        entries = sorted(
            [
                e
                for e in os.scandir(dir_path)
                if e.name not in EXCLUDE_DIRS and e.name not in EXCLUDE_FILES
            ],
            key=lambda e: e.name.lower(),
        )

        entries = [e for e in entries if not e.name.startswith(".")]  # Skip hidden files

        for i, entry in enumerate(entries):
            is_last = i == len(entries) - 1
            connector = "└── " if is_last else "├── "

            tree_str += f"{prefix}{connector}{entry.name}\n"

            if entry.is_dir():
                extension = "    " if is_last else "│   "
                tree_str += generate_tree(Path(entry.path), prefix + extension)

    except PermissionError:
        pass
    return tree_str


def is_text_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            f.read(1024)
            return True
    except (UnicodeDecodeError, PermissionError, OSError):
        return False


def main():
    print(f"Generating dump for {ROOT_DIR}...")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write("STOCK VERIFY SYSTEM - CODEBASE DUMP\n")
        out.write("===================================\n\n")

        # 1. Write Directory Tree
        out.write("PROJECT STRUCTURE:\n")
        out.write("------------------\n")
        out.write(f"{ROOT_DIR.name}/\n")
        out.write(generate_tree(ROOT_DIR))
        out.write("\n" + "=" * 80 + "\n\n")

        # 2. Write File Contents
        out.write("FILE CONTENTS:\n")
        out.write("--------------\n\n")

        for root, dirs, files in os.walk(ROOT_DIR):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith(".")]

            for file in sorted(files):
                if file in EXCLUDE_FILES or file.startswith("."):
                    continue

                file_path = Path(root) / file
                if file_path.suffix.lower() in EXCLUDE_EXTENSIONS:
                    continue

                # Check file size (skip large files > 1MB)
                try:
                    if file_path.stat().st_size > 1_000_000:
                        out.write(
                            f"--- FILE: {file_path.relative_to(ROOT_DIR)} (SKIPPED - TOO LARGE) ---\n\n"
                        )
                        continue
                except OSError:
                    continue

                if is_text_file(file_path):
                    try:
                        relative_path = file_path.relative_to(ROOT_DIR)
                        out.write(f"--- FILE: {relative_path} ---\n")
                        out.write(f"--- FULL PATH: {file_path} ---\n\n")
                        with open(file_path, "r", encoding="utf-8") as f:
                            out.write(f.read())
                    except Exception as e:
                        out.write(f"[Error reading file: {e}]")
                    out.write("\n\n" + "-" * 80 + "\n\n")

    print(f"Dump complete: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
