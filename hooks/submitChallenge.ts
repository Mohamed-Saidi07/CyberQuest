// submitChallenge.ts
import axios from 'axios';
import { BADGE_DEFINITIONS, RANKS } from '@/lib/game-store';
import { Badge, ChallengeResult, UserProgress } from '@/lib/types';


function calculateRank(points: number): string {
  let rank = RANKS[0].name;
  for (const r of RANKS) {
    if (points >= r.minPoints) rank = r.name;
  }
  return rank;
}

function checkBadges(progress: UserProgress, result?: ChallengeResult, totalChallenges?: number): Badge[] {
  const newBadges: Badge[] = [];
  const hasBadge = (id: string) => progress.badges.some(b => b.id === id);

  if (progress.completedChallenges.length >= 1 && !hasBadge('first-challenge')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'first-challenge')!, earnedAt: new Date().toISOString() });
  }
  if (result && result.score === result.maxScore && !hasBadge('perfect-score')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'perfect-score')!, earnedAt: new Date().toISOString() });
  }
  if (progress.streak >= 3 && !hasBadge('streak-3')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'streak-3')!, earnedAt: new Date().toISOString() });
  }
  if (progress.streak >= 7 && !hasBadge('streak-7')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'streak-7')!, earnedAt: new Date().toISOString() });
  }
  if (progress.completedChallenges.length >= 10 && !hasBadge('10-challenges')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === '10-challenges')!, earnedAt: new Date().toISOString() });
  }
  if (result && result.timeSpent < 30 && !hasBadge('speed-demon')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'speed-demon')!, earnedAt: new Date().toISOString() });
  }
  if (progress.odisityPoints >= 1000 && !hasBadge('points-1000')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'points-1000')!, earnedAt: new Date().toISOString() });
  }
  if (totalChallenges && progress.completedChallenges.length >= Math.floor(totalChallenges / 2) && !hasBadge('half-complete')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'half-complete')!, earnedAt: new Date().toISOString() });
  }

  return newBadges;
}

export async function submitChallenge(
  result: ChallengeResult,
  clerkId: string,
  totalChallenges = 24
): Promise<{ progress: UserProgress; newBadges: Badge[] }> {
  try {
    // 1️⃣ Fetch real user profile from backend
    const { data: profile } = await axios.get(`/api/user/get-profile?clerkId=${clerkId}`);
    const progress: UserProgress = profile.user;

    const alreadyCompleted = progress.completedChallenges.includes(result.challengeId);

    if (!alreadyCompleted) {
      progress.completedChallenges.push(result.challengeId);
      progress.odisityPoints += result.pointsEarned;
      progress.streak += 1;
    }

    const prevScore = progress.challengeScores[result.challengeId] || 0;
    if (result.score > prevScore) {
      progress.challengeScores[result.challengeId] = result.score;

      if (alreadyCompleted) {
        const pointDiff = result.pointsEarned - Math.floor((prevScore / result.maxScore) * result.pointsEarned);
        if (pointDiff > 0) progress.odisityPoints += pointDiff;
      }
    }

    progress.rank = calculateRank(progress.odisityPoints);

    // Check badges locally first
    const newBadges = checkBadges(progress, result, totalChallenges);
    progress.badges = [...progress.badges, ...newBadges];

    // 2️⃣ Update backend
    await axios.post('/api/user/progress', {
      clerkId,
      challengeResult: result,
      newBadges,
      updatedRank: progress.rank,
    });

    return { progress, newBadges };
  } catch (err) {
    console.error('Error submitting challenge', err);
    throw err;
  }
}
