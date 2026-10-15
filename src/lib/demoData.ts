import type { StudentProfile, MockTestResult, ChapterTestResult } from '@/types';

export function getDemoProfile(): StudentProfile {
  return {
    name: 'Demo Student',
    isDemo: true,
    targetExam: 'JEE Main 2026',
    targetPercentile: 95,
    dailyStudyHours: 6,
    prepLevel: 'Intermediate',
    createdAt: new Date().toISOString(),
    chapters: [
      { name: 'Current Electricity', subject: 'Physics', proficiency: 'weak' },
      { name: 'Dual Nature of Matter and Radiation', subject: 'Physics', proficiency: 'average' },
      { name: 'Rotational Motion', subject: 'Physics', proficiency: 'weak' },
      { name: 'Electrostatics', subject: 'Physics', proficiency: 'average' },
      { name: 'Chemical Bonding and Molecular Structure', subject: 'Chemistry', proficiency: 'strong' },
      { name: 'Equilibrium', subject: 'Chemistry', proficiency: 'weak' },
      { name: 'Coordination Compounds', subject: 'Chemistry', proficiency: 'average' },
      { name: 'Aldehydes, Ketones and Carboxylic Acids', subject: 'Chemistry', proficiency: 'weak' },
      { name: 'Differentiation', subject: 'Mathematics', proficiency: 'average' },
      { name: 'Indefinite Integration', subject: 'Mathematics', proficiency: 'weak' },
      { name: 'Conic Sections', subject: 'Mathematics', proficiency: 'average' },
      { name: 'Probability', subject: 'Mathematics', proficiency: 'strong' },
    ],
  };
}

export function getDemoMockTests(): MockTestResult[] {
  const now = Date.now();
  return [
    {
      id: 'demo-1',
      date: new Date(now - 1000 * 60 * 60 * 24 * 14).toISOString(),
      physicsScore: 45,
      chemistryScore: 62,
      mathScore: 38,
      totalScore: 145,
      maxTotal: 300,
    },
    {
      id: 'demo-2',
      date: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
      physicsScore: 52,
      chemistryScore: 68,
      mathScore: 41,
      totalScore: 161,
      maxTotal: 300,
    },
    {
      id: 'demo-3',
      date: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      physicsScore: 58,
      chemistryScore: 71,
      mathScore: 48,
      totalScore: 177,
      maxTotal: 300,
      chapterResults: [
        { subject: 'Physics', chapter: 'Current Electricity', correct: 3, wrong: 5, unattempted: 2, maxMarks: 20, marksObtained: 12 },
        { subject: 'Physics', chapter: 'Rotational Motion', correct: 2, wrong: 4, unattempted: 3, maxMarks: 20, marksObtained: 8 },
        { subject: 'Physics', chapter: 'Electrostatics', correct: 6, wrong: 2, unattempted: 1, maxMarks: 20, marksObtained: 24 },
        { subject: 'Chemistry', chapter: 'Chemical Bonding and Molecular Structure', correct: 7, wrong: 1, unattempted: 1, maxMarks: 20, marksObtained: 28 },
        { subject: 'Chemistry', chapter: 'Equilibrium', correct: 2, wrong: 3, unattempted: 4, maxMarks: 20, marksObtained: 8 },
        { subject: 'Chemistry', chapter: 'Coordination Compounds', correct: 5, wrong: 2, unattempted: 1, maxMarks: 20, marksObtained: 20 },
        { subject: 'Mathematics', chapter: 'Differentiation', correct: 4, wrong: 3, unattempted: 2, maxMarks: 20, marksObtained: 16 },
        { subject: 'Mathematics', chapter: 'Indefinite Integration', correct: 1, wrong: 4, unattempted: 3, maxMarks: 20, marksObtained: 4 },
        { subject: 'Mathematics', chapter: 'Conic Sections', correct: 5, wrong: 2, unattempted: 1, maxMarks: 20, marksObtained: 20 },
      ] as ChapterTestResult[],
    },
  ];
}
