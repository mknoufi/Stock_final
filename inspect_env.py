with open(r"d:\stk\stock-verify-system\.env", "rb") as f:
    content = f.read()
    print(f"File length: {len(content)}")
    # Find the last 200 bytes
    last_part = content[-500:]
    print(f"Last part (repr): {repr(last_part)}")

with open(r"d:\stk\stock-verify-system\backend\.env", "rb") as f:
    content = f.read()
    print(f"\nBackend file length: {len(content)}")
    last_part = content[-200:]
    print(f"Last part (repr): {repr(last_part)}")
