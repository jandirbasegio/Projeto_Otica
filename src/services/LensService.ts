//LensService
import { CameraKit, CameraKitSession, Lens } from "@snap/camera-kit";
import { LENS_GROUP_ID, DEBUG } from "../config/CameraKitConfig";

export class LensService {
  private lenses: Lens[] = [];
  private currentIndex = 0;

  constructor(private readonly cameraKit: CameraKit) { }

  async loadLenses(): Promise<void> {
    try {
      const result = await this.cameraKit.lensRepository.loadLensGroups([LENS_GROUP_ID]);
      this.lenses = result.lenses;

      if (DEBUG) {
        console.log('[DEBUG] Lentes carregadas:', {
          total: this.lenses.length,
          lenses: this.lenses.map(l => ({
            id: l.id,
            name: l.name,
            index: this.lenses.indexOf(l)
          }))
        });
      }
    } catch (error) {
      throw new Error(`Failed to load lenses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getThumbnails(): string[] {
    return this.lenses.map(lens => lens.iconUrl || this.defaultThumbnail);
  }

  async applyLens(session: CameraKitSession, index: number): Promise<boolean> {
    if (!this.lenses[index]) throw new Error('Lens not found');
    this.currentIndex = index;

    if (DEBUG) {
      console.log('[DEBUG] Aplicando lente:', {
        index: this.currentIndex,
        lensId: this.lenses[this.currentIndex].id,
        lensName: this.lenses[this.currentIndex].name
      });
    }

    return session.applyLens(this.lenses[index]);
  }

  navigate(direction: 'prev' | 'next'): number {
    this.currentIndex = direction === 'prev'
      ? (this.currentIndex - 1 + this.lenses.length) % this.lenses.length
      : (this.currentIndex + 1) % this.lenses.length;

    if (DEBUG) {
      console.log(`[DEBUG] Lente atual: ${this.currentIndex + 1}/${this.lenses.length} (${direction})`);
    }

    return this.currentIndex;
  }

  private get defaultThumbnail(): string {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  }
}