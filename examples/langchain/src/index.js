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

/**
 * Initializes and starts the chatbot interface.
 * @param {string} apiKey - The API key for OpenAI.
 * @param {string} baseURL - The base URL for the OpenAI API.
 * @param {string} modelName - The name of the language model to use.
 * @param {string} systemPrompt - The system prompt for context.
 */
const createChat = (apiKey, baseURL, modelName, systemPrompt) => {
  // Initialize the OpenAI chat model with the provided parameters.
  const model = new ChatOpenAI({ apiKey, modelName }, { baseURL });

  // Create the chat prompt template with optional system prompt.
  const promptMessages = [
    ...(systemPrompt ? [["system", systemPrompt]] : []),
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
  ];
  const prompt = ChatPromptTemplate.fromMessages(promptMessages);

  // Set up memory to store conversation history.
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

  /**
   * Displays an error message to the user.
   * @param {string} msg - The error message to display.
   */
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

  /**
   * Streams the response from the language model.
   * @param {string} input - The user's input message.
   */
  async function* streamResponse(input) {
    const inputs = { input };
    const responseStream = await chain.stream(inputs);
    let aiMessage = "";

    for await (const chunk of responseStream) {
      yield new MessageItemResponseChunk(
        chunk.content,
        1,
        MessageItemResponseType.TEXT,
      );
      aiMessage += chunk.content;
    }
    await memory.saveContext(inputs, { output: aiMessage });
  }

  /**
   * Handles the streaming of the model's response.
   * @param {Object} input - The input object containing the user's message.
   */
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

/**
 * Creates a configuration form for the user to input API details.
 */
const createForm = () => {
  const form = document.createElement("form");
  const fields = ["apiKey", "baseURL", "modelName", "systemPrompt"];
  fields.forEach((field) => {
    const label = document.createElement("label");
    label.innerHTML = `${field}: `;

    const input = document.createElement("input");
    input.type = field === "apiKey" ? "password" : "text";
    input.name = field;
    input.required = true;

    // Retrieve and set stored values if available.
    const storedValue =
      field === "apiKey"
        ? sessionStorage.getItem(field)
        : localStorage.getItem(field);
    if (storedValue) {
      input.value = storedValue;
    }

    label.appendChild(input);
    form.appendChild(label);
  });

  // Create and append the submit button.
  const submitButton = document.createElement("input");
  submitButton.type = "submit";
  submitButton.value = "Submit";
  form.appendChild(submitButton);

  // Handle form submission to initialize the chatbot.
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const apiKey = formData.get("apiKey");
    const baseURL = formData.get("baseURL");
    const modelName = formData.get("modelName");
    const systemPrompt = formData.get("systemPrompt");

    // Store the API key and other details for future use.
    sessionStorage.setItem("apiKey", apiKey);
    localStorage.setItem("baseURL", baseURL);
    localStorage.setItem("modelName", modelName);
    localStorage.setItem("systemPrompt", systemPrompt);

    // Initialize the chat interface with the provided details.
    createChat(apiKey, baseURL, modelName, systemPrompt);
    form.remove();
  });
  document.getElementById("main").appendChild(form);
};

createForm();

