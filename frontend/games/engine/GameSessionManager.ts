import {
  startSessionForChild,
  stopSession,
  getLiveInterpreted,
} from "@/utils/api";
import { getChild } from "@/utils/storage";

class GameSessionManager {
  private sessionActive = false;
  private gameName = "";

  async start(gameName: string) {
    const childId = await getChild();

    if (!childId) throw new Error("Child not selected");

    this.gameName = gameName;

    const res = await startSessionForChild(childId, gameName);

    this.sessionActive = true;

    return res;
  }

  async stop() {
    if (!this.sessionActive) return;

    const res = await stopSession();

    this.sessionActive = false;

    return res;
  }

  async getAttention(): Promise<number> {
    if (!this.sessionActive) return 0;

    const live = await getLiveInterpreted();

    return live?.attention_index ?? 0;
  }

  isActive() {
    return this.sessionActive;
  }
}

export default new GameSessionManager();
