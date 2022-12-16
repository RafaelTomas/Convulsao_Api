import express, { Request, Response } from "express";
import Transmissora from "./Transmissora";

const transmissora = new Transmissora();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/status', (req: Request, res: Response) => {
   return res.send({
    qr_code: transmissora.qrCode,
    conectado: transmissora.isConnected,
    bateria: transmissora.Bateria}
    )
 });

app.post('/send', async (req: Request, res: Response) => {
  const { menssagem, numero } = req.body;
  try {
    await transmissora.sendText(numero, menssagem);
    return res.status(200).json({ message: "A mensagem foi enviada"});

  } catch (error) {
    res.status(500).json({status: "error", message: error});
  }
});

app.listen(5000, () => console.log('Server started'))