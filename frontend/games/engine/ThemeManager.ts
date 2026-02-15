import { CalmTheme } from "../themes/calm";
import { FunTheme } from "../themes/fun";

class ThemeManager {
  private theme = CalmTheme;

  setTheme(id: string) {
    if (id === "fun") this.theme = FunTheme;
    else this.theme = CalmTheme;
  }

  getTheme() {
    return this.theme;
  }
}

export default new ThemeManager();
