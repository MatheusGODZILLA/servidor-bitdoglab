## 📡 BitDogLab - Monitoramento com IoT

Este projeto foi desenvolvido como parte da **Tarefa Prática da Unidade 2 de IoT** do curso de Análise e Desenvolvimento de Sistemas no **Instituto Federal do Piauí – Campus Picos**.

O sistema realiza o monitoramento em tempo real dos sensores da placa **BitDogLab**, utilizando Wi-Fi para enviar os dados a um servidor local implementado com **Node.js e Express**, com exibição visual em uma interface web.

---

### 🔧 Funcionalidades

* Leitura do **botão A**
* Leitura da **temperatura interna do microcontrolador RP2040**
* Leitura da posição do **joystick (X e Y)**
* Cálculo da direção baseada no joystick e exibição em uma **rosa dos ventos interativa**
* Comunicação com servidor via **HTTP POST (JSON)**
* Interface web responsiva com **HTML, CSS e JavaScript**

---

### 📡 Comunicação entre placa e servidor

* A placa lê os dados a cada 1 segundo
* Os dados são enviados para o servidor via `POST /update`
* O servidor armazena e distribui os dados pela rota `GET /status`
* A interface web consome esses dados e exibe os valores com destaque visual

---

### 💻 Tecnologias utilizadas

* **Placa BitDogLab (RP2040 + Wi-Fi)**
* **C/C++ (Pico SDK, lwIP, cyw43\_arch)**
* **Node.js + Express**
* **HTML + CSS + JavaScript (frontend puro)**

---

### 📌 Requisitos

* Placa BitDogLab com firmware gravado
* Node.js instalado na máquina
* Conexão Wi-Fi local (ambos os dispositivos devem estar na mesma rede)

---

### 🚀 Como executar

1. Clone o repositório:

   ```bash
   git clone https://github.com/MatheusGODZILLA/servidor-bitdoglab
   ```

2. Acesse o diretório `servidor-monitoramento/` e instale as dependências:

   ```bash
   cd servidor-monitoramento
   npm install
   node server.js
   ```

3. Compile e grave o firmware da pasta `leitura-servidor/` na sua placa BitDogLab com as credenciais da sua rede Wi-Fi.

4. Acesse a interface web via navegador:

   ```
   http://<IP_da_sua_máquina>:3000
   ```
   Esse é o mesmo IP que irá no código da placa
