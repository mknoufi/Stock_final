import os
import time
import json
import socket
import subprocess
from datetime import datetime
from pathlib import Path
import urllib.request as request
import urllib.error as error

# Configuration
PROJECT_ROOT = Path(__file__).parent.absolute()
BACKEND_DIR = PROJECT_ROOT / "backend"
FRONTEND_DIR = PROJECT_ROOT / "frontend"
BACKEND_PORT_FILE = PROJECT_ROOT / "backend_port.json"


def log(message):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")


def find_pid_by_port(port):
    """Find PID using specific port on Windows"""
    try:
        command = f"netstat -ano | findstr :{port}"
        output = subprocess.check_output(command, shell=True).decode()
        # Parse output line by line
        for line in output.strip().split("\n"):
            parts = line.split()
            if len(parts) >= 5:
                # Check if it's actually listening on the port
                local_addr = parts[1]
                state = parts[3]
                pid = parts[4]
                if f":{port}" in local_addr and state == "LISTENING":
                    return pid
    except subprocess.CalledProcessError:
        pass
    except Exception as e:
        log(f"Error finding PID for port {port}: {e}")
    return None


def kill_process(pid):
    """Kill process by PID"""
    if not pid:
        return
    try:
        subprocess.run(
            f"taskkill /F /PID {pid}",
            shell=True,
            stderr=subprocess.DEVNULL,
            stdout=subprocess.DEVNULL,
        )
        log(f"Killed process {pid}")
    except Exception as e:
        log(f"Failed to kill process {pid}: {e}")


def cleanup_ports():
    """Kill processes running on known ports"""
    log("Cleaning up existing processes...")

    # Backend ports range and common alternatives
    ports_to_check = [8000, 8001, 8002, 8045, 8081]

    for port in ports_to_check:
        pid = find_pid_by_port(port)
        if pid:
            log(f"Found process {pid} on port {port}")
            kill_process(pid)


def start_backend():
    """Start backend server in a new window"""
    log("Starting Backend Server...")

    # Remove old port file to ensure we read fresh data
    if BACKEND_PORT_FILE.exists():
        try:
            os.remove(BACKEND_PORT_FILE)
        except Exception:
            pass

    cmd = "python server.py"

    # Use 'start' to open in new window
    # /d specify directory
    subprocess.run(f'start "StockVerify Backend" /d "{BACKEND_DIR}" {cmd}', shell=True)


def wait_for_backend():
    """Wait for backend to write port file and be responsive"""
    log("Waiting for backend to initialize...")

    start_time = time.time()
    timeout = 60  # seconds

    while time.time() - start_time < timeout:
        if BACKEND_PORT_FILE.exists():
            try:
                with open(BACKEND_PORT_FILE, "r") as f:
                    data = json.load(f)

                backend_url = data.get("url")
                if backend_url:
                    # Verify it's actually reachable
                    try:
                        health_url = f"{backend_url}/health"
                        with request.urlopen(health_url, timeout=2) as response:
                            if response.status == 200:
                                log(f"Backend is ready at {backend_url}")
                                return data
                    except (error.URLError, socket.timeout):
                        pass

            except (json.JSONDecodeError, OSError):
                pass

        time.sleep(1)

    log("Timeout waiting for backend to start!")
    return None


def start_frontend(backend_data):
    """Start frontend with injected env vars"""
    log("Starting Frontend...")

    backend_url = backend_data["url"]

    # Prepare environment variables
    env_vars = {"EXPO_PUBLIC_BACKEND_URL": backend_url, "EXPO_PUBLIC_API_TIMEOUT": "30000"}

    # Construct command to set env vars and run expo
    # In Windows cmd, we chain commands with &&
    # set VAR=val && command

    set_env_cmds = []
    for k, v in env_vars.items():
        set_env_cmds.append(f"set {k}={v}")

    full_cmd_str = " && ".join(set_env_cmds) + " && npx expo start --android"

    # Start in new window
    subprocess.run(
        f'start "StockVerify Frontend" /d "{FRONTEND_DIR}" cmd /k "{full_cmd_str}"', shell=True
    )


def main():
    print("===================================================")
    print("     Stock Verification System - Smart Start")
    print("===================================================")
    print("")

    cleanup_ports()

    start_backend()

    backend_data = wait_for_backend()

    if backend_data:
        start_frontend(backend_data)
        print("")
        print("System started successfully!")
        print("Backend is running in one window.")
        print("Frontend is running in another window.")
    else:
        print("")
        print("FAILED to start system. Backend did not respond.")
        input("Press Enter to exit...")


if __name__ == "__main__":
    main()
