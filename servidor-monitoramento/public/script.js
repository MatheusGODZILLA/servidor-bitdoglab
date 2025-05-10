function atualizarBotao(status) {
  const el = document.getElementById("botao");
  el.textContent = status;

  el.style.backgroundColor = status === "pressionado" ? "#d9534f" : "#5cb85c";
  el.style.color = "white";
}

const direcoesParaAngulo = {
  "Norte": 0,
  "Nordeste": 45,
  "Leste": 90,
  "Sudeste": 135,
  "Sul": 180,
  "Sudoeste": 225,
  "Oeste": 270,
  "Noroeste": 315,
  "Centro": 0,
  "Indefinido": 0
};

function destacarDirecao(direcao) {
  const direcoes = [
    "norte", "sul", "leste", "oeste",
    "nordeste", "noroeste", "sudeste", "sudoeste", "centro"
  ];

  direcoes.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("ativo");
  });

  const dirMap = {
    "Norte": "norte",
    "Sul": "sul",
    "Leste": "leste",
    "Oeste": "oeste",
    "Nordeste": "nordeste",
    "Noroeste": "noroeste",
    "Sudeste": "sudeste",
    "Sudoeste": "sudoeste",
    "Centro": "centro"
  };

  const id = dirMap[direcao] || null;
  if (id) {
    const ativo = document.getElementById(id);
    if (ativo) ativo.classList.add("ativo");
  }
}


async function buscarStatus() {
    try {
      const resposta = await fetch('/status');
      if (!resposta.ok) throw new Error("Erro na requisição");
  
      const dados = await resposta.json();
      atualizarBotao(dados.botao);
      document.getElementById("temperatura").textContent =
        dados.temperatura !== null ? dados.temperatura.toFixed(2) : "Desconhecida";
      document.getElementById("joystick-x").textContent = dados.joystick?.x ?? "N/A";
      document.getElementById("joystick-y").textContent = dados.joystick?.y ?? "N/A";
      document.getElementById("direcao").textContent = dados.direcao || "Indefinido";
      destacarDirecao(dados.direcao);

    } catch (erro) {
      console.error("Erro ao buscar dados:", erro);
      document.getElementById("botao").textContent = "Erro";
      document.getElementById("temperatura").textContent = "Erro";
      document.getElementById("joystick-x").textContent = "Erro";
      document.getElementById("joystick-y").textContent = "Erro";
    }
  }
  
  // Atualiza a cada 1 segundo
  setInterval(buscarStatus, 1000);
  