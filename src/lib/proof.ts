/**
 * Public Elon/TUEL proof copy lock.
 *
 * Use these honest floors, not synced exacts. This is a copy lock, not a new claim.
 * Next public bumps (do not use yet): 300+, 95%+.
 * Never publish 90%+ for adoption.
 * Never claim a perfect error rate. Never round 846 sessions past 800+.
 */

export const elonAcademicProof = {
  institution: "Elon University",
  deploymentWindow: "Spring 2026",
  activeUsers: "250+",
  voluntaryAdoption: "80%+",
  averageExamScore: "90%+",
  examScoreQualifier: "among engaged weekly users",
} as const;

export const elonOperationalProof = {
  totalTokens: "100M+",
  sessions: "800+",
  errorRate: "about 2%",
} as const;

export const elonProofHighlights = [
  {
    text: `${elonAcademicProof.activeUsers} users`,
    title: `${elonAcademicProof.deploymentWindow} Elon deployment cohort`,
  },
  {
    text: `${elonAcademicProof.voluntaryAdoption} voluntary adoption`,
    title: "Students chose to use the tutor",
  },
  {
    text: `${elonAcademicProof.averageExamScore} exam average`,
    title: `${elonAcademicProof.examScoreQualifier}, ${elonAcademicProof.deploymentWindow}`,
  },
] as const;

export function formatElonAcademicProofLine(): string {
  return [
    `${elonAcademicProof.activeUsers} users`,
    `${elonAcademicProof.voluntaryAdoption} voluntary adoption`,
    `${elonAcademicProof.averageExamScore} exam average ${elonAcademicProof.examScoreQualifier}`,
  ].join(", ");
}
