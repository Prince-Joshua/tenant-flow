export type DiffToken = { type: "same" | "added" | "removed"; text: string };

function tokenize(text: string): string[] {
  return text.match(/\S+|\s+/g) || [];
}

export function diffWords(oldText: string, newText: string): DiffToken[] {
  const a = tokenize(oldText);
  const b = tokenize(newText);
  const n = a.length;
  const m = b.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0),
  );
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const tokens: DiffToken[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      tokens.push({ type: "same", text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      tokens.push({ type: "removed", text: a[i] });
      i++;
    } else {
      tokens.push({ type: "added", text: b[j] });
      j++;
    }
  }
  while (i < n) {
    tokens.push({ type: "removed", text: a[i] });
    i++;
  }
  while (j < m) {
    tokens.push({ type: "added", text: b[j] });
    j++;
  }

  const merged: DiffToken[] = [];
  for (const token of tokens) {
    const last = merged[merged.length - 1];
    if (last && last.type === token.type) {
      last.text += token.text;
    } else {
      merged.push({ ...token });
    }
  }
  return merged;
}

export function diffWordCounts(tokens: DiffToken[]) {
  const count = (type: DiffToken["type"]) =>
    tokens
      .filter((t) => t.type === type)
      .reduce(
        (n, t) => n + (t.text.trim() ? t.text.trim().split(/\s+/).length : 0),
        0,
      );
  return { added: count("added"), removed: count("removed") };
}
