import ast
import os

def check_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            tree = ast.parse(content, filename=filepath)
    except Exception:
        return

    for node in ast.walk(tree):
        if isinstance(node, (ast.For, ast.AsyncFor, ast.While)):
            # Check if there's any await Call inside this loop
            for child in ast.walk(node):
                if isinstance(child, ast.Await):
                    if isinstance(child.value, ast.Call):
                        # Simple heuristic: if it looks like db.collection.update/insert/delete etc.
                        func = child.value.func
                        if isinstance(func, ast.Attribute):
                            if func.attr in ('update_one', 'update_many', 'insert_one', 'insert_many', 'delete_one', 'delete_many', 'find_one', 'find'):
                                print(f"{filepath}:{child.lineno} - {ast.unparse(child)}")

for root, _, files in os.walk('backend'):
    for file in files:
        if file.endswith('.py'):
            check_file(os.path.join(root, file))
