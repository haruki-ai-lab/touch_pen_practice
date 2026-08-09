(() => {
  "use strict";

  const VIEW_WIDTH = 1000;
  const VIEW_HEIGHT = 560;
  const STORAGE_KEY = "sen_no_bouken_v1";
  const root = document.querySelector("#app");
  const themes = window.SEN_THEMES;
  const courses = window.SEN_COURSES;
  const themeMap = window.SEN_THEME_MAP;
  const courseMap = window.SEN_COURSE_MAP;
  const kanjiCourses = window.SEN_KANJI_COURSES || [];
  const kanjiCourseMap = window.SEN_KANJI_COURSE_MAP || new Map();
  const difficulties = [
    {
      id: "easy",
      label: "かんたん",
      shortLabel: "はじめて",
      description: "みちの近くを通って、ゴールをめざそう。"
    },
    {
      id: "normal",
      label: "ふつう",
      shortLabel: "ていねいに",
      description: "まんなかを、もどらずに進もう。"
    },
    {
      id: "hard",
      label: "むずかしい",
      shortLabel: "ちょうせん",
      description: "まんなかを、ゆっくり正確に進もう。"
    }
  ];
  const difficultyMap = new Map(difficulties.map((difficulty) => [difficulty.id, difficulty]));

  const state = {
    screen: "home",
    themeId: "train",
    courseId: "straight",
    courseMode: "line",
    difficultyId: "easy",
    lastResult: null,
    bestScores: {},
    history: [],
    kanjiRun: null
  };

  let currentGame = null;

  function loadSavedState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (themeMap.has(saved.themeId)) state.themeId = saved.themeId;
      if (saved.courseMode === "kanji" && kanjiCourses.length) state.courseMode = "kanji";
      if (state.courseMode === "kanji") {
        state.courseId = kanjiCourseMap.has(saved.courseId) ? saved.courseId : kanjiCourses[0].id;
      } else if (courseMap.has(saved.courseId)) {
        state.courseId = saved.courseId;
      }
      if (difficultyMap.has(saved.difficultyId)) state.difficultyId = saved.difficultyId;
      if (Array.isArray(saved.history)) state.history = saved.history.slice(-100);
      if (saved.bestScores && typeof saved.bestScores === "object") {
        state.bestScores = { ...saved.bestScores };
      }
      state.history.forEach((entry) => {
        if (!entry || !entry.courseId || typeof entry.score !== "number") return;
        const difficultyId = difficultyMap.has(entry.difficultyId) ? entry.difficultyId : "easy";
        const key = bestScoreKey(entry.courseId, difficultyId);
        state.bestScores[key] = Math.max(bestForCourse(entry.courseId, difficultyId), entry.score);
      });
    } catch {
      state.history = [];
      state.bestScores = {};
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      themeId: state.themeId,
      courseId: state.courseId,
      courseMode: state.courseMode,
      difficultyId: state.difficultyId,
      bestScores: state.bestScores,
      history: state.history.slice(-100)
    }));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function attr(value) {
    return escapeHtml(value);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function average(values) {
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function currentTheme() {
    return themeMap.get(state.themeId) || themes[0];
  }

  function currentCourse() {
    if (state.courseMode === "kanji" && kanjiCourses.length) {
      return kanjiCourseMap.get(state.courseId) || kanjiCourses[0];
    }
    return courseMap.get(state.courseId) || courses[0];
  }

  function currentCourseList() {
    return state.courseMode === "kanji" ? kanjiCourses : courses;
  }

  function isKanjiMode() {
    return state.courseMode === "kanji";
  }

  function courseModeLabel() {
    return isKanjiMode() ? "かんじへのみち" : "せんのコース";
  }

  function currentDifficulty() {
    return difficultyMap.get(state.difficultyId) || difficulties[0];
  }

  function bestScoreKey(courseId, difficultyId = state.difficultyId) {
    return `${difficultyId}:${courseId}`;
  }

  function bestForCourse(courseId, difficultyId = state.difficultyId) {
    const value = state.bestScores[bestScoreKey(courseId, difficultyId)];
    if (typeof value === "number") return value;

    // v1の記録はコースIDだけで保存していたため、「かんたん」の記録として引き継ぐ。
    if (difficultyId === "easy" && typeof state.bestScores[courseId] === "number") {
      return state.bestScores[courseId];
    }
    return 0;
  }

  function bestOverall(difficultyId = state.difficultyId) {
    const scores = currentCourseList().map((course) => bestForCourse(course.id, difficultyId)).filter((value) => value > 0);
    return scores.length ? Math.max(...scores) : 0;
  }

  function scoreTitle(score) {
    if (score >= 95) return "すごい";
    if (score >= 85) return "よくできました";
    if (score >= 70) return "いいかんじ";
    if (score >= 50) return "もうすこし";
    return "もういちどやってみよう";
  }

  function render() {
    currentGame = null;
    const theme = currentTheme();
    root.className = `app ${theme.worldClass}`;

    if (state.screen === "home") {
      root.innerHTML = renderHome(theme);
    } else if (state.screen === "character") {
      root.innerHTML = renderCharacterSelect();
    } else if (state.screen === "course") {
      root.innerHTML = renderCourseSelect();
    } else if (state.screen === "play") {
      const course = currentCourse();
      if (isKanjiMode()) ensureKanjiRun(course);
      root.innerHTML = renderPlay(theme, course);
      setupGame();
    } else if (state.screen === "result") {
      root.innerHTML = renderResult(theme, currentCourse(), state.lastResult);
    }
    if (typeof window.scrollTo === "function") window.scrollTo(0, 0);
  }

  function renderHome(theme) {
    const difficulty = currentDifficulty();
    const best = bestOverall();

    return `
      <main class="screen home-screen">
        <section class="home-copy">
          <p class="eyebrow">タッチペンれんしゅう</p>
          <h1>せんのぼうけん</h1>
          <p class="lead">みちをなぞって、${escapeHtml(theme.title)}をゴールまでつれていこう。</p>
          <fieldset class="difficulty-picker">
            <legend>むずかしさを えらぼう</legend>
            <div class="difficulty-options">
              ${difficulties.map((item) => `
                <button class="difficulty-button ${item.id === state.difficultyId ? "selected" : ""}" type="button" data-action="select-difficulty" data-difficulty="${attr(item.id)}" aria-pressed="${item.id === state.difficultyId}">
                  <span>${escapeHtml(item.shortLabel)}</span>
                  <strong>${escapeHtml(item.label)}</strong>
                  <small>${escapeHtml(item.description)}</small>
                </button>
              `).join("")}
            </div>
          </fieldset>
          <div class="quick-row" aria-label="現在の選択">
            <span>${characterBadge(theme.id)} ${escapeHtml(theme.label)}</span>
            <span>${escapeHtml(courseModeLabel())}</span>
            <span>${escapeHtml(currentCourse().label)}</span>
            <span>${escapeHtml(difficulty.label)}・最高 ${best}点</span>
          </div>
          <div class="actions">
            <button class="primary" type="button" data-action="start">はじめる</button>
            <button class="secondary" type="button" data-action="quick-play">すぐあそぶ</button>
          </div>
        </section>
        <section class="home-preview" aria-hidden="true">
          ${previewAdventure(theme, currentCourse())}
        </section>
      </main>
    `;
  }

  function renderCharacterSelect() {
    return `
      <main class="screen">
        ${topBar("キャラをえらぶ", "home")}
        <section class="choice-grid character-grid">
          ${themes.map((theme) => `
            <button class="choice-card ${theme.id === state.themeId ? "selected" : ""}" type="button" data-action="select-theme" data-theme="${attr(theme.id)}">
              ${characterBadge(theme.id)}
              <strong>${escapeHtml(theme.label)}</strong>
              <span>${escapeHtml(theme.place)}をすすむ</span>
            </button>
          `).join("")}
        </section>
      </main>
    `;
  }

  function renderCourseSelect() {
    const theme = currentTheme();
    const difficulty = currentDifficulty();
    const activeCourses = currentCourseList();
    return `
      <main class="screen">
        ${topBar("コースをえらぶ", "character")}
        <nav class="course-mode-switch" aria-label="コースのしゅるい">
          <button class="${state.courseMode === "line" ? "selected" : ""}" type="button" data-action="select-course-mode" data-mode="line" aria-pressed="${state.courseMode === "line"}">
            <strong>せんのコース</strong>
            <span>ペンをはなさずに進む・全${courses.length}コース</span>
          </button>
          <button class="${state.courseMode === "kanji" ? "selected" : ""}" type="button" data-action="select-course-mode" data-mode="kanji" aria-pressed="${state.courseMode === "kanji"}">
            <strong>かんじへのみち</strong>
            <span>一画ずつ書いてペンをはなす・全${kanjiCourses.length}コース</span>
          </button>
        </nav>
        <section class="course-summary">
          <strong>${escapeHtml(difficulty.label)}・全${activeCourses.length}コース</strong>
          <span>難易度ごと、コースごとに最高得点を記録します。</span>
        </section>
        <section class="choice-grid course-grid">
          ${isKanjiMode() ? renderKanjiCourseCards(theme) : renderLineCourseCards(theme)}
        </section>
      </main>
    `;
  }

  function renderLineCourseCards(theme) {
    return courses.map((course) => {
      const best = bestForCourse(course.id);
      return `
        <button class="choice-card course-card ${course.id === state.courseId ? "selected" : ""}" type="button" data-action="select-course" data-course="${attr(course.id)}">
          <svg class="course-mini" viewBox="0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}" preserveAspectRatio="none" aria-hidden="true">
            <path d="${attr(course.path)}" fill="none" stroke="${attr(theme.road.edge)}" stroke-width="90" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="${attr(course.path)}" fill="none" stroke="${attr(theme.road.base)}" stroke-width="66" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <em>${escapeHtml(course.level)}</em>
          <strong>${escapeHtml(course.label)}</strong>
          <span>${escapeHtml(course.skill)}</span>
          <small class="course-best">${best ? `最高 ${best}点` : "未挑戦"}</small>
        </button>
      `;
    }).join("");
  }

  function renderKanjiCourseCards(theme) {
    return kanjiCourses.map((course) => {
      const best = bestForCourse(course.id);
      return `
        <button class="choice-card course-card kanji-course-card ${course.id === state.courseId ? "selected" : ""}" type="button" data-action="select-course" data-course="${attr(course.id)}">
          ${kanjiCoursePreview(theme, course, "course-mini")}
          <em>${escapeHtml(course.level)}</em>
          <strong class="kanji-card-title">${escapeHtml(course.label)}</strong>
          <span>${escapeHtml(course.reading)}・${escapeHtml(course.skill)}</span>
          <small class="course-best">${best ? `最高 ${best}点` : "未挑戦"}</small>
        </button>
      `;
    }).join("");
  }

  function kanjiCoursePreview(theme, course, className) {
    return `
      <svg class="${attr(className)} kanji-mini" viewBox="0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}" preserveAspectRatio="none" aria-hidden="true">
        ${course.strokes.map((stroke, index) => `
          <path d="${attr(stroke.path)}" fill="none" stroke="${attr(theme.road.edge)}" stroke-width="72" stroke-linecap="round" stroke-linejoin="round" opacity="${index === 0 ? "1" : ".45"}"></path>
          <path d="${attr(stroke.path)}" fill="none" stroke="${attr(theme.road.base)}" stroke-width="50" stroke-linecap="round" stroke-linejoin="round" opacity="${index === 0 ? "1" : ".6"}"></path>
          <circle cx="${stroke.start.x}" cy="${stroke.start.y}" r="28" class="kanji-mini-number"></circle>
          <text x="${stroke.start.x}" y="${stroke.start.y + 9}" class="kanji-mini-number-text">${index + 1}</text>
        `).join("")}
      </svg>
    `;
  }

  function renderPlay(theme, course) {
    if (isKanjiMode()) return renderKanjiPlay(theme, course);
    const difficulty = currentDifficulty();
    return `
      <main class="play-screen">
        <header class="play-header">
          <button class="ghost" type="button" data-action="course">コース</button>
          <div>
            <p>${escapeHtml(difficulty.label)} / ${escapeHtml(theme.label)} / ${escapeHtml(theme.place)}</p>
            <h1>${escapeHtml(course.label)}</h1>
          </div>
          <button class="ghost" type="button" data-action="restart">やりなおす</button>
        </header>
        <section class="game-wrap">
          <svg id="adventureSvg" class="adventure-svg" viewBox="0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}" preserveAspectRatio="none" role="img" aria-label="${attr(course.label)}をなぞる">
            <rect width="${VIEW_WIDTH}" height="${VIEW_HEIGHT}" fill="${attr(theme.land)}"></rect>
            ${decorations(theme.id)}
            ${roadMarkup(theme, course)}
            <circle class="start-ring" cx="${course.start.x}" cy="${course.start.y}" r="52"></circle>
            <circle class="goal-ring" cx="${course.end.x}" cy="${course.end.y}" r="48"></circle>
            <text class="route-label start-label" x="${course.start.x}" y="${course.start.y - 70}">${escapeHtml(theme.startText)}</text>
            <text class="route-label goal-label" x="${course.end.x}" y="${course.end.y - 64}">ゴール</text>
            ${course.stops.map((stop) => `
              <g class="stop-marker">
                <circle cx="${stop.x}" cy="${stop.y}" r="35"></circle>
                <text x="${stop.x}" y="${stop.y + 8}">${escapeHtml(stop.label)}</text>
              </g>
            `).join("")}
            <polyline id="traceGlow" class="trace-glow" points=""></polyline>
            <polyline id="traceLine" class="trace-line" points=""></polyline>
            <g id="heroMarker" class="hero-marker">
              ${characterGroup(theme.id)}
            </g>
          </svg>
        </section>
        <footer class="play-footer">
          <div class="progress-shell" aria-label="すすみぐあい">
            <div id="progressBar" class="progress-bar"></div>
          </div>
          <p id="playHint">スタートの近くにペンを置いて、みちをなぞろう。</p>
        </footer>
      </main>
    `;
  }

  function renderKanjiPlay(theme, course) {
    const difficulty = currentDifficulty();
    const run = state.kanjiRun;
    const strokeIndex = run.strokeIndex;
    const stroke = course.strokes[strokeIndex];
    const strokeNumber = strokeIndex + 1;
    const strokeCount = course.strokes.length;
    const progressStart = Math.round(strokeIndex / strokeCount * 100);

    return `
      <main class="play-screen kanji-play-screen">
        <header class="play-header">
          <button class="ghost" type="button" data-action="course">コース</button>
          <div>
            <p>${escapeHtml(difficulty.label)} / ${escapeHtml(theme.label)} / かんじへのみち</p>
            <h1><span class="kanji-play-title">${escapeHtml(course.label)}</span> ${escapeHtml(course.reading)}</h1>
          </div>
          <button class="ghost" type="button" data-action="restart">やりなおす</button>
        </header>
        <section class="game-wrap">
          <svg id="adventureSvg" class="adventure-svg" viewBox="0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}" preserveAspectRatio="none" role="img" aria-label="${attr(course.label)}の${strokeNumber}かくめをなぞる">
            <rect width="${VIEW_WIDTH}" height="${VIEW_HEIGHT}" fill="${attr(theme.land)}"></rect>
            ${decorations(theme.id)}
            ${kanjiRoadMarkup(theme, course, strokeIndex)}
            <circle class="start-ring kanji-active-ring" cx="${stroke.start.x}" cy="${stroke.start.y}" r="45"></circle>
            <circle class="goal-ring kanji-active-ring" cx="${stroke.end.x}" cy="${stroke.end.y}" r="43"></circle>
            <text class="kanji-active-number" x="${stroke.start.x}" y="${stroke.start.y + 11}">${strokeNumber}</text>
            <text class="route-label kanji-route-label" x="${stroke.start.x}" y="${stroke.start.y - 58}">${strokeNumber}かくめ</text>
            <text class="route-label kanji-route-label" x="${stroke.end.x}" y="${stroke.end.y - 55}">ここで はなす</text>
            ${stroke.stops.map((stop) => `
              <g class="stop-marker">
                <circle cx="${stop.x}" cy="${stop.y}" r="35"></circle>
                <text x="${stop.x}" y="${stop.y + 8}">${escapeHtml(stop.label)}</text>
              </g>
            `).join("")}
            <polyline id="traceGlow" class="trace-glow" points=""></polyline>
            <polyline id="traceLine" class="trace-line" points=""></polyline>
            <g id="heroMarker" class="hero-marker">
              ${characterGroup(theme.id)}
            </g>
          </svg>
        </section>
        <footer class="play-footer">
          <div class="kanji-stroke-status"><strong>${strokeNumber} / ${strokeCount} かく</strong><span>${escapeHtml(course.skill)}</span></div>
          <div class="progress-shell" aria-label="ぜんたいの すすみぐあい">
            <div id="progressBar" class="progress-bar" style="width:${progressStart}%"></div>
          </div>
          <p id="playHint">${strokeNumber}の丸にペンを置いて、光っている道をなぞろう。</p>
        </footer>
      </main>
    `;
  }

  function kanjiRoadMarkup(theme, course, activeIndex) {
    return course.strokes.map((stroke, index) => {
      const status = index < activeIndex ? "completed" : index === activeIndex ? "active" : "upcoming";
      const edge = status === "completed" ? "#15803d" : status === "active" ? theme.road.edge : "#cbd5e1";
      const base = status === "completed" ? "#86efac" : status === "active" ? theme.road.base : "#f1f5f9";
      const center = status === "completed" ? "#dcfce7" : status === "active" ? theme.road.center : "#cbd5e1";
      const guideId = status === "active" ? " id=\"guidePath\"" : "";
      return `
        <g class="kanji-road kanji-road-${status}">
          <path class="road-edge" d="${attr(stroke.path)}" fill="none" stroke="${attr(edge)}" stroke-width="${theme.road.edgeWidth}" stroke-linecap="round" stroke-linejoin="round"></path>
          <path${guideId} class="road-base" d="${attr(stroke.path)}" fill="none" stroke="${attr(base)}" stroke-width="${theme.road.width}" stroke-linecap="round" stroke-linejoin="round"></path>
          <path class="road-center" d="${attr(stroke.path)}" fill="none" stroke="${attr(center)}" stroke-width="${theme.road.centerWidth}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${attr(theme.road.dash)}"></path>
          <circle class="kanji-stroke-number" cx="${stroke.start.x}" cy="${stroke.start.y}" r="25"></circle>
          <text class="kanji-stroke-number-text" x="${stroke.start.x}" y="${stroke.start.y + 8}">${index + 1}</text>
        </g>
      `;
    }).join("");
  }

  function renderResult(theme, course, result) {
    const difficulty = currentDifficulty();
    const safeResult = result || {
      score: 0,
      bestScore: bestForCourse(course.id),
      previousBest: bestForCourse(course.id),
      isNewBest: false,
      title: "もういちどやってみよう",
      details: ["ペンを置いて、道をなぞろう。"],
      tip: "スタートからゆっくり進むとやりやすいです。"
    };
    const bestScore = Math.max(safeResult.bestScore || 0, safeResult.score || 0);

    return `
      <main class="screen result-screen">
        <section class="result-panel">
          <p class="eyebrow">${escapeHtml(difficulty.label)} / ${escapeHtml(course.label)} / ${escapeHtml(theme.label)}</p>
          <h1>${escapeHtml(safeResult.title)}</h1>
          <div class="score-board" aria-label="今回 ${safeResult.score}点">
            <div class="score-main"><strong>${safeResult.score}</strong><span>点</span></div>
            <div class="score-best ${safeResult.isNewBest ? "new-best" : ""}">
              ${safeResult.isNewBest ? "ベスト更新" : `最高 ${bestScore}点`}
            </div>
          </div>
          <ul class="result-list">
            ${safeResult.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
          </ul>
          <p class="tip">${escapeHtml(safeResult.tip)}</p>
          <div class="actions">
            <button class="primary" type="button" data-action="restart">もういちど</button>
            <button class="secondary" type="button" data-action="next-course">つぎへ</button>
            <button class="secondary" type="button" data-action="course">コース</button>
          </div>
        </section>
      </main>
    `;
  }

  function topBar(title, backAction) {
    return `
      <header class="top-bar">
        <button class="ghost" type="button" data-action="${attr(backAction)}">もどる</button>
        <h1>${escapeHtml(title)}</h1>
        <span></span>
      </header>
    `;
  }

  function previewAdventure(theme, course) {
    if (isKanjiMode()) return previewKanjiAdventure(theme, course);
    return `
      <svg class="preview-svg" viewBox="0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}" preserveAspectRatio="none">
        <rect width="${VIEW_WIDTH}" height="${VIEW_HEIGHT}" fill="${attr(theme.land)}"></rect>
        ${decorations(theme.id)}
        ${roadMarkup(theme, course)}
        <g transform="translate(${course.start.x} ${course.start.y})">${characterGroup(theme.id)}</g>
      </svg>
    `;
  }

  function previewKanjiAdventure(theme, course) {
    const firstStroke = course.strokes[0];
    return `
      <svg class="preview-svg" viewBox="0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}" preserveAspectRatio="none">
        <rect width="${VIEW_WIDTH}" height="${VIEW_HEIGHT}" fill="${attr(theme.land)}"></rect>
        ${decorations(theme.id)}
        ${course.strokes.map((stroke, index) => `
          <path d="${attr(stroke.path)}" fill="none" stroke="${attr(theme.road.edge)}" stroke-width="${theme.road.edgeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="${index === 0 ? "1" : ".45"}"></path>
          <path d="${attr(stroke.path)}" fill="none" stroke="${attr(theme.road.base)}" stroke-width="${theme.road.width}" stroke-linecap="round" stroke-linejoin="round" opacity="${index === 0 ? "1" : ".65"}"></path>
        `).join("")}
        <g transform="translate(${firstStroke.start.x} ${firstStroke.start.y})">${characterGroup(theme.id)}</g>
      </svg>
    `;
  }

  function roadMarkup(theme, course) {
    return `
      <path class="road-edge" d="${attr(course.path)}" fill="none" stroke="${attr(theme.road.edge)}" stroke-width="${theme.road.edgeWidth}" stroke-linecap="round" stroke-linejoin="round"></path>
      <path id="guidePath" class="road-base" d="${attr(course.path)}" fill="none" stroke="${attr(theme.road.base)}" stroke-width="${theme.road.width}" stroke-linecap="round" stroke-linejoin="round"></path>
      <path class="road-center" d="${attr(course.path)}" fill="none" stroke="${attr(theme.road.center)}" stroke-width="${theme.road.centerWidth}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${attr(theme.road.dash)}"></path>
    `;
  }

  function decorations(themeId) {
    if (themeId === "train") {
      return `
        <circle class="deco cloud" cx="150" cy="105" r="34"></circle>
        <circle class="deco cloud" cx="190" cy="98" r="46"></circle>
        <circle class="deco cloud" cx="235" cy="110" r="30"></circle>
        <circle class="deco cloud" cx="760" cy="95" r="38"></circle>
        <circle class="deco cloud" cx="810" cy="88" r="48"></circle>
      `;
    }
    if (themeId === "car") {
      return `
        <rect class="deco town" x="95" y="78" width="54" height="68" rx="6"></rect>
        <rect class="deco town" x="800" y="75" width="72" height="84" rx="6"></rect>
        <rect class="deco town-light" x="112" y="96" width="12" height="12"></rect>
        <rect class="deco town-light" x="827" y="98" width="14" height="14"></rect>
      `;
    }
    if (themeId === "animal") {
      return `
        <circle class="deco tree-top" cx="125" cy="115" r="42"></circle>
        <rect class="deco tree-body" x="116" y="142" width="18" height="58" rx="6"></rect>
        <circle class="deco tree-top" cx="845" cy="110" r="50"></circle>
        <rect class="deco tree-body" x="835" y="145" width="20" height="62" rx="6"></rect>
      `;
    }
    return `
      <path class="deco leaf" d="M 140 115 C 190 70 245 86 270 145 C 215 145 170 158 140 115 Z"></path>
      <path class="deco leaf" d="M 760 120 C 815 65 890 88 915 158 C 850 145 795 165 760 120 Z"></path>
      <circle class="deco jungle-dot" cx="210" cy="455" r="18"></circle>
      <circle class="deco jungle-dot" cx="825" cy="455" r="24"></circle>
    `;
  }

  function characterBadge(themeId) {
    return `<svg class="character-badge" viewBox="-70 -55 140 110" aria-hidden="true">${characterGroup(themeId)}</svg>`;
  }

  function characterGroup(themeId) {
    if (themeId === "train") {
      return `
        <g class="character train-shape">
          <rect x="-50" y="-30" width="100" height="58" rx="13"></rect>
          <rect class="character-light" x="-34" y="-18" width="25" height="18" rx="4"></rect>
          <rect class="character-light" x="3" y="-18" width="25" height="18" rx="4"></rect>
          <rect class="character-accent" x="-44" y="8" width="88" height="12" rx="6"></rect>
          <circle class="character-wheel" cx="-30" cy="32" r="10"></circle>
          <circle class="character-wheel" cx="30" cy="32" r="10"></circle>
        </g>
      `;
    }
    if (themeId === "car") {
      return `
        <g class="character car-shape">
          <path d="M -54 10 L -42 -16 C -35 -30 -15 -34 22 -28 C 39 -24 50 -10 56 10 Z"></path>
          <rect class="character-accent" x="-58" y="2" width="116" height="28" rx="14"></rect>
          <path class="character-light" d="M -27 -16 C -18 -24 2 -25 17 -22 L 24 -5 L -34 -5 Z"></path>
          <circle class="character-wheel" cx="-34" cy="30" r="11"></circle>
          <circle class="character-wheel" cx="34" cy="30" r="11"></circle>
        </g>
      `;
    }
    if (themeId === "animal") {
      return `
        <g class="character animal-shape">
          <ellipse cx="0" cy="10" rx="48" ry="30"></ellipse>
          <circle class="character-head" cx="30" cy="-18" r="28"></circle>
          <circle class="character-head" cx="14" cy="-42" r="12"></circle>
          <circle class="character-head" cx="42" cy="-42" r="12"></circle>
          <circle class="character-eye" cx="22" cy="-22" r="4"></circle>
          <circle class="character-eye" cx="42" cy="-22" r="4"></circle>
          <circle class="character-wheel" cx="-28" cy="36" r="7"></circle>
          <circle class="character-wheel" cx="22" cy="38" r="7"></circle>
        </g>
      `;
    }
    return `
      <g class="character dino-shape">
        <ellipse cx="-4" cy="8" rx="54" ry="30"></ellipse>
        <circle class="character-head" cx="42" cy="-14" r="25"></circle>
        <path class="character-tail" d="M -54 4 L -86 -18 L -62 24 Z"></path>
        <circle class="character-eye" cx="51" cy="-21" r="4"></circle>
        <path class="character-accent" d="M -26 -25 L -14 -45 L -2 -25 L 10 -45 L 22 -25 Z"></path>
        <rect class="character-leg" x="-28" y="30" width="12" height="22" rx="5"></rect>
        <rect class="character-leg" x="16" y="30" width="12" height="22" rx="5"></rect>
      </g>
    `;
  }

  function setupGame() {
    const svg = root.querySelector("#adventureSvg");
    const guide = root.querySelector("#guidePath");
    const traceLine = root.querySelector("#traceLine");
    const traceGlow = root.querySelector("#traceGlow");
    const hero = root.querySelector("#heroMarker");
    const progressBar = root.querySelector("#progressBar");
    const hint = root.querySelector("#playHint");
    const displayCourse = currentCourse();
    const kanji = isKanjiMode();
    const strokeIndex = kanji ? state.kanjiRun.strokeIndex : 0;
    const course = kanji ? displayCourse.strokes[strokeIndex] : displayCourse;
    const totalLength = guide.getTotalLength();
    const samples = samplePath(guide, totalLength, 360);

    const game = {
      svg,
      guide,
      traceLine,
      traceGlow,
      hero,
      progressBar,
      hint,
      course,
      displayCourse,
      isKanji: kanji,
      strokeIndex,
      strokeCount: kanji ? displayCourse.strokes.length : 1,
      totalLength,
      samples,
      pointerId: null,
      points: [],
      maxProgress: 0,
      active: false
    };

    currentGame = game;
    setHeroAt(game, 0);

    svg.addEventListener("pointerdown", (event) => beginTrace(event, game));
    svg.addEventListener("pointermove", (event) => moveTrace(event, game));
    svg.addEventListener("pointerup", (event) => endTrace(event, game));
    svg.addEventListener("pointercancel", (event) => endTrace(event, game));
  }

  function samplePath(path, totalLength, count) {
    return Array.from({ length: count }, (_, index) => {
      const t = index / (count - 1);
      const point = path.getPointAtLength(totalLength * t);
      return { x: point.x, y: point.y, t };
    });
  }

  function beginTrace(event, game) {
    event.preventDefault();
    game.svg.setPointerCapture(event.pointerId);
    game.pointerId = event.pointerId;
    game.points = [];
    game.maxProgress = 0;
    game.active = true;

    const point = eventPoint(event, game.svg);
    addTracePoint(game, point);
    setHint(game, distance(point, game.samples[0]) > 120
      ? "スタートの近くからはじめると、もっと進みやすいよ。"
      : game.isKanji
        ? "そのまま、線の終わりまでなぞってペンをはなそう。"
        : "そのまま、ゆっくりなぞろう。"
    );
  }

  function moveTrace(event, game) {
    if (!game.active || event.pointerId !== game.pointerId) return;
    event.preventDefault();
    const point = eventPoint(event, game.svg);
    const last = game.points[game.points.length - 1];
    if (last && distance(point, last) < 2 && point.time - last.time < 50) return;
    addTracePoint(game, point);
  }

  function endTrace(event, game) {
    if (!game.active || event.pointerId !== game.pointerId) return;
    event.preventDefault();
    if (game.svg.hasPointerCapture(event.pointerId)) {
      game.svg.releasePointerCapture(event.pointerId);
    }
    game.active = false;
    game.pointerId = null;

    const result = evaluateTrace(game);
    if (game.isKanji) {
      handleKanjiStrokeEnd(game, result);
      return;
    }
    finishCourse(result);
  }

  function finishCourse(result) {
    const courseId = currentCourse().id;
    const previousBest = bestForCourse(courseId);
    const bestScore = Math.max(previousBest, result.score);
    result.previousBest = previousBest;
    result.bestScore = bestScore;
    result.isNewBest = result.score > previousBest;
    state.bestScores[bestScoreKey(courseId)] = bestScore;
    state.lastResult = result;
    state.history.push({
      at: new Date().toISOString(),
      themeId: state.themeId,
      courseId,
      courseMode: state.courseMode,
      difficultyId: state.difficultyId,
      score: result.score,
      progress: result.progress,
      accuracy: result.accuracy,
      backtrack: result.backtrack || 0,
      efficiency: typeof result.efficiency === "number" ? result.efficiency : 1
    });
    state.history = state.history.slice(-100);
    saveState();
    state.screen = "result";
    render();
  }

  function ensureKanjiRun(course) {
    const run = state.kanjiRun;
    if (run && run.courseId === course.id && run.difficultyId === state.difficultyId
      && run.strokeIndex < course.strokes.length) return;
    state.kanjiRun = {
      courseId: course.id,
      difficultyId: state.difficultyId,
      strokeIndex: 0,
      strokeResults: []
    };
  }

  function resetKanjiRun() {
    state.kanjiRun = null;
  }

  function handleKanjiStrokeEnd(game, result) {
    if (!kanjiStrokeCompleted(game)) {
      game.points = [];
      game.maxProgress = 0;
      game.traceLine.setAttribute("points", "");
      game.traceGlow.setAttribute("points", "");
      game.progressBar.style.width = `${Math.round(game.strokeIndex / game.strokeCount * 100)}%`;
      setHeroAt(game, 0);
      setHint(game, `${game.strokeIndex + 1}かくめを、丸から丸までつなげてみよう。`);
      return;
    }

    const run = state.kanjiRun;
    run.strokeResults.push(result);
    run.strokeIndex += 1;
    if (run.strokeIndex < game.strokeCount) {
      render();
      return;
    }

    finishCourse(combineKanjiResults(run.strokeResults));
  }

  function kanjiStrokeCompleted(game) {
    if (game.points.length < 2) return false;
    const first = game.points[0];
    const last = game.points[game.points.length - 1];
    const tolerance = (game.course.tolerance || 88) * 1.25;
    return distance(first, game.samples[0]) <= tolerance
      && first.nearest.t <= 0.12
      && game.maxProgress >= 0.92
      && last.nearest.t >= 0.86
      && distance(last, game.samples[game.samples.length - 1]) <= tolerance;
  }

  function combineKanjiResults(strokeResults) {
    const score = Math.round(average(strokeResults.map((result) => result.score)));
    const accuracy = average(strokeResults.map((result) => result.accuracy || 0));
    const nearRatio = average(strokeResults.map((result) => result.nearRatio || 0));
    const backtrack = strokeResults.reduce((sum, result) => sum + (result.backtrack || 0), 0);
    const efficiency = average(strokeResults.map((result) => (
      typeof result.efficiency === "number" ? result.efficiency : 1
    )));
    const details = [`${strokeResults.length}かくを じゅんばんに かけた`];
    strokeResults.forEach((result, index) => {
      details.push(`${index + 1}かくめ ${result.score}点`);
    });

    return {
      score,
      title: scoreTitle(score),
      details,
      tip: score >= 85
        ? "ペンを置く、書く、はなすができました。次の文字にも進めます。"
        : "光っている一画を、始めから終わりまでゆっくり進みましょう。",
      progress: 1,
      accuracy,
      nearRatio,
      backtrack,
      efficiency,
      strokeScores: strokeResults.map((result) => result.score)
    };
  }

  function eventPoint(event, svg) {
    const rect = svg.getBoundingClientRect();
    return {
      x: clamp(((event.clientX - rect.left) / rect.width) * VIEW_WIDTH, 0, VIEW_WIDTH),
      y: clamp(((event.clientY - rect.top) / rect.height) * VIEW_HEIGHT, 0, VIEW_HEIGHT),
      time: performance.now()
    };
  }

  function addTracePoint(game, point) {
    const nearest = nearestSample(point, game.samples);
    point.nearest = nearest;
    game.points.push(point);

    if (nearest.distance < 150) {
      game.maxProgress = Math.max(game.maxProgress, nearest.t);
      setHeroAt(game, game.maxProgress);
    }

    const pointsText = game.points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    game.traceLine.setAttribute("points", pointsText);
    game.traceGlow.setAttribute("points", pointsText);
    const overallProgress = game.isKanji
      ? (game.strokeIndex + game.maxProgress) / game.strokeCount
      : game.maxProgress;
    game.progressBar.style.width = `${Math.round(overallProgress * 100)}%`;

    if (nearest.distance > 150) {
      setHint(game, "みちの近くにもどってみよう。");
    } else if (game.maxProgress > 0.9) {
      setHint(game, game.isKanji
        ? "線の終わりで止めて、ペンをはなそう。"
        : "もうすぐゴール。さいごまでなぞろう。"
      );
    } else if (nearest.distance < 45) {
      setHint(game, "いいね。そのまま進もう。");
    }
  }

  function setHeroAt(game, t) {
    const safeT = clamp(t, 0, 1);
    const current = game.guide.getPointAtLength(game.totalLength * safeT);
    const next = game.guide.getPointAtLength(game.totalLength * clamp(safeT + 0.01, 0, 1));
    const angle = Math.atan2(next.y - current.y, next.x - current.x) * 180 / Math.PI;
    game.hero.setAttribute("transform", `translate(${current.x.toFixed(2)} ${current.y.toFixed(2)}) rotate(${angle.toFixed(2)})`);
  }

  function nearestSample(point, samples) {
    let best = samples[0];
    let bestDistance = Infinity;
    for (const sample of samples) {
      const currentDistance = Math.hypot(point.x - sample.x, point.y - sample.y);
      if (currentDistance < bestDistance) {
        best = sample;
        bestDistance = currentDistance;
      }
    }
    return { sample: best, distance: bestDistance, t: best.t };
  }

  function evaluateTrace(game) {
    if (state.difficultyId === "easy") return evaluateEasyTrace(game);
    return evaluateCarefulTrace(game, state.difficultyId);
  }

  function evaluateEasyTrace(game) {
    const points = game.points;
    if (points.length < 2) {
      return {
        score: 0,
        title: "ペンをおいてみよう",
        details: ["まずはペンを置いて、少しだけ動かそう。"],
        tip: "点を押すだけでも大丈夫です。次はそのまま動かしてみましょう。",
        progress: 0,
        accuracy: 0,
        nearRatio: 0
      };
    }

    const tolerance = game.course.tolerance || 88;
    const close = tolerance * 0.52;
    const loose = tolerance * 1.55;
    const distanceScores = points.map((point) => {
      const value = point.nearest.distance;
      if (value <= close) return 1;
      if (value <= tolerance) return 0.82;
      if (value <= loose) return 0.45;
      return 0.08;
    });
    const accuracy = average(distanceScores);
    const nearRatio = points.filter((point) => point.nearest.distance <= tolerance).length / points.length;
    const progress = game.maxProgress;
    const finished = progress >= 0.94 && points[points.length - 1].nearest.t >= 0.88;
    const speedOk = speedScore(points);
    const stopOk = stopScore(points, game.course.stops);
    const rawScore = accuracy * 0.58 + progress * 0.3 + speedOk * 0.08 + stopOk * 0.04;
    let score = Math.round(clamp(rawScore, 0, 1) * 100);
    if (!finished) {
      score = Math.min(score, Math.round(20 + progress * 70));
    }
    if (progress < 0.35) {
      score = Math.min(score, 45);
    }

    const details = [];
    if (finished) details.push("ゴールまでいけた");
    else details.push(`ゴールまで ${Math.round(progress * 100)}% すすんだ`);
    details.push(`みちの近く ${Math.round(nearRatio * 100)}%`);
    if (speedOk >= 0.72) details.push("あわてずにすすめた");
    else details.push("少し速いところがあった");
    if (stopOk > 0 && game.course.stops.length) details.push("とまる場所を見つけられた");

    return {
      score,
      title: scoreTitle(score),
      details,
      tip: resultTip({ finished, accuracy, speedOk, progress }),
      progress,
      accuracy,
      nearRatio
    };
  }

  function evaluateCarefulTrace(game, difficultyId) {
    const points = game.points;
    if (points.length < 2) {
      return {
        score: 0,
        title: "ペンをおいてみよう",
        details: ["スタートにペンを置いて、少しだけ動かそう。"],
        tip: "スタートからゴールのほうへ、ペンをつけたまま進みましょう。",
        progress: 0,
        accuracy: 0,
        nearRatio: 0,
        backtrack: 0,
        efficiency: 0
      };
    }

    const settings = difficultyId === "hard" ? {
      toleranceScale: 0.52,
      startDistance: 70,
      startProgress: 0.055,
      endDistance: 65,
      endProgress: 0.94,
      fastSpeed: 600,
      backtrackRange: 0.25,
      excessRange: 0.55,
      backtrackWarning: 0.1,
      nearWarning: 0.66,
      efficiencyWarning: 0.65,
      weights: { path: 0.46, progress: 0.14, direction: 0.17, efficiency: 0.13, speed: 0.07, stop: 0.03 },
      caps: { unfinished: 60, start: 55, rough: 50, backtrack: 50, detour: 55 }
    } : {
      toleranceScale: 0.72,
      startDistance: 95,
      startProgress: 0.08,
      endDistance: 90,
      endProgress: 0.9,
      fastSpeed: 760,
      backtrackRange: 0.5,
      excessRange: 0.85,
      backtrackWarning: 0.18,
      nearWarning: 0.56,
      efficiencyWarning: 0.55,
      weights: { path: 0.45, progress: 0.18, direction: 0.15, efficiency: 0.12, speed: 0.06, stop: 0.04 },
      caps: { unfinished: 72, start: 74, rough: 64, backtrack: 65, detour: 68 }
    };

    const tolerance = (game.course.tolerance || 88) * settings.toleranceScale;
    const close = tolerance * 0.45;
    const loose = tolerance * 1.35;
    const distanceScores = points.map((point) => {
      const value = point.nearest.distance;
      if (value <= close) return 1;
      if (value <= tolerance) return 0.72;
      if (value <= loose) return 0.3;
      return 0.02;
    });
    const accuracy = average(distanceScores);
    const nearRatio = points.filter((point) => point.nearest.distance <= tolerance).length / points.length;
    const pathScore = accuracy * 0.65 + nearRatio * 0.35;
    const progress = game.maxProgress;
    const first = points[0];
    const last = points[points.length - 1];
    const startOk = distance(first, game.samples[0]) <= settings.startDistance
      && first.nearest.t <= settings.startProgress;
    const endOk = distance(last, game.samples[game.samples.length - 1]) <= settings.endDistance
      && last.nearest.t >= settings.endProgress;
    const finished = startOk && endOk && progress >= 0.94;
    const backtrack = backtrackAmount(points, loose);
    const directionOk = clamp(1 - backtrack / settings.backtrackRange, 0, 1);
    const efficiency = efficiencyScore(points, game.totalLength, progress, settings.excessRange);
    const speedOk = speedScore(points, settings.fastSpeed);
    const stopOk = stopScore(points, game.course.stops, loose);
    const weights = settings.weights;
    const rawScore = pathScore * weights.path
      + progress * weights.progress
      + directionOk * weights.direction
      + efficiency * weights.efficiency
      + speedOk * weights.speed
      + stopOk * weights.stop;
    let score = Math.round(clamp(rawScore, 0, 1) * 100);

    if (!finished) score = Math.min(score, settings.caps.unfinished);
    if (!startOk) score = Math.min(score, settings.caps.start);
    if (nearRatio < settings.nearWarning) score = Math.min(score, settings.caps.rough);
    if (backtrack > settings.backtrackWarning) score = Math.min(score, settings.caps.backtrack);
    if (efficiency < settings.efficiencyWarning) score = Math.min(score, settings.caps.detour);
    if (progress < 0.35) score = Math.min(score, difficultyId === "hard" ? 35 : 45);

    const details = [];
    if (finished) details.push("スタートからゴールまでいけた");
    else if (!startOk) details.push("スタートの近くからはじめよう");
    else details.push(`ゴールまで ${Math.round(progress * 100)}% すすんだ`);
    details.push(`みちの まんなか ${Math.round(nearRatio * 100)}%`);
    if (backtrack <= settings.backtrackWarning * 0.35) details.push("もどらずに すすめた");
    else details.push("もどった うごきが あった");
    if (efficiency >= 0.75) details.push("おなじところを通りすぎなかった");
    else details.push("おなじところを何度も通った");
    if (speedOk < 0.72) details.push("少し速いところがあった");

    return {
      score,
      title: scoreTitle(score),
      details,
      tip: carefulResultTip({
        finished,
        startOk,
        accuracy,
        nearRatio,
        speedOk,
        progress,
        backtrack,
        efficiency,
        settings
      }),
      progress,
      accuracy,
      nearRatio,
      backtrack,
      efficiency
    };
  }

  function backtrackAmount(points, maxDistance) {
    let amount = 0;
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const current = points[index];
      if (previous.nearest.distance > maxDistance || current.nearest.distance > maxDistance) continue;
      amount += Math.max(0, previous.nearest.t - current.nearest.t - 0.005);
    }
    return amount;
  }

  function efficiencyScore(points, totalLength, progress, excessRange) {
    let travelled = 0;
    for (let index = 1; index < points.length; index += 1) {
      travelled += distance(points[index - 1], points[index]);
    }
    const expected = Math.max(totalLength * Math.max(progress, 0.05), 1);
    const excess = Math.max(0, travelled / expected - 1);
    return clamp(1 - excess / excessRange, 0, 1);
  }

  function speedScore(points, fastLimit = 920) {
    const speeds = [];
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const current = points[index];
      const elapsed = Math.max(1, current.time - previous.time);
      speeds.push(distance(previous, current) / elapsed * 1000);
    }
    if (!speeds.length) return 0.5;
    const fastRatio = speeds.filter((speed) => speed > fastLimit).length / speeds.length;
    return clamp(1 - fastRatio, 0, 1);
  }

  function stopScore(points, stops, maxDistance = 120) {
    if (!stops.length) return 1;
    let found = 0;
    for (const stop of stops) {
      const touched = points.some((point) => {
        const closeToStop = Math.abs(point.nearest.t - stop.t) < 0.06;
        return closeToStop && point.nearest.distance < maxDistance;
      });
      if (touched) found += 1;
    }
    return found / stops.length;
  }

  function resultTip({ finished, accuracy, speedOk, progress }) {
    if (progress < 0.55) return "ペンを画面につけたまま、ゴールの方へ進んでみましょう。";
    if (!finished) return "あと少しです。ゴールの近くまで線をつなげてみましょう。";
    if (accuracy < 0.58) return "道のまんなかを見ながら、少し小さく動かすと近づきます。";
    if (speedOk < 0.65) return "すべりやすいときは、少しゆっくり進むと安定します。";
    return "次はちがうコースにも進めます。";
  }

  function carefulResultTip({ finished, startOk, accuracy, nearRatio, speedOk, progress, backtrack, efficiency, settings }) {
    if (!startOk) return "スタートの丸にペンを置いてから、ゴールのほうへ進みましょう。";
    if (progress < 0.55) return "ペンを画面につけたまま、ゴールのほうへ進んでみましょう。";
    if (!finished) return "ゴールの丸まで線をつなげて、そこでペンを止めましょう。";
    if (backtrack > settings.backtrackWarning) return "来た道はもどらず、ゴールのほうへ一回で進みましょう。";
    if (efficiency < settings.efficiencyWarning) return "同じところを往復せず、一本の線で進みましょう。";
    if (nearRatio < settings.nearWarning || accuracy < 0.62) return "道のまんなかを見ながら、少し小さく動かしましょう。";
    if (speedOk < 0.72) return "少しゆっくり進むと、線が安定します。";
    return "ていねいに進めました。次のコースにも挑戦できます。";
  }

  function setHint(game, text) {
    game.hint.textContent = text;
  }

  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    if (action === "start") {
      state.screen = "character";
    } else if (action === "select-difficulty") {
      if (difficultyMap.has(button.dataset.difficulty)) {
        state.difficultyId = button.dataset.difficulty;
        resetKanjiRun();
        saveState();
      }
    } else if (action === "quick-play") {
      resetKanjiRun();
      state.screen = "play";
    } else if (action === "home") {
      state.screen = "home";
    } else if (action === "character") {
      state.screen = "character";
    } else if (action === "course") {
      resetKanjiRun();
      state.screen = "course";
    } else if (action === "select-theme") {
      state.themeId = button.dataset.theme;
      resetKanjiRun();
      saveState();
      state.screen = "course";
    } else if (action === "select-course-mode") {
      const mode = button.dataset.mode;
      if (mode === "line" || (mode === "kanji" && kanjiCourses.length)) {
        state.courseMode = mode;
        if (mode === "line" && !courseMap.has(state.courseId)) state.courseId = courses[0].id;
        if (mode === "kanji" && !kanjiCourseMap.has(state.courseId)) state.courseId = kanjiCourses[0].id;
        resetKanjiRun();
        saveState();
      }
    } else if (action === "select-course") {
      state.courseId = button.dataset.course;
      resetKanjiRun();
      saveState();
      state.screen = "play";
    } else if (action === "restart") {
      resetKanjiRun();
      state.screen = "play";
    } else if (action === "next-course") {
      const activeCourses = currentCourseList();
      const index = activeCourses.findIndex((course) => course.id === state.courseId);
      state.courseId = activeCourses[(index + 1) % activeCourses.length].id;
      resetKanjiRun();
      saveState();
      state.screen = "play";
    }

    render();
  });

  loadSavedState();
  render();
})();
