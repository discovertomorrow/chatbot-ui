import { ChatOpenAI } from "@langchain/openai";
import {
  ChatbotUI,
  MessageItemResponseType,
  MessageItemResponseChunk,
} from "../../../dist/chatbotui.esm.min.js";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { BufferMemory } from "langchain/memory";
import markdownit from "markdown-it";

const md = markdownit();

const createChat = (apiKey, baseURL, modelName, systemPrompt) => {
  const model = new ChatOpenAI({ apiKey, modelName }, { baseURL });

  const prompt = ChatPromptTemplate.fromMessages([
    ...(systemPrompt ? [["system", systemPrompt]] : []),
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
  ]);

  const memory = new BufferMemory({
    returnMessages: true,
    inputKey: "input",
    outputKey: "output",
    memoryKey: "history",
  });

  const chain = RunnableSequence.from([
    {
      input: (initialInput) => initialInput.input,
      memory: () => memory.loadMemoryVariables({}),
    },
    {
      input: (previousOutput) => previousOutput.input,
      history: (previousOutput) => previousOutput.memory.history,
    },
    prompt,
    model,
  ]);

  const showError = (msg) => {
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("alert");
    const alertMsgDiv = document.createElement("div");
    alertMsgDiv.innerText = msg;
    alertDiv.appendChild(alertMsgDiv);
    chatbarDiv.appendChild(alertDiv);
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  };

  async function* streamResponse(input) {
    const inputs = {
      input,
    };
    const response = await chain.stream(inputs);
    let aiMessage = "";
    for await (const chunk of response) {
      yield new MessageItemResponseChunk(
        chunk.content,
        1,
        MessageItemResponseType.TEXT,
      );
      aiMessage += chunk.content;
    }
    await memory.saveContext(inputs, {
      output: aiMessage,
    });
  }

  const stream = async (input) => {
    return streamResponse(input["chat-input"]);
  };

  const msgDiv = document.querySelector("#messages");
  const chatbarDiv = document.querySelector("#chatbar");

  const chatbotUI = new ChatbotUI(stream)
    .withRender((content) => md.render(content))
    .withErrorCallback(showError)
    .attachTo(msgDiv, chatbarDiv);

  chatbotUI.focus();
};

const createForm = () => {
  const form = document.createElement("form");
  const fields = ["apiKey", "baseURL", "modelName", "systemPrompt"];
  fields.forEach((field) => {
    const label = document.createElement("label");
    const inputType = field === "apiKey" ? "password" : "text";
    const input = document.createElement("input");
    input.type = inputType;
    input.name = field;
    input.required = true;
    const storedValue =
      field === "apiKey"
        ? sessionStorage.getItem(field)
        : localStorage.getItem(field);
    if (storedValue) {
      input.value = storedValue;
    }
    label.innerHTML = `${field}: `;
    label.appendChild(input);
    form.appendChild(label);
  });
  const submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "Absenden";
  form.appendChild(submit);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const apiKey = formData.get("apiKey");
    const baseURL = formData.get("baseURL");
    const modelName = formData.get("modelName");
    const systemPrompt = formData.get("systemPrompt");

    sessionStorage.setItem("apiKey", apiKey);
    localStorage.setItem("baseURL", baseURL);
    localStorage.setItem("modelName", modelName);
    localStorage.setItem("systemPrompt", systemPrompt);

    createChat(apiKey, baseURL, modelName, systemPrompt);
    form.remove();
  });
  document.getElementById("main").appendChild(form);
};

createForm();

