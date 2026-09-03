/**
 * Fixed identities used by the password-less demo sign-in. Only reachable while
 * DEMO_MODE is enabled, which start-up validation forbids in production.
 */
export const DEMO_USERS = {
  candidate: {
    id: 'demo-candidate',
    name: 'Alex Rivera',
    email: 'alex.rivera@demo.local',
    role: 'candidate',
    title: 'Full Stack Engineer Candidate',
    stats: { interviewsCompleted: 12, problemsSolved: 48, averageScore: 88 },
  },
  interviewer: {
    id: 'demo-interviewer',
    name: 'Sarah Chen',
    email: 'sarah.chen@demo.local',
    role: 'interviewer',
    title: 'Principal Software Architect',
    stats: { interviewsCompleted: 85, problemsSolved: 120, averageScore: 92 },
  },
  admin: {
    id: 'demo-admin',
    name: 'Marcus Vance',
    email: 'marcus.vance@demo.local',
    role: 'admin',
    title: 'Head of Technical Recruiting',
    stats: { interviewsCompleted: 400, problemsSolved: 350, averageScore: 95 },
  },
};

export const getDemoUser = (role) => DEMO_USERS[role] || null;
