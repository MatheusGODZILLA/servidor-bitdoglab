const express = require("express");
const app = express();
const os = require("os");
const PORT = 3000;

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address;
      }
    }
  }
  return "localhost";
}

let statusAtual = {
  botao: "desconhecido",
  temperatura: null,
};

app.use(express.json());
app.use(express.static("public"));

// POST /update — a plaquinha envia dados aqui
app.post("/update", (req, res) => {
  console.log("Corpo recebido brabo:", req.body);

  try {
    const dados = req.body;
    statusAtual.botao = dados.botao || "desconhecido";
    statusAtual.temperatura = parseFloat(dados.temperatura) || null;
    console.log("Status atualizado:", statusAtual);
    res.send("OK");
  } catch (err) {
    console.error("Erro ao processar POST:", err);
    res.status(400).send("Erro ao processar dados");
  }
});

// GET /status — o navegador busca os dados aqui
app.get("/status", (req, res) => {
  res.json(statusAtual);
});

app.listen(PORT, () => {
  const ip = getLocalIP();
  console.log(`Servidor rodando em http://${ip}:${PORT}`);
});
