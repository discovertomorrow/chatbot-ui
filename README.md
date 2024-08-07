# Chatbot UI

A dependency free chatbot ui.

While developed by prognosticians, chatbotui is not an official
prognostica product.

<img alt="an example of chatbotui in action" src="example.png" />

## Build

```bash
npm install --include=dev --ignore-scripts
npm run build
```

### Types

```bash
npm install typescript --no-save
npx -p typescript tsc src/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

By submitting a contribution (code, documentation, or other content), you agree
that your contribution is licensed under the MIT License as stated in the
LICENSE file of this project. For more details, please see our
[CONTRIBUTING](CONTRIBUTING.md) guidelines.

## Examples - Getting Started

This project contains an example app powered by FastAPI to demonstrate the integration of the Chatbot UI in a project. Follow the given instructions to run the app:
* First, build the Chatbot UI following the [build instructions](#build) (e.g. in the included devcontainer)
* Next, start the devcontainer of the [example project](examples/fastapi/)
* Then, the app can be started in a console of the devcontainer via `uvicorn app:app --host=0.0.0.0`
* Finally, the Chatbot UI should be available in the browser at `http://localhost:8000/`
