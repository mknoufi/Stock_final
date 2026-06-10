import asyncio

async def func1():
    await asyncio.sleep(0.1)
    return 1

async def func2():
    await asyncio.sleep(0.1)
    return 2

async def func3():
    await asyncio.sleep(0.1)
    return 3

async def main():
    print(await func1(), await func2(), await func3())

asyncio.run(main())
