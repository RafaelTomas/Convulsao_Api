import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import { Whatsapp, create, Message, SocketState, } from 'venom-bot';

export type QRCode = {
  base64Qr: string
  asciiQR: string
}

class Transmissora {
  private cliente: Whatsapp;
  private connected = false;
  private qr: QRCode;

  constructor() {
    this.inicializar();
  }

  get isConnected(): boolean {
    return this.connected;
  }

  get qrCode(): QRCode {
    return this.qr;
  }

  async sendText(to: string, body: string) {
    if (!isValidPhoneNumber(to, "BR")) throw new Error("So e valido numeros BR");

    var numeroCelular = parsePhoneNumber(to, "BR")?.format("E.164")?.replace("+", "") as string;
    var numeroCelular = numeroCelular.includes("@c.us") ? numeroCelular : `${numeroCelular}@c.us`;

    await this.cliente.sendText(numeroCelular, body)
  }

  private start(cliente: Whatsapp) {
    this.cliente = cliente;
    cliente.onStateChange((state) => {
      this.connected = state === SocketState.CONNECTED
    })
  };

  public Bateria(cliente: Whatsapp) {
    cliente.getBatteryLevel()
  }

  private inicializar() {
    const qr = (base64Qr: string, asciiQR: string) => {
      this.qr = { base64Qr, asciiQR }
    };
    const status = (statusSession: string) => {
      this.connected = ["isLogged", "qrReadSuccess", "chatAvailable"].includes(statusSession)
    };
    create('Alerta-Convulsão', qr, status)
      .then((cliente) => this.start(cliente))
      .catch((err) => console.error(err))
  };
}

export default Transmissora;