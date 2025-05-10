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

function calcularDirecao(x, y) {
  const limiar = 30;

  if (Math.abs(x) < limiar && Math.abs(y) < limiar) return "Centro";

  if (y >= limiar && Math.abs(x) < limiar) return "Norte";
  if (y <= -limiar && Math.abs(x) < limiar) return "Sul";
  if (x >= limiar && Math.abs(y) < limiar) return "Leste";
  if (x <= -limiar && Math.abs(y) < limiar) return "Oeste";

  if (x >= limiar && y >= limiar) return "Nordeste";
  if (x <= -limiar && y >= limiar) return "Noroeste";
  if (x >= limiar && y <= -limiar) return "Sudeste";
  if (x <= -limiar && y <= -limiar) return "Sudoeste";

  return "Indefinido";
}


let statusAtual = {
  botao: "desconhecido",
  temperatura: null,
  joystick: {
    x: 0,
    y: 0,
  },
  direcao: "Indefinido"
};

app.use(express.json());
app.use(express.static("public"));

app.post("/update", (req, res) => {
  console.log("Corpo recebido:", req.body);

  try {
    const dados = req.body;
    statusAtual.botao = dados.botao || "desconhecido";
    statusAtual.temperatura = parseFloat(dados.temperatura) || null;
    statusAtual.joystick.x = parseInt(dados.joystick.x) || 0;
    statusAtual.joystick.y = parseInt(dados.joystick.y) || 0;
    statusAtual.direcao = calcularDirecao(statusAtual.joystick.x, statusAtual.joystick.y);

    console.log("Status atualizado:", statusAtual);
    res.send("OK");
  } catch (err) {
    console.error("Erro ao processar POST:", err);
    res.status(400).send("Erro ao processar dados");
  }
});

app.get("/status", (req, res) => {
  res.json(statusAtual);
});

app.listen(PORT, () => {
  const ip = getLocalIP();
  console.log(`Servidor rodando em http://${ip}:${PORT}`);
});
