export type BiasItem = {
  id: string;
  bugSnippet: string;
  patchGoal: string;
};

/** Interleaved static “code” and tappable bug ids for corrupted_logic.js */
export type CodeSegment =
  | { kind: "text"; value: string }
  | { kind: "bug"; id: string };

export const SECRET_PHRASE = "BIAS ENDS WHERE COURAGE BEGINS";

export const BIASES: BiasItem[] = [
  {
    id: "b1",
    bugSnippet: "She's too emotional for leadership.",
    patchGoal: "Resilience / empathy in leadership",
  },
  {
    id: "b2",
    bugSnippet: "Diversity hires lower the bar.",
    patchGoal: "Innovation through diverse teams",
  },
  {
    id: "b3",
    bugSnippet: "Technical roles are for the boys.",
    patchGoal: "BuildHers+ / everyone belongs in tech",
  },
  {
    id: "b4",
    bugSnippet: "She'll probably quit when she has kids.",
    patchGoal: "Career continuity & support",
  },
  {
    id: "b5",
    bugSnippet: "Women aren't wired for abstract thinking.",
    patchGoal: "Same capability; different bias",
  },
  {
    id: "b6",
    bugSnippet: "She got promoted for optics, not output.",
    patchGoal: "Credit real impact & results",
  },
  {
    id: "b7",
    bugSnippet: "Negotiating hard reads as difficult on her.",
    patchGoal: "Fair standards for self-advocacy",
  },
  {
    id: "b8",
    bugSnippet: "Moms belong on the mommy track, not the critical path.",
    patchGoal: "Parents on core work — period",
  },
  {
    id: "b9",
    bugSnippet: "She's good with people, not systems.",
    patchGoal: "Technical depth has no gender",
  },
  {
    id: "b10",
    bugSnippet: "Gender parity means lowering standards for women.",
    patchGoal: "Equity raises the bar for everyone",
  },
  {
    id: "b11",
    bugSnippet: "She's bossy when she leads like the guys do.",
    patchGoal: "Same behavior, same respect",
  },
  {
    id: "b12",
    bugSnippet: "Real engineers don't need empathy or soft skills.",
    patchGoal: "Empathy is a senior skill",
  },
  {
    id: "b13",
    bugSnippet: "She only got in through the women's program.",
    patchGoal: "Programs open doors; talent keeps them",
  },
  {
    id: "b14",
    bugSnippet: "Her assertiveness is tone problems.",
    patchGoal: "Interrupt double standards",
  },
  {
    id: "b15",
    bugSnippet: "STEM was always a boys' club for a reason.",
    patchGoal: "History isn't destiny — change it",
  },
];

export const CORRUPTED_CODE_SEGMENTS: CodeSegment[] = [
  {
    kind: "text",
    value:
      "// BIASWARE runtime — leaked from the wall\n// WARNING: toxic defaults enabled\n\n",
  },
  {
    kind: "text",
    value: "function evaluateTeam(member) {\n",
  },
  {
    kind: "text",
    value: "  if (member.role === 'lead') {\n    assert(",
  },
  { kind: "bug", id: "b1" },
  {
    kind: "text",
    value: ");\n  }\n\n",
  },
  {
    kind: "text",
    value: "  if (hiring.strategy === 'inclusive') {\n    penalize(",
  },
  { kind: "bug", id: "b2" },
  {
    kind: "text",
    value: ");\n  }\n\n",
  },
  {
    kind: "text",
    value:
      "  // roster: who counts as 'technical'\n  if (member.track === 'engineering') {\n    requireGenderGate(",
  },
  { kind: "bug", id: "b3" },
  {
    kind: "text",
    value: ");\n  }\n\n",
  },
  {
    kind: "text",
    value: "  if (member.gender === 'F' && member.onCall === true) {\n    // flavor: classic stereotype\n    if (engineer === 'female') {\n      askForHelp();\n    }\n    downgrade(",
  },
  { kind: "bug", id: "b4" },
  {
    kind: "text",
    value: ");\n  }\n\n",
  },
  {
    kind: "text",
    value: "  cognition.assert(",
  },
  { kind: "bug", id: "b5" },
  {
    kind: "text",
    value: ");\n\n",
  },
  {
    kind: "text",
    value: "  promotions.applyHeuristic(",
  },
  { kind: "bug", id: "b6" },
  {
    kind: "text",
    value: ");\n\n",
  },
  {
    kind: "text",
    value: "  compReview.if (member.negotiates) {\n    flag(",
  },
  { kind: "bug", id: "b7" },
  {
    kind: "text",
    value: ");\n  }\n\n",
  },
  {
    kind: "text",
    value: "  policy.routeParents(",
  },
  { kind: "bug", id: "b8" },
  {
    kind: "text",
    value: ");\n\n",
  },
  {
    kind: "text",
    value: "  skills.bin(",
  },
  { kind: "bug", id: "b9" },
  {
    kind: "text",
    value: ", 'communication_only');\n\n",
  },
  {
    kind: "text",
    value: "  paritySettings.ifEnabled(() => assume(",
  },
  { kind: "bug", id: "b10" },
  {
    kind: "text",
    value: "));\n\n",
  },
  {
    kind: "text",
    value: "  leadership.styleAudit(member, (traits) => label(",
  },
  { kind: "bug", id: "b11" },
  {
    kind: "text",
    value: "));\n\n",
  },
  {
    kind: "text",
    value: "  culture.require(",
  },
  { kind: "bug", id: "b12" },
  {
    kind: "text",
    value: ");\n\n",
  },
  {
    kind: "text",
    value: "  pipeline.traceOrigin(member, ",
  },
  { kind: "bug", id: "b13" },
  {
    kind: "text",
    value: ");\n\n",
  },
  {
    kind: "text",
    value: "  feedback.tonePolice(",
  },
  { kind: "bug", id: "b14" },
  {
    kind: "text",
    value: ");\n\n",
  },
  {
    kind: "text",
    value: "  return wall.seal()\n    && legacyMyth(",
  },
  { kind: "bug", id: "b15" },
  {
    kind: "text",
    value: ");\n}\n",
  },
];

function normalizePhrase(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isValidSecretPhrase(input: string): boolean {
  return normalizePhrase(input) === normalizePhrase(SECRET_PHRASE);
}
