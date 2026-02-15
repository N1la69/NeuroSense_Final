import { CalmTheme } from "../themes/calm";
import { FunTheme } from "../themes/fun";

class ThemeManager {
  private theme = CalmTheme;

  setTheme(mode: "calm" | "fun") {
    if (mode === "fun") this.theme = FunTheme;
    else this.theme = CalmTheme;
  }

  getTheme() {
    return this.theme;
  }
}

export default new ThemeManager();
