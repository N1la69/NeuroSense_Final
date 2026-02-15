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

      // initialize smoothing
      if (!this.initialized) {
        this.smoothed = raw;
        this.minSeen = raw;
        this.maxSeen = raw;
        this.initialized = true;
        return 50;
      }

      // exponential smoothing (stable but responsive)
      this.smoothed = 0.9 * this.smoothed + 0.1 * raw;

      // update dynamic range
      this.minSeen = Math.min(this.minSeen, this.smoothed);
      this.maxSeen = Math.max(this.maxSeen, this.smoothed);

      const range = this.maxSeen - this.minSeen;

      // avoid division instability during first seconds
      if (range < 0.5) {
        return 50;
      }

      // normalize within observed personal range
      let normalized = ((this.smoothed - this.minSeen) / range) * 100;

      // clamp
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
