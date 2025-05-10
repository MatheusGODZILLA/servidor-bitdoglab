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
  const zonaMorta = 25;
  const magnitude = Math.sqrt(x * x + y * y);
  if (magnitude < zonaMorta) return "Centro";

  const anguloRad = Math.atan2(y, x);
  const anguloGraus = (anguloRad * 180 / Math.PI + 360) % 360;

  if (anguloGraus >= 337.5 || anguloGraus < 22.5) return "Leste";
  if (anguloGraus >= 22.5 && anguloGraus < 67.5) return "Nordeste";
  if (anguloGraus >= 67.5 && anguloGraus < 112.5) return "Norte";
  if (anguloGraus >= 112.5 && anguloGraus < 157.5) return "Noroeste";
  if (anguloGraus >= 157.5 && anguloGraus < 202.5) return "Oeste";
  if (anguloGraus >= 202.5 && anguloGraus < 247.5) return "Sudoeste";
  if (anguloGraus >= 247.5 && anguloGraus < 292.5) return "Sul";
  if (anguloGraus >= 292.5 && anguloGraus < 337.5) return "Sudeste";

  return "Indefinido";
}

let statusAtual = {
    botao: "desconhecido",
    temperatura: null,
    joystick: {
        x: 0,
        y: 0,
    },
    direcao: "Centro"
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
