from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse
import json
import time
from uuid import uuid4
from typing import Optional, List

app = FastAPI()

app.mount("/dist", StaticFiles(directory="../../dist"), name="dist")
app.mount("/static", StaticFiles(directory="static"), name="static")


class Data(BaseModel):
    session: str
    message: str
    files: List[str]


class MessageItemResponse(BaseModel):
    type: str
    content: str
    message_item_id: int = Field(..., alias='messageItemID')
    name: Optional[str] = None

    class Config:
        populate_by_name = True


class MessageItemResponseChunk(BaseModel):
    type: str
    content: str
    message_item_id: int = Field(..., alias='messageItemID')
    name: Optional[str] = None

    class Config:
        populate_by_name = True


class DocumentResponse(BaseModel):
    title: str
    content: str
    icon: str


@app.post("/stream")
async def stream(data: Data):
    return StreamingResponse(
        line_streamer(),
        media_type="application/json",
    )


@app.post("/file")
async def file(session: str = Form(...), file: UploadFile = File(...)):
    return str(uuid4())


@app.delete("/file")
async def delete_file(session: str = Form(...)):
    return {"status": "ok"}


def line_streamer():
    global msg
    msg = (msg + 1) % len(msgs)
    for data in msgs[msg]:
        if ("sleep" in data):
            duration = data["sleep"]
            time.sleep(duration)
        else:
            time.sleep(0.04)
        item = data["item"]
        yield f'{json.dumps({"class": item.__class__.__name__, "data": item.dict(by_alias=True)}, ensure_ascii=False)}\n'


@ app.get("/session")
async def session():
    return {
        "name": "ExampleBot",
        "session": str(uuid4()),
        "multiTurn": True,
        "fileSupport": True,
    }

# Test messages


def getTestImage():
    return "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="


msgs = [
    [
        {"item": MessageItemResponseChunk(
            type="text", content=chunk, message_item_id=0), "sleep": 0.04}
        for chunk in
        ["Hi", ",", " Chatbot", " UI", " is", " a", " dependency", " free", " UI", " you", " can", " use", " in",
         " your", " projects", ".", " It", " is", " licensed", " under", " the", " MIT", " License", "."]],
    [
        {"item": MessageItemResponseChunk(
            type="text", content=chunk, message_item_id=0), "sleep": 0.03}
        for chunk in ["Hi", "!", " Chat", "bot", " UI", " is", " a", " JavaScript", " project", " designed", " to", " handle", " the", " user", " interface", " part", " of", " conversations", " with", " a", " chat", "bot", ".", " It", " includes", " an", " input", " field", " for", " users", " to", " type", " their", " messages", " and", " displays", " messages", " from", " both", " the", " user", " and", " the", " bot", ".", " Additionally", ",", " it", " supports", " special", " messages", " and", " has", " call", "back", " functionality", " for", " handling", " documents", ".", "\n\n", "One", " of", " its", " standout", " features", " is", " that", " it", "'", "s", " completely", " dependency", "-", "free", ",", " meaning", " it", " doesn't", " rely", " on", " other", " libraries", " or", " frameworks", " to", " function", ".", " This", " makes", " it", " easy", " to", " integrate", " into", " existing", " apps", " or", " websites", "."]],
    [
        {
            "item": MessageItemResponseChunk(
                type="text", content="Some", message_item_id=0),
            "sleep": 0.6,
        },
        {
            "item": MessageItemResponse(
                type="tool", content="This is an example tool response.",
                message_item_id=1, name="Supertool"),
            "sleep": 0.02,
        },
        {
            "item": MessageItemResponseChunk(
                type="text", content=" tool", message_item_id=0),
            "sleep": 0.04,
        },
        {
            "item": MessageItemResponseChunk(
                type="text", content=" output", message_item_id=0),
            "sleep": 0.04,
        },
        {
            "item": MessageItemResponseChunk(
                type="text", content=" for", message_item_id=0),
            "sleep": 0.04,
        },
        {
            "item": MessageItemResponseChunk(
                type="text", content=" tes", message_item_id=0),
            "sleep": 0.2,
        },
        {
            "item": MessageItemResponseChunk(
                type="text", content="ting", message_item_id=0),
            "sleep": 0.04,
        },
        {
            "item": MessageItemResponseChunk(
                type="text", content=".", message_item_id=0),
            "sleep": 0.04,
        },
        {
            "item": MessageItemResponse(
                type="tool", content="Another Tool",
                message_item_id=2, name="Second Tool"),
            "sleep": 0.7,
        },
        {
            "item": MessageItemResponse(
                type="b64image", content=getTestImage(),
                message_item_id=3),
            "sleep": 0.04,
        },
        {
            "item": DocumentResponse(title="Example Document",
                                     content="Lorem Ipsum "*1000,
                                     icon="📄"),
            "sleep": 0.01,
        },
    ]]
msg = len(msgs)
