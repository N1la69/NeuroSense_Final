import {
  startSessionForChild,
  stopSession,
  getLiveInterpreted,
} from "@/utils/api";
import { getChild } from "@/utils/storage";

class GameSessionManager {
  private active = false;
  private gameName = "";

  private baseline = 0;
  private initialized = false;

  private smoothed = 0;

  async start(gameName: string) {
    if (this.active) return;

    const childId = await getChild();

    if (!childId) {
      throw new Error("No child selected");
    }

    this.gameName = gameName;

    await startSessionForChild(childId, gameName);
    this.active = true;
    this.initialized = false;
    this.smoothed = 0;
  }

  async stop() {
    if (!this.active) return;

    await stopSession();

    this.active = false;
  }

  async getAttention(): Promise<number> {
    if (!this.active) return 0;

    try {
      const live = await getLiveInterpreted();

      const raw = live?.model_confidence ?? 0;

      if (!this.initialized) {
        this.baseline = raw;
        this.smoothed = raw;
        this.initialized = true;

        return 50;
      }

      this.smoothed = 0.8 * this.smoothed + 0.2 * raw;
      const delta = this.smoothed - this.baseline;
      let normalized = 50 + delta * 10;
      normalized = Math.max(0, Math.min(100, normalized));

      return normalized;
    } catch {
      return 0;
    }
  }

  isActive() {
    return this.active;
  }
}

export default new GameSessionManager();
