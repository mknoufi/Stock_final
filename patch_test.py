import re

with open('backend/tests/api/test_report_generation_api.py', 'r') as f:
    content = f.read()

old_block = """    def __aiter__(self):
        self._iter = iter(self._rows)
        return self

    async def __anext__(self):
        try:
            return next(self._iter)
        except StopIteration as exc:
            raise StopAsyncIteration from exc"""

new_block = """    def __aiter__(self):
        self._iter = iter(self._rows)
        return self

    async def __anext__(self):
        try:
            return next(self._iter)
        except StopIteration as exc:
            raise StopAsyncIteration from exc

    async def to_list(self, length=None):
        return self._rows"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open('backend/tests/api/test_report_generation_api.py', 'w') as f:
        f.write(content)
    print("Patched test successfully")
else:
    print("Could not find block to patch in test")
