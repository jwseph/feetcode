from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/", StaticFiles(directory="."))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, port=80)