import os
from pathlib import Path
from dotenv import load_dotenv

print("--- Diagnostic Script ---")
print(f"CWD: {os.getcwd()}")

root_env = Path(".env")
backend_env = Path("backend/.env")

print(f"Root .env exists: {root_env.exists()}")
print(f"Backend .env exists: {backend_env.exists()}")

print("\nLoading Root .env...")
load_dotenv(root_env)
print(f"DB_NAME: {os.getenv('DB_NAME')}")
print(f"PIN_SALT: {os.getenv('PIN_SALT')}")

print("\nLoading Backend .env...")
load_dotenv(backend_env, override=True)
print(f"DB_NAME: {os.getenv('DB_NAME')}")
print(f"PIN_SALT: {os.getenv('PIN_SALT')}")

print("\nAll env keys starting with DB_ or PIN_:")
for key in os.environ:
    if key.startswith("DB_") or key.startswith("PIN_"):
        print(f"{key}={os.environ[key]}")
