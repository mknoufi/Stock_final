import asyncio
import time

async def simulate_old_approach(num_items):
    # Fetch all items: O(N) memory and IO
    # Simulate IO latency
    await asyncio.sleep(0.1 + (num_items * 0.0001))

    # Simulate processing (Python side)
    items = [{"item_code": f"ITEM_{i}", "stock_qty": 10, "last_cost": 5} for i in range(num_items)]

    start_cpu = time.time()
    total_stock_qty = sum(item.get("stock_qty", 0) for item in items)
    item_price_map = {}
    for item in items:
        price = item.get("last_cost", 0) or item.get("sale_price", 0) or item.get("mrp", 0)
        item_price_map[item["item_code"]] = price
    total_stock_value = sum(
        item.get("stock_qty", 0) * item_price_map.get(item["item_code"], 0) for item in items
    )
    cpu_time = time.time() - start_cpu
    return cpu_time

async def simulate_new_approach(num_items, num_counted_items):
    # Fetch aggregation result: O(1) memory and IO
    await asyncio.sleep(0.05) # MongoDB handles it natively, smaller payload

    # Simulate fetching only counted items
    await asyncio.sleep(0.02 + (num_counted_items * 0.0001))

    start_cpu = time.time()
    # Processing only counted items
    counted_items = [{"item_code": f"ITEM_{i}", "stock_qty": 10, "last_cost": 5} for i in range(num_counted_items)]
    item_price_map = {}
    for item in counted_items:
        price = item.get("last_cost", 0) or item.get("sale_price", 0) or item.get("mrp", 0)
        item_price_map[item["item_code"]] = price
    cpu_time = time.time() - start_cpu
    return cpu_time

async def main():
    print("Benchmarking Old vs New Approach")
    for num_items in [1000, 10000, 100000]:
        num_counted = int(num_items * 0.1)

        t0 = time.time()
        cpu_old = await simulate_old_approach(num_items)
        old_time = time.time() - t0

        t0 = time.time()
        cpu_new = await simulate_new_approach(num_items, num_counted)
        new_time = time.time() - t0

        print(f"\nItems: {num_items} (Counted: {num_counted})")
        print(f"Old approach: {old_time:.4f}s (CPU: {cpu_old:.4f}s)")
        print(f"New approach: {new_time:.4f}s (CPU: {cpu_new:.4f}s)")
        print(f"Speedup: {old_time / new_time:.2f}x")

if __name__ == "__main__":
    asyncio.run(main())
