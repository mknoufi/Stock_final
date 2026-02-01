import sys
import shutil
from pathlib import Path
import subprocess

# Define paths
BACKEND_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = BACKEND_DIR.parent
FRONTEND_DIST = PROJECT_ROOT / "frontend" / "dist"
DIST_DIR = BACKEND_DIR / "dist"
BUILD_DIR = BACKEND_DIR / "build"
EXE_NAME = "StockVerifySystem"


def main():
    print(f"🚀 Starting build process for {EXE_NAME}...")

    # 1. Verify Frontend Build
    if not FRONTEND_DIST.exists():
        print("❌ Frontend dist not found! Please run 'npm run build:web' in frontend/ first.")
        sys.exit(1)

    print("✅ Frontend dist found.")

    # 2. Clean previous builds
    if DIST_DIR.exists():
        shutil.rmtree(DIST_DIR)
    if BUILD_DIR.exists():
        shutil.rmtree(BUILD_DIR)

    print("🧹 Cleaned previous build artifacts.")

    # 3. PyInstaller Configuration
    # We need to include:
    # - backend/ (python code)
    # - frontend/dist (static files) -> placed in _internal/frontend/dist or similar
    # - .env (if needed, though better embedded or generated)

    # Construct PyInstaller command
    pyinstaller_cmd = [
        "pyinstaller",
        "--name",
        EXE_NAME,
        "--onedir",  # Single directory (easier for debugging than --onefile)
        "--clean",
        "--noconfirm",
        # Config
        "--add-data",
        f"{FRONTEND_DIST};frontend/dist",  # Copy frontend/dist to MEI/frontend/dist
        "--add-data",
        f"{BACKEND_DIR}/.env;.",  # Include .env in root
        # Hidden imports often missed by PyInstaller
        "--hidden-import",
        "uvicorn.logging",
        "--hidden-import",
        "uvicorn.loops",
        "--hidden-import",
        "uvicorn.loops.auto",
        "--hidden-import",
        "uvicorn.protocols",
        "--hidden-import",
        "uvicorn.protocols.http",
        "--hidden-import",
        "uvicorn.protocols.http.auto",
        "--hidden-import",
        "uvicorn.lifespan",
        "--hidden-import",
        "uvicorn.lifespan.on",
        "--hidden-import",
        "engineio.async_drivers.asgi",
        "--hidden-import",
        "socketio.async_drivers.asgi",
        # Entry point
        str(BACKEND_DIR / "server.py"),
    ]

    print(f"📦 Running PyInstaller: {' '.join(pyinstaller_cmd)}")

    try:
        subprocess.run(pyinstaller_cmd, check=True, cwd=BACKEND_DIR)
        print(
            f"\n✅ Build successful! Executable is at: {DIST_DIR / EXE_NAME / (EXE_NAME + '.exe')}"
        )
        print(
            "ℹ️  Note: You may need to copy .env manually if not properly bundled, or ensure environment variables are set."
        )
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Build failed with error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
