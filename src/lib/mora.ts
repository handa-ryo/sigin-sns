/**
 * 簡易な拍(モーラ)数カウント。
 *
 * 漢字は読みを持たないため 1 文字 = 1 拍として近似する。
 * ひらがな・カタカナは以下のルールで数える:
 *  - 拗音(ゃゅょ等の小書き文字)は直前の文字と結合し、拍を増やさない
 *  - 促音(っ/ッ)・撥音(ん/ン)・長音符(ー)は 1 拍として数える
 *  - 空白・句読点・記号は数えない
 */

const SMALL_COMBINING = new Set([
  "ゃ", "ゅ", "ょ", "ゎ",
  "ャ", "ュ", "ョ", "ヮ",
  "ぁ", "ぃ", "ぅ", "ぇ", "ぉ",
  "ァ", "ィ", "ゥ", "ェ", "ォ",
]);

const IGNORED = new Set([
  " ", "\t", "\n", "\r", "　",
  "、", "。", "，", "．", ",", ".", "!", "?", "！", "？",
  "「", "」", "『", "』", "(", ")", "（", "）", "・", "…", "-", "~", "〜",
]);

export function countMora(text: string): number {
  const chars = Array.from(text.normalize("NFC"));
  let count = 0;
  for (const ch of chars) {
    if (IGNORED.has(ch)) continue;
    if (SMALL_COMBINING.has(ch)) continue;
    count++;
  }
  return count;
}

export type LineJudgement = "exact" | "short" | "long" | "invalid";

export interface LineResult {
  text: string;
  mora: number;
  target: number;
  diff: number;
  judgement: LineJudgement;
}

/** 目標拍数からの許容差。±1 拍までは字足らず・字余りとして許容する。 */
export const TOLERANCE = 1;

export function judgeLine(text: string, target: number): LineResult {
  const mora = countMora(text);
  const diff = mora - target;
  let judgement: LineJudgement;
  if (diff === 0) judgement = "exact";
  else if (Math.abs(diff) <= TOLERANCE) judgement = diff < 0 ? "short" : "long";
  else judgement = "invalid";
  return { text, mora, target, diff, judgement };
}

export interface PoemResult {
  lines: [LineResult, LineResult, LineResult];
  isValid: boolean;
  isPerfect: boolean;
}

export function judgePoem(line1: string, line2: string, line3: string): PoemResult {
  const lines: [LineResult, LineResult, LineResult] = [
    judgeLine(line1, 5),
    judgeLine(line2, 7),
    judgeLine(line3, 5),
  ];
  const isValid = lines.every((l) => l.text.trim().length > 0 && l.judgement !== "invalid");
  const isPerfect = lines.every((l) => l.judgement === "exact");
  return { lines, isValid, isPerfect };
}

export const LINE_LABELS = ["上の句 (5拍)", "中の句 (7拍)", "下の句 (5拍)"] as const;

export function judgementLabel(j: LineJudgement): string {
  switch (j) {
    case "exact":
      return "ちょうど";
    case "short":
      return "字足らず";
    case "long":
      return "字余り";
    case "invalid":
      return "拍数が合いません";
  }
}
