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
