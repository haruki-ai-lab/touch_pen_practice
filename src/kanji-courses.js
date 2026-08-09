(() => {
  "use strict";

  const kanjiCourses = [
    {
      id: "kanji-two",
      label: "二",
      reading: "に",
      level: "2かく・はじめ",
      skill: "上から順に、横線を2本書く",
      strokes: [
        {
          path: "M 300 205 L 700 205",
          start: { x: 300, y: 205 },
          end: { x: 700, y: 205 },
          stops: [],
          tolerance: 92
        },
        {
          path: "M 230 370 L 770 370",
          start: { x: 230, y: 370 },
          end: { x: 770, y: 370 },
          stops: [],
          tolerance: 90
        }
      ]
    },
    {
      id: "kanji-ten",
      label: "十",
      reading: "じゅう",
      level: "2かく・はじめ",
      skill: "横線のあとに、縦線を書く",
      strokes: [
        {
          path: "M 255 280 L 745 280",
          start: { x: 255, y: 280 },
          end: { x: 745, y: 280 },
          stops: [],
          tolerance: 88
        },
        {
          path: "M 500 95 L 500 475",
          start: { x: 500, y: 95 },
          end: { x: 500, y: 475 },
          stops: [],
          tolerance: 86
        }
      ]
    },
    {
      id: "kanji-person",
      label: "人",
      reading: "ひと",
      level: "2かく・れんしゅう",
      skill: "左払いのあとに、右払いを書く",
      strokes: [
        {
          path: "M 485 105 C 470 240 390 385 235 470",
          start: { x: 485, y: 105 },
          end: { x: 235, y: 470 },
          stops: [],
          tolerance: 90
        },
        {
          path: "M 505 160 C 565 285 650 400 790 470",
          start: { x: 505, y: 160 },
          end: { x: 790, y: 470 },
          stops: [],
          tolerance: 88
        }
      ]
    },
    {
      id: "kanji-river",
      label: "川",
      reading: "かわ",
      level: "3かく・れんしゅう",
      skill: "左から順に、縦の線を3本書く",
      strokes: [
        {
          path: "M 300 110 C 300 245 290 365 235 455",
          start: { x: 300, y: 110 },
          end: { x: 235, y: 455 },
          stops: [],
          tolerance: 86
        },
        {
          path: "M 500 100 L 500 435",
          start: { x: 500, y: 100 },
          end: { x: 500, y: 435 },
          stops: [],
          tolerance: 84
        },
        {
          path: "M 690 90 C 690 235 705 365 770 460",
          start: { x: 690, y: 90 },
          end: { x: 770, y: 460 },
          stops: [],
          tolerance: 82
        }
      ]
    },
    {
      id: "kanji-three",
      label: "三",
      reading: "さん",
      level: "3かく・れんしゅう",
      skill: "上から順に、長さの違う横線を書く",
      strokes: [
        {
          path: "M 335 145 L 665 145",
          start: { x: 335, y: 145 },
          end: { x: 665, y: 145 },
          stops: [],
          tolerance: 86
        },
        {
          path: "M 295 280 L 705 280",
          start: { x: 295, y: 280 },
          end: { x: 705, y: 280 },
          stops: [],
          tolerance: 84
        },
        {
          path: "M 225 425 L 775 425",
          start: { x: 225, y: 425 },
          end: { x: 775, y: 425 },
          stops: [],
          tolerance: 82
        }
      ]
    },
    {
      id: "kanji-small",
      label: "小",
      reading: "しょう・ちいさい",
      level: "3かく・ちょうせん",
      skill: "縦のはね、左の点、右の点を書く",
      strokes: [
        {
          path: "M 510 90 L 510 395 C 510 445 475 465 430 435",
          start: { x: 510, y: 90 },
          end: { x: 430, y: 435 },
          stops: [{ t: 0.78, x: 510, y: 395, label: "はね" }],
          tolerance: 82
        },
        {
          path: "M 365 265 C 335 330 295 385 245 425",
          start: { x: 365, y: 265 },
          end: { x: 245, y: 425 },
          stops: [],
          tolerance: 80
        },
        {
          path: "M 650 255 C 680 325 720 380 775 425",
          start: { x: 650, y: 255 },
          end: { x: 775, y: 425 },
          stops: [],
          tolerance: 78
        }
      ]
    }
  ];

  window.SEN_KANJI_COURSES = kanjiCourses;
  window.SEN_KANJI_COURSE_MAP = new Map(kanjiCourses.map((course) => [course.id, course]));
})();
