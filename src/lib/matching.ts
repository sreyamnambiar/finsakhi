import { OPPORTUNITIES, Opportunity } from "@/data/opportunities";

/**
 * Basic matching function:
 * - Score = fraction of selected skill tags matched (0..1)
 * - +0.3 bonus if location contains provided location (case-insensitive)
 * - Returns list sorted by score desc, limited by maxResults
 *
 * This is intentionally simple so it can be replaced by a server-side
 * recommender later.
 */
export function matchOpportunities(selectedSkills: string[], location?: string, maxResults = 10): Opportunity[] {
  const normalizedLocation = (location || "").trim().toLowerCase();

  const scored = OPPORTUNITIES.map((op) => {
    const skillsMatched = selectedSkills.length
      ? op.skills.filter((s) => selectedSkills.map((x) => x.toLowerCase()).includes(s.toLowerCase()))
      : [];
    const skillScore = selectedSkills.length ? skillsMatched.length / selectedSkills.length : 0;
    const locationMatch = normalizedLocation && op.location.toLowerCase().includes(normalizedLocation) ? 0.3 : 0;
    const score = Math.min(1, skillScore + locationMatch);
    return { op, score };
  });

  const sorted = scored
    .filter((s) => s.score > 0) // only show opportunities with some score; change if you prefer to show all
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.op);

  return sorted;
}
