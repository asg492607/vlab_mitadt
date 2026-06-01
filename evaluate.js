// Evaluation and exam helpers (local-only)
export function makeReport({ student, labId, score, remarks, details }) {
  return {
    student: student ?? "Anonymous",
    lab: labId ?? "Untitled Lab",
    score: Math.max(0, Math.min(100, Math.round(score ?? 0))),
    remarks: remarks ?? "",
    details: details ?? [],
    generatedAt: new Date().toISOString(),
  };
}

export function evaluateLab({ model, lab }) {
  // Heuristic scoring framework: each lab defines a list of checks.
  // Checks return { ok, points, remark }.
  const details = [];
  let total = 0;
  let earned = 0;
  for (const check of lab.checks ?? []) {
    const res = check(model);
    total += res.points ?? 0;
    if (res.ok) earned += res.points ?? 0;
    details.push({
      ok: !!res.ok,
      points: res.points ?? 0,
      remark: res.remark ?? "",
    });
  }
  const score = total > 0 ? (earned / total) * 100 : 0;
  const remarks = summarizeRemarks(details);
  return makeReport({ labId: lab.id, score, remarks, details });
}

function summarizeRemarks(details) {
  const bad = details.filter((d) => !d.ok);
  if (!bad.length) return "All checks passed.";
  const top = bad.slice(0, 3).map((d) => d.remark).filter(Boolean);
  return top.length ? top.join(" ") : "Some checks failed.";
}

export function gradeMcq({ questions, answers }) {
  let correct = 0;
  const details = [];
  for (const q of questions ?? []) {
    const a = answers?.[q.id];
    const ok = a === q.correct;
    if (ok) correct++;
    details.push({ id: q.id, ok, correct: q.correct, chosen: a ?? null });
  }
  const score = (correct / Math.max(1, questions?.length ?? 0)) * 100;
  return { score, details };
}

