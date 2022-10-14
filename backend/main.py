from fastapi import FastAPI

app = FastAPI()

@app.get("/api/test")
async def root():
    return {"message": "Connected to backend!!!"}