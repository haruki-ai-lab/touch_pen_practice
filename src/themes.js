(() => {
  "use strict";

  const themes = [
    {
      id: "train",
      label: "でんしゃ",
      title: "でんしゃ",
      place: "せんろ",
      startText: "しゅっぱつ",
      worldClass: "world-train",
      accent: "#2563eb",
      land: "#eaf6ff",
      road: {
        edge: "#64748b",
        base: "#e2e8f0",
        center: "#94a3b8",
        width: 76,
        edgeWidth: 98,
        centerWidth: 9,
        dash: "12 18"
      }
    },
    {
      id: "car",
      label: "くるま",
      title: "くるま",
      place: "どうろ",
      startText: "スタート",
      worldClass: "world-car",
      accent: "#dc6b21",
      land: "#fff7ed",
      road: {
        edge: "#374151",
        base: "#687383",
        center: "#fef3c7",
        width: 78,
        edgeWidth: 96,
        centerWidth: 8,
        dash: "34 30"
      }
    },
    {
      id: "animal",
      label: "どうぶつ",
      title: "どうぶつ",
      place: "くさのみち",
      startText: "いこう",
      worldClass: "world-animal",
      accent: "#15803d",
      land: "#f0fdf4",
      road: {
        edge: "#86efac",
        base: "#d8b47a",
        center: "#fef3c7",
        width: 78,
        edgeWidth: 108,
        centerWidth: 7,
        dash: "10 22"
      }
    },
    {
      id: "dino",
      label: "きょうりゅう",
      title: "きょうりゅう",
      place: "ジャングルのみち",
      startText: "すすもう",
      worldClass: "world-dino",
      accent: "#4d7c0f",
      land: "#ecfccb",
      road: {
        edge: "#65a30d",
        base: "#b77935",
        center: "#fde68a",
        width: 82,
        edgeWidth: 114,
        centerWidth: 8,
        dash: "12 20"
      }
    }
  ];

  window.SEN_THEMES = themes;
  window.SEN_THEME_MAP = new Map(themes.map((theme) => [theme.id, theme]));
})();
