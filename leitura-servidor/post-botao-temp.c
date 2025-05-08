#include "pico/stdlib.h"
#include "hardware/adc.h"
#include "pico/cyw43_arch.h"
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "lwip/ip_addr.h"
#include "lwip/tcp.h"

// Definições de Wi-Fi
#define WIFI_SSID ""
#define WIFI_PASSWORD ""

#define BUTTON_A 5

// IP do servidor (ajuste conforme sua rede)
#define SERVER_IP ""
#define SERVER_PORT 3000

volatile bool button_a_status = true;
volatile float temperature = 0.0f;
volatile uint16_t joystick_x = 0;
volatile uint16_t joystick_y = 0;

// Callback para quando o servidor envia uma resposta
err_t post_response(void *arg, struct tcp_pcb *pcb, struct pbuf *p, err_t err) {
    if (p != NULL) {
        printf("Resposta do servidor recebida\n");
        tcp_recved(pcb, p->tot_len);
        pbuf_free(p);
    }
    tcp_close(pcb);
    return ERR_OK;
}

static void enviar_post_para_servidor() {
    struct tcp_pcb *pcb = tcp_new();
    if (!pcb) {
        printf("Erro ao criar PCB TCP\n");
        return;
    }

    ip_addr_t server_ip;
    ipaddr_aton(SERVER_IP, &server_ip);

    err_t err = tcp_connect(pcb, &server_ip, SERVER_PORT, NULL);
    if (err != ERR_OK) {
        printf("Erro ao conectar ao servidor\n");
        tcp_abort(pcb);
        return;
    }

    char json[128];
    snprintf(json, sizeof(json),
             "{\"botao\":\"%s\",\"temperatura\":%.2f,\"joystick\":{\"x\":%d,\"y\":%d}}",
             button_a_status ? "solto" : "pressionado",
             temperature,
             joystick_x, joystick_y);

    char requisicao[512];
    snprintf(requisicao, sizeof(requisicao),
             "POST /update HTTP/1.1\r\n"
             "Host: %s:%d\r\n"
             "Content-Type: application/json\r\n"
             "Content-Length: %d\r\n"
             "Connection: close\r\n"
             "\r\n"
             "%s",
             SERVER_IP, SERVER_PORT, strlen(json), json);

    tcp_recv(pcb, post_response); // Define o callback para resposta
    err = tcp_write(pcb, requisicao, strlen(requisicao), TCP_WRITE_FLAG_COPY);
    if (err != ERR_OK) {
        printf("Erro ao enviar dados: %d\n", err);
        tcp_abort(pcb);
        return;
    }

    tcp_output(pcb);
    printf("POST enviado: %s\n", json);
}

int main() {
    stdio_init_all();

    // Inicializa Wi-Fi
    if (cyw43_arch_init())
    {
        printf("Erro ao iniciar Wi-Fi\n");
        return -1;
    }

    cyw43_arch_enable_sta_mode();

    printf("Conectando ao Wi-Fi...\n");
    if (cyw43_arch_wifi_connect_timeout_ms(WIFI_SSID, WIFI_PASSWORD, CYW43_AUTH_WPA2_AES_PSK, 30000))
    {
        printf("Falha ao conectar\n");
        return -1;
    }

    printf("Conectado!\n");

    // Inicializa botão e ADC
    gpio_init(BUTTON_A);
    gpio_set_dir(BUTTON_A, GPIO_IN);
    gpio_pull_up(BUTTON_A);

    adc_init();
    adc_set_temp_sensor_enabled(true);
    adc_gpio_init(26); // Y
    adc_gpio_init(27); // X


    while (true) {
        cyw43_arch_poll();

        // Lê botão
        button_a_status = gpio_get(BUTTON_A);

        // Lê temperatura
        adc_select_input(4);
        uint16_t raw = adc_read();
        const float conversion = 3.3f / (1 << 12);
        temperature = 27.0f - ((raw * conversion) - 0.706f) / 0.001721f;

        // Lê joystick
        adc_select_input(1); // Canal 1 → X
        int raw_x = adc_read();
        joystick_x = ((int)raw_x - 2048 * 100 / 2048);

        adc_select_input(0); // Canal 0 → Y
        int raw_y = adc_read();
        joystick_y = ((int)raw_y - 2048 * 100 / 2048);

        enviar_post_para_servidor();

        sleep_ms(1000);
    }

    cyw43_arch_deinit();
    return 0;
}
