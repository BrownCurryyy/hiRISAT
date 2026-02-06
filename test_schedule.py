import httpx
import asyncio

async def test_schedule():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("http://127.0.0.1:8000/schedule", timeout=20.0)
            print("Status Code:", response.status_code)
            data = response.json()
            print("Data Keys:", list(data.keys()))
            if data:
                first_station = list(data.keys())[0]
                print(f"Passes for {first_station}:", len(data[first_station]))
                if data[first_station]:
                     print("First pass sample:", data[first_station][0])
        except Exception as e:
            print("Error:", e)

if __name__ == "__main__":
    asyncio.run(test_schedule())
