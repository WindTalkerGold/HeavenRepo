"use strict";

/* ============================================================
   五线谱渲染
   ------------------------------------------------------------
   把一个音（来自 sound.js 的 NOTE_MAP，均为 C 大调自然音，无升降号）
   画成五线谱 SVG：五条线 + 谱号 + 符头 + 加线，音区太高/太低时用
   8va / 15ma / 8vb / 15mb 高低八度记号，避免出现一大堆加线。
   ============================================================ */

(function () {
  const LETTER_STEP = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

  // 把自然音换算成"自然音级序号"：同一序号 = 五线谱上同一行/间
  function diatonicStep(note) {
    return note.octave * 7 + LETTER_STEP[note.name[0]];
  }

  // 高低八度记号文字
  function ottavaLabel(k) {
    return { "2": "15ma", "1": "8va", "-1": "8vb", "-2": "15mb" }[String(k)] || "";
  }

  function renderNoteStaff(note, opts) {
    opts = opts || {};
    const mini = !!opts.mini;
    const gap = mini ? 8 : 11;           // 相邻两条谱线的间距
    const half = gap / 2;                // 一个音级 = 半个间距
    const marginTop = gap * 4.6;
    const marginBottom = gap * 3.2;
    const marginLeft = gap * 0.5;
    const staffTop = marginTop;
    const lineYs = [0, 1, 2, 3, 4].map(i => staffTop + i * gap); // 上->下
    const bottomY = lineYs[4];
    const W = opts.w || (mini ? 120 : 168);
    const H = bottomY + marginBottom;
    const noteX = W - gap * 3;

    const step = diatonicStep(note);

    // 选谱号：中央 C(=自然音级28) 及以上用高音谱号，否则用低音谱号
    let clef, base;
    if (step >= 28) { clef = "treble"; base = 30; } // 高音谱号最下面一线 = E4(step30)
    else { clef = "bass"; base = 18; }              // 低音谱号最下面一线 = G2(step18)

    // 用八度记号把音收进谱表附近（最多 ±2 个八度）
    let k = 0, sDraw = step;
    while ((sDraw - base) > 9 && k < 2) { sDraw -= 7; k++; }
    while ((sDraw - base) < -3 && k > -2) { sDraw += 7; k--; }
    const p = sDraw - base;              // 0 = 最下面一线，向上为正
    const yFor = pos => bottomY - pos * half;
    const noteY = yFor(p);

    const cLine = "#aab2e0", cNote = "#ffd166", cText = "#e8ecff", cOtt = "#06d6a0";
    let svg = `<svg class="staff-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`;

    // 五条谱线
    for (const y of lineYs) {
      svg += `<line x1="${marginLeft + gap * 2.2}" y1="${y}" x2="${W - 4}" y2="${y}" stroke="${cLine}" stroke-width="1.1"/>`;
    }

    // 加线（谱表之外）
    const ledgerHalf = gap * 1.1;
    if (p < 0) for (let q = -2; q >= p; q -= 2) svg += ledgerLine(yFor(q));
    if (p > 8) for (let q = 10; q <= p; q += 2) svg += ledgerLine(yFor(q));
    function ledgerLine(y) {
      return `<line x1="${noteX - ledgerHalf}" y1="${y}" x2="${noteX + ledgerHalf}" y2="${y}" stroke="${cLine}" stroke-width="1.1"/>`;
    }

    // 谱号（用 Unicode 音乐符号，带字体回退）
    const clefChar = clef === "treble" ? "\uD834\uDD1E" : "\uD834\uDD22";
    const clefY = clef === "treble" ? bottomY + gap * 0.35 : staffTop + gap * 2.55;
    const clefSize = clef === "treble" ? gap * 4.2 : gap * 2.9;
    svg += `<text x="${marginLeft}" y="${clefY}" font-size="${clefSize}" fill="${cText}" `
      + `font-family="Bravura,'Segoe UI Symbol','Noto Music','Apple Symbols',serif">${clefChar}</text>`;

    // 符干
    const stemLen = gap * 2.6;
    if (p < 4) svg += `<line x1="${noteX + gap * 0.55}" y1="${noteY}" x2="${noteX + gap * 0.55}" y2="${noteY - stemLen}" stroke="${cNote}" stroke-width="1.6"/>`;
    else svg += `<line x1="${noteX - gap * 0.55}" y1="${noteY}" x2="${noteX - gap * 0.55}" y2="${noteY + stemLen}" stroke="${cNote}" stroke-width="1.6"/>`;

    // 符头（略微倾斜的椭圆）
    const rx = gap * 0.62, ry = gap * 0.46;
    svg += `<ellipse cx="${noteX}" cy="${noteY}" rx="${rx}" ry="${ry}" fill="${cNote}" transform="rotate(-18 ${noteX} ${noteY})"/>`;

    // 八度记号（放在音符外侧，避免和符头/加线重叠）
    const ott = ottavaLabel(k);
    if (ott) {
      const oy = k > 0
        ? Math.min(staffTop - gap * 0.5, noteY - gap * 1.0)
        : Math.max(bottomY + gap * 1.6, noteY + gap * 1.8);
      svg += `<text x="${noteX}" y="${oy}" font-size="${gap * 1.1}" fill="${cOtt}" `
        + `font-style="italic" text-anchor="middle">${ott}</text>`;
    }

    svg += `</svg>`;
    return svg;
  }

  window.renderNoteStaff = renderNoteStaff;
})();
