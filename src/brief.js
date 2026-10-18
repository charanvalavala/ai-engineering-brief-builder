const requiredFields = ["project", "goal", "criteria", "verification"];

export function readiness(fields) {
  const complete = requiredFields.filter((key) => String(fields[key] ?? "").trim().length > 0).length;
  return { complete, total: requiredFields.length, percent: Math.round((complete / requiredFields.length) * 100) };
}

export function buildBrief(fields) {
  const status = readiness(fields);
  if (status.complete !== status.total) throw new Error("Complete project, goal, acceptance criteria, and verification before building the brief.");
  const lines = [
    `# ${String(fields.project).trim()} — implementation brief`,
    "",
    "## Goal",
    String(fields.goal).trim(),
    "",
    "## Acceptance criteria",
    ...String(fields.criteria).split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => `- [ ] ${line.replace(/^[-*]\s*/, "")}`),
    "",
    "## Verification plan",
    ...String(fields.verification).split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => `- ${line.replace(/^[-*]\s*/, "")}`),
    "",
    "## Constraints and context",
    String(fields.constraints ?? "").trim() || "No additional constraints supplied.",
    "",
    "## Completion report",
    "- Checks actually run:",
    "- Results observed:",
    "- Known limitations:",
    "",
    "Only report measurements and checks that were actually run.",
  ];
  return lines.join("\n");
}
