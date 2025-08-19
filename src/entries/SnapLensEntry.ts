// Importe o CSS (Vite vai injetar em dev)
import "../views/styles/snap-lens.css";

import { SnapLensView } from "../views/SnapLensView";
import { SnapLensController } from "../controllers/SnapLensController";
import { getDefaultCamera } from "../config/CameraKitConfig";

console.log("SnapLensEntry carregado");


window.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1) Busca as configurações iniciais
    const settings = await getDefaultCamera();

    // 2) Cria a view (ela monta o <canvas> internamente)
    const view = new SnapLensView(settings);

    // 3) Passa a view para o controller, que faz todo o resto
    new SnapLensController(view);

  } catch (error) {
    console.error("Falha na inicialização:", error);
    alert("Erro ao iniciar a câmera. Verifique as permissões e recarregue.");
  }
});
