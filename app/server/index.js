const app = require("./src/app");
const { PORT, NODE_ENV } = require("./src/config");

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${NODE_ENV}`);
});
