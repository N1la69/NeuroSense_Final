import {
  startSessionForChild,
  stopSession,
  getLiveInterpreted,
} from "@/utils/api";
import { getChild } from "@/utils/storage";

class GameSessionManager {
  private active = false;
  private gameName = "";

  // smoothing
  private smoothed = 0;

  // adaptive normalization range
  private minSeen = Infinity;
  private maxSeen = -Infinity;

  private initialized = false;

  async start(gameName: string) {
    if (this.active) return;

    const childId = await getChild();

    if (!childId) {
      throw new Error("No child selected");
    }

    this.gameName = gameName;

    await startSessionForChild(childId, gameName);

    this.active = true;

    // reset normalization state
    this.smoothed = 0;
    this.minSeen = Infinity;
    this.maxSeen = -Infinity;
    this.initialized = false;
  }

  async stop() {
    if (!this.active) return;

    await stopSession();

    this.active = false;
  }

  async getAttention(): Promise<number> {
    if (!this.active) return 50;

    try {
      const live = await getLiveInterpreted();

      const raw = live?.model_confidence ?? 0;

      // simple stable scaling for 1-channel EEG
      const normalized = Math.max(0, Math.min(100, raw * 8));

      return normalized;
    } catch {
      return 50;
    }
  }

  isActive() {
    return this.active;
  }
}

export default new GameSessionManager();
