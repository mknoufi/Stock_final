import ast
import os

def find_await_in_loop(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            tree = ast.parse(f.read(), filename=filepath)
    except Exception:
        return

    for node in ast.walk(tree):
        if isinstance(node, (ast.For, ast.AsyncFor, ast.While)):
            for child in ast.walk(node):
                if isinstance(child, ast.Await):
                    # Check if it calls db
                    if isinstance(child.value, ast.Call):
                        # A very simple check
                        try:
                            # Print the line
                            print(f"{filepath}:{child.lineno} - {ast.unparse(child)}")
                        except Exception:
                            pass

for root, _, files in os.walk('backend'):
    for file in files:
        if file.endswith('.py'):
            find_await_in_loop(os.path.join(root, file))
