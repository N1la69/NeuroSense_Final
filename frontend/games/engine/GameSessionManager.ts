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

      const confidence = live?.model_confidence ?? 0;
      const quality = live?.signal_quality ?? 0;
      const engagement = live?.engagement ?? 0;

      // Combine multiple neural reliability signals
      const combined = confidence * quality * (0.5 + engagement);

      // Scale for 1-channel EEG
      let normalized = combined * 8;

      normalized = Math.max(0, Math.min(100, normalized));

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
