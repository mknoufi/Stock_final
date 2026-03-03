from fastapi import FastAPI, APIRouter

app = FastAPI()
router = APIRouter(prefix="/health")

@router.get("")
def health():
    return {"status": "ok"}

app.include_router(router, prefix="/api")

for route in app.routes:
    print(route.path)
