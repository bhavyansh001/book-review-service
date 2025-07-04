from fastapi import FastAPI

app = FastAPI(
    title="Book Review service API",
    description="A simple API to manage book reviews",
    version="0.1.0"
)