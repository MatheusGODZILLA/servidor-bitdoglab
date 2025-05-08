async function buscarStatus() {
    try {
      const resposta = await fetch('/status');
      if (!resposta.ok) throw new Error("Erro na requisição");
  
      const dados = await resposta.json();
      document.getElementById("botao").textContent = dados.botao;
      document.getElementById("temperatura").textContent =
        dados.temperatura !== null ? dados.temperatura.toFixed(2) : "Desconhecida";
      document.getElementById("joystick-x").textContent = dados.joystick?.x ?? "N/A";
      document.getElementById("joystick-y").textContent = dados.joystick?.y ?? "N/A";

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
  