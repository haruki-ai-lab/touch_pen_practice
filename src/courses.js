(() => {
  "use strict";

  const courses = [
    {
      id: "straight",
      label: "まっすぐ 1",
      level: "はじめ",
      skill: "短い横線をまっすぐ進む",
      path: "M 280 300 L 720 300",
      start: { x: 280, y: 300 },
      end: { x: 720, y: 300 },
      stops: [],
      tolerance: 108
    },
    {
      id: "straight-2",
      label: "まっすぐ 2",
      level: "はじめ",
      skill: "少し長い横線を進む",
      path: "M 210 300 L 790 300",
      start: { x: 210, y: 300 },
      end: { x: 790, y: 300 },
      stops: [],
      tolerance: 98
    },
    {
      id: "straight-3",
      label: "まっすぐ 3",
      level: "はじめ",
      skill: "長い横線を最後まで進む",
      path: "M 120 300 L 880 300",
      start: { x: 120, y: 300 },
      end: { x: 880, y: 300 },
      stops: [{ t: 0.5, x: 500, y: 300, label: "えき" }],
      tolerance: 90
    },
    {
      id: "straight-4",
      label: "たてのまっすぐ",
      level: "はじめ",
      skill: "上から下へまっすぐ進む",
      path: "M 500 120 L 500 455",
      start: { x: 500, y: 120 },
      end: { x: 500, y: 455 },
      stops: [],
      tolerance: 88
    },
    {
      id: "straight-5",
      label: "ななめのまっすぐ",
      level: "つぎ",
      skill: "斜め線をゆっくり進む",
      path: "M 190 165 L 820 420",
      start: { x: 190, y: 165 },
      end: { x: 820, y: 420 },
      stops: [],
      tolerance: 84
    },
    {
      id: "straight-6",
      label: "ななめ 2",
      level: "つぎ",
      skill: "下から上へ斜めに進む",
      path: "M 200 430 L 820 145",
      start: { x: 200, y: 430 },
      end: { x: 820, y: 145 },
      stops: [],
      tolerance: 82
    },
    {
      id: "straight-7",
      label: "下のまっすぐ",
      level: "つぎ",
      skill: "低い位置でまっすぐ進む",
      path: "M 120 420 L 880 420",
      start: { x: 120, y: 420 },
      end: { x: 880, y: 420 },
      stops: [],
      tolerance: 80
    },
    {
      id: "straight-8",
      label: "上のまっすぐ",
      level: "つぎ",
      skill: "高い位置でまっすぐ進む",
      path: "M 880 150 L 120 150",
      start: { x: 880, y: 150 },
      end: { x: 120, y: 150 },
      stops: [],
      tolerance: 80
    },
    {
      id: "straight-9",
      label: "たて 2",
      level: "れんしゅう",
      skill: "下から上へまっすぐ進む",
      path: "M 500 470 L 500 95",
      start: { x: 500, y: 470 },
      end: { x: 500, y: 95 },
      stops: [],
      tolerance: 78
    },
    {
      id: "straight-10",
      label: "ほそいまっすぐ",
      level: "れんしゅう",
      skill: "細い道をゆっくり進む",
      path: "M 145 285 L 855 285",
      start: { x: 145, y: 285 },
      end: { x: 855, y: 285 },
      stops: [{ t: 0.5, x: 500, y: 285, label: "えき" }],
      tolerance: 68
    },
    {
      id: "curve-easy",
      label: "カーブ 1",
      level: "つぎ",
      skill: "ゆるいカーブをなぞる",
      path: "M 150 340 C 320 230 560 230 850 340",
      start: { x: 150, y: 340 },
      end: { x: 850, y: 340 },
      stops: [],
      tolerance: 94
    },
    {
      id: "curve",
      label: "カーブ 2",
      level: "つぎ",
      skill: "上へふくらむ道を曲がる",
      path: "M 140 400 C 255 170 650 175 860 320",
      start: { x: 140, y: 400 },
      end: { x: 860, y: 320 },
      stops: [],
      tolerance: 90
    },
    {
      id: "curve-3",
      label: "カーブ 3",
      level: "れんしゅう",
      skill: "S字の道を見ながら進む",
      path: "M 120 300 C 250 120 400 480 530 300 S 780 160 900 330",
      start: { x: 120, y: 300 },
      end: { x: 900, y: 330 },
      stops: [],
      tolerance: 86
    },
    {
      id: "curve-4",
      label: "カーブ 4",
      level: "れんしゅう",
      skill: "大きく下へ曲がる",
      path: "M 160 170 C 260 455 665 485 850 260",
      start: { x: 160, y: 170 },
      end: { x: 850, y: 260 },
      stops: [],
      tolerance: 84
    },
    {
      id: "curve-5",
      label: "カーブ 5",
      level: "れんしゅう",
      skill: "小さな山を越える",
      path: "M 130 345 C 270 210 360 210 480 345 C 600 480 735 480 875 345",
      start: { x: 130, y: 345 },
      end: { x: 875, y: 345 },
      stops: [],
      tolerance: 82
    },
    {
      id: "curve-6",
      label: "カーブ 6",
      level: "れんしゅう",
      skill: "カーブで速くなりすぎない",
      path: "M 140 240 C 245 440 390 455 500 285 C 610 115 760 130 865 325",
      start: { x: 140, y: 240 },
      end: { x: 865, y: 325 },
      stops: [],
      tolerance: 80
    },
    {
      id: "curve-7",
      label: "カーブ 7",
      level: "ちょうせん",
      skill: "長いS字を最後まで進む",
      path: "M 110 410 C 220 115 380 125 485 290 S 745 455 900 160",
      start: { x: 110, y: 410 },
      end: { x: 900, y: 160 },
      stops: [],
      tolerance: 78
    },
    {
      id: "curve-8",
      label: "カーブ 8",
      level: "ちょうせん",
      skill: "細かい曲がりをゆっくり進む",
      path: "M 125 315 C 220 175 315 445 410 315 S 600 175 695 315 S 850 425 910 250",
      start: { x: 125, y: 315 },
      end: { x: 910, y: 250 },
      stops: [],
      tolerance: 76
    },
    {
      id: "corner",
      label: "かど 1",
      level: "つぎ",
      skill: "角でピタッと向きを変える",
      path: "M 150 170 L 500 170 L 500 420 L 860 420",
      start: { x: 150, y: 170 },
      end: { x: 860, y: 420 },
      stops: [{ t: 0.38, x: 500, y: 170, label: "かど" }],
      tolerance: 88
    },
    {
      id: "corner-2",
      label: "かど 2",
      level: "れんしゅう",
      skill: "コの字の道を曲がる",
      path: "M 180 160 L 820 160 L 820 410 L 250 410",
      start: { x: 180, y: 160 },
      end: { x: 250, y: 410 },
      stops: [
        { t: 0.47, x: 820, y: 160, label: "かど" },
        { t: 0.65, x: 820, y: 410, label: "かど" }
      ],
      tolerance: 84
    },
    {
      id: "corner-3",
      label: "かど 3",
      level: "れんしゅう",
      skill: "短い角をつないで進む",
      path: "M 150 420 L 150 245 L 350 245 L 350 120 L 610 120 L 610 310 L 860 310",
      start: { x: 150, y: 420 },
      end: { x: 860, y: 310 },
      stops: [
        { t: 0.17, x: 150, y: 245, label: "かど" },
        { t: 0.35, x: 350, y: 245, label: "かど" },
        { t: 0.48, x: 350, y: 120, label: "かど" },
        { t: 0.72, x: 610, y: 120, label: "かど" }
      ],
      tolerance: 82
    },
    {
      id: "corner-4",
      label: "かど 4",
      level: "れんしゅう",
      skill: "四角い道を大きく曲がる",
      path: "M 190 145 L 805 145 L 805 425 L 190 425 L 190 260",
      start: { x: 190, y: 145 },
      end: { x: 190, y: 260 },
      stops: [
        { t: 0.33, x: 805, y: 145, label: "かど" },
        { t: 0.48, x: 805, y: 425, label: "かど" },
        { t: 0.81, x: 190, y: 425, label: "かど" }
      ],
      tolerance: 80
    },
    {
      id: "corner-5",
      label: "かど 5",
      level: "ちょうせん",
      skill: "細いL字をていねいに進む",
      path: "M 135 125 L 865 125 L 865 300 L 510 300 L 510 455",
      start: { x: 135, y: 125 },
      end: { x: 510, y: 455 },
      stops: [
        { t: 0.58, x: 865, y: 125, label: "かど" },
        { t: 0.72, x: 865, y: 300, label: "かど" },
        { t: 0.89, x: 510, y: 300, label: "かど" }
      ],
      tolerance: 76
    },
    {
      id: "corner-6",
      label: "かど 6",
      level: "ちょうせん",
      skill: "階段みたいに進む",
      path: "M 140 445 L 260 445 L 260 360 L 380 360 L 380 275 L 500 275 L 500 190 L 620 190 L 620 105 L 850 105",
      start: { x: 140, y: 445 },
      end: { x: 850, y: 105 },
      stops: [
        { t: 0.15, x: 260, y: 445, label: "かど" },
        { t: 0.26, x: 260, y: 360, label: "かど" },
        { t: 0.41, x: 380, y: 360, label: "かど" },
        { t: 0.52, x: 380, y: 275, label: "かど" }
      ],
      tolerance: 74
    },
    {
      id: "zigzag",
      label: "ジグザグ 1",
      level: "れんしゅう",
      skill: "短い線をつなげて曲がる",
      path: "M 130 420 L 260 200 L 390 420 L 520 200 L 650 420 L 780 200 L 890 360",
      start: { x: 130, y: 420 },
      end: { x: 890, y: 360 },
      stops: [
        { t: 0.18, x: 260, y: 200, label: "かど" },
        { t: 0.34, x: 390, y: 420, label: "かど" },
        { t: 0.5, x: 520, y: 200, label: "かど" }
      ],
      tolerance: 90
    },
    {
      id: "zigzag-2",
      label: "ジグザグ 2",
      level: "れんしゅう",
      skill: "大きなジグザグを進む",
      path: "M 120 150 L 275 420 L 430 150 L 585 420 L 740 150 L 890 360",
      start: { x: 120, y: 150 },
      end: { x: 890, y: 360 },
      stops: [],
      tolerance: 84
    },
    {
      id: "zigzag-3",
      label: "ジグザグ 3",
      level: "ちょうせん",
      skill: "小さな角をたくさん曲がる",
      path: "M 110 310 L 200 215 L 290 310 L 380 215 L 470 310 L 560 215 L 650 310 L 740 215 L 890 340",
      start: { x: 110, y: 310 },
      end: { x: 890, y: 340 },
      stops: [],
      tolerance: 78
    },
    {
      id: "zigzag-4",
      label: "たてジグザグ",
      level: "ちょうせん",
      skill: "縦に曲がりながら進む",
      path: "M 500 90 L 350 180 L 500 270 L 350 360 L 500 455 L 680 455",
      start: { x: 500, y: 90 },
      end: { x: 680, y: 455 },
      stops: [],
      tolerance: 76
    },
    {
      id: "zigzag-5",
      label: "いなずま",
      level: "ちょうせん",
      skill: "速くなりすぎず角を曲がる",
      path: "M 440 80 L 690 80 L 555 250 L 760 250 L 355 485 L 485 310 L 260 310",
      start: { x: 440, y: 80 },
      end: { x: 260, y: 310 },
      stops: [],
      tolerance: 74
    },
    {
      id: "zigzag-6",
      label: "こまかい山",
      level: "ちょうせん",
      skill: "細かく上がり下がりする",
      path: "M 115 360 L 205 245 L 295 360 L 385 245 L 475 360 L 565 245 L 655 360 L 745 245 L 885 360",
      start: { x: 115, y: 360 },
      end: { x: 885, y: 360 },
      stops: [],
      tolerance: 72
    },
    {
      id: "wavy",
      label: "ぐにゃぐにゃ 1",
      level: "れんしゅう",
      skill: "道を見ながら細かく曲がる",
      path: "M 120 300 C 230 150 340 450 450 300 S 670 150 780 300 S 890 430 920 270",
      start: { x: 120, y: 300 },
      end: { x: 920, y: 270 },
      stops: [],
      tolerance: 92
    },
    {
      id: "wavy-2",
      label: "ぐにゃぐにゃ 2",
      level: "れんしゅう",
      skill: "ゆるい波を長く進む",
      path: "M 105 320 C 185 240 265 400 345 320 S 505 240 585 320 S 745 400 825 320 S 915 245 940 300",
      start: { x: 105, y: 320 },
      end: { x: 940, y: 300 },
      stops: [],
      tolerance: 86
    },
    {
      id: "wavy-3",
      label: "へびみち",
      level: "ちょうせん",
      skill: "大きな波をゆっくり進む",
      path: "M 120 430 C 280 95 440 95 500 285 C 560 475 750 475 890 140",
      start: { x: 120, y: 430 },
      end: { x: 890, y: 140 },
      stops: [],
      tolerance: 82
    },
    {
      id: "wavy-4",
      label: "かわのみち",
      level: "ちょうせん",
      skill: "細い川のように進む",
      path: "M 100 250 C 210 390 330 120 450 260 C 575 405 680 140 800 275 C 865 350 910 335 940 285",
      start: { x: 100, y: 250 },
      end: { x: 940, y: 285 },
      stops: [],
      tolerance: 76
    },
    {
      id: "wavy-5",
      label: "なみなみ",
      level: "ちょうせん",
      skill: "小さな波を続ける",
      path: "M 120 300 C 175 210 235 390 290 300 S 400 210 455 300 S 565 390 620 300 S 730 210 785 300 S 880 380 920 290",
      start: { x: 120, y: 300 },
      end: { x: 920, y: 290 },
      stops: [],
      tolerance: 72
    },
    {
      id: "arch-1",
      label: "アーチ 1",
      level: "れんしゅう",
      skill: "大きな半円を曲がる",
      path: "M 180 390 C 250 120 750 120 820 390",
      start: { x: 180, y: 390 },
      end: { x: 820, y: 390 },
      stops: [],
      tolerance: 84
    },
    {
      id: "arch-2",
      label: "アーチ 2",
      level: "ちょうせん",
      skill: "下向きの半円を曲がる",
      path: "M 180 170 C 250 455 750 455 820 170",
      start: { x: 180, y: 170 },
      end: { x: 820, y: 170 },
      stops: [],
      tolerance: 78
    },
    {
      id: "loop-1",
      label: "まる 1",
      level: "ちょうせん",
      skill: "大きな丸を一周する",
      path: "M 500 115 C 700 115 835 250 835 315 C 835 435 665 500 500 500 C 335 500 165 435 165 315 C 165 250 300 115 500 115",
      start: { x: 500, y: 115 },
      end: { x: 500, y: 115 },
      stops: [],
      tolerance: 80
    },
    {
      id: "loop-2",
      label: "まる 2",
      level: "ちょうせん",
      skill: "小さめの丸を一周する",
      path: "M 500 155 C 650 155 745 240 745 315 C 745 420 635 470 500 470 C 365 470 255 420 255 315 C 255 240 350 155 500 155",
      start: { x: 500, y: 155 },
      end: { x: 500, y: 155 },
      stops: [],
      tolerance: 72
    },
    {
      id: "spiral",
      label: "うずまき 1",
      level: "ちょうせん",
      skill: "ゆっくり小さく回る",
      path: "M 180 300 C 180 130 430 80 610 170 C 820 275 760 505 520 500 C 320 495 270 260 470 245 C 610 235 650 380 515 385 C 425 388 405 305 485 295",
      start: { x: 180, y: 300 },
      end: { x: 485, y: 295 },
      stops: [],
      tolerance: 92
    },
    {
      id: "spiral-2",
      label: "うずまき 2",
      level: "ちょうせん",
      skill: "外から中へ小さく進む",
      path: "M 840 300 C 840 475 585 520 385 430 C 175 335 230 90 470 90 C 690 90 760 315 555 355 C 405 385 360 235 490 205 C 585 185 635 285 545 305",
      start: { x: 840, y: 300 },
      end: { x: 545, y: 305 },
      stops: [],
      tolerance: 82
    },
    {
      id: "hook-1",
      label: "はね 1",
      level: "れんしゅう",
      skill: "最後に少し曲げる",
      path: "M 440 110 L 440 410 Q 440 470 515 470",
      start: { x: 440, y: 110 },
      end: { x: 515, y: 470 },
      stops: [],
      tolerance: 82
    },
    {
      id: "hook-2",
      label: "はね 2",
      level: "ちょうせん",
      skill: "下まで進んで最後にはねる",
      path: "M 285 120 L 285 395 Q 285 485 390 455",
      start: { x: 285, y: 120 },
      end: { x: 390, y: 455 },
      stops: [],
      tolerance: 74
    },
    {
      id: "sweep-1",
      label: "はらい 1",
      level: "れんしゅう",
      skill: "最後を斜めにぬく",
      path: "M 300 125 C 420 250 545 350 765 455",
      start: { x: 300, y: 125 },
      end: { x: 765, y: 455 },
      stops: [],
      tolerance: 82
    },
    {
      id: "sweep-2",
      label: "はらい 2",
      level: "ちょうせん",
      skill: "長いはらいをゆっくり進む",
      path: "M 705 115 C 615 225 535 325 310 465",
      start: { x: 705, y: 115 },
      end: { x: 310, y: 465 },
      stops: [],
      tolerance: 78
    },
    {
      id: "sweep-3",
      label: "はらい 3",
      level: "ちょうせん",
      skill: "カーブしながらはらう",
      path: "M 230 150 C 385 180 445 280 520 360 C 595 440 695 470 820 420",
      start: { x: 230, y: 150 },
      end: { x: 820, y: 420 },
      stops: [],
      tolerance: 74
    },
    {
      id: "maze-1",
      label: "めいろ 1",
      level: "ちょうせん",
      skill: "角と直線を組み合わせる",
      path: "M 120 130 L 430 130 L 430 260 L 250 260 L 250 430 L 650 430 L 650 300 L 890 300",
      start: { x: 120, y: 130 },
      end: { x: 890, y: 300 },
      stops: [
        { t: 0.24, x: 430, y: 130, label: "かど" },
        { t: 0.34, x: 430, y: 260, label: "かど" },
        { t: 0.48, x: 250, y: 260, label: "かど" }
      ],
      tolerance: 78
    },
    {
      id: "maze-2",
      label: "めいろ 2",
      level: "ちょうせん",
      skill: "長い道をあわてず進む",
      path: "M 110 455 L 110 115 L 330 115 L 330 360 L 545 360 L 545 170 L 775 170 L 775 455 L 910 455",
      start: { x: 110, y: 455 },
      end: { x: 910, y: 455 },
      stops: [],
      tolerance: 74
    },
    {
      id: "final-1",
      label: "ぼうけん 1",
      level: "まとめ",
      skill: "直線、角、カーブを続ける",
      path: "M 115 340 L 320 340 C 420 180 565 180 665 340 L 880 340 L 880 455",
      start: { x: 115, y: 340 },
      end: { x: 880, y: 455 },
      stops: [{ t: 0.83, x: 880, y: 340, label: "かど" }],
      tolerance: 72
    },
    {
      id: "final-2",
      label: "ぼうけん 2",
      level: "まとめ",
      skill: "長い道を最後までなぞる",
      path: "M 125 455 C 215 140 395 145 480 310 L 610 310 C 715 115 890 170 850 360 L 700 455 L 520 385 L 360 470",
      start: { x: 125, y: 455 },
      end: { x: 360, y: 470 },
      stops: [{ t: 0.44, x: 610, y: 310, label: "かど" }],
      tolerance: 70
    }
  ];

  window.SEN_COURSES = courses;
  window.SEN_COURSE_MAP = new Map(courses.map((course) => [course.id, course]));
})();
