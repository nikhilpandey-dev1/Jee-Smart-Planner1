import type { WeightageRecord, Subject, WeightageLevel, EvidenceLevel, SourceType } from '@/types';
import { SYLLABUS, findSyllabusChapter } from '@/data/chapters';

/**
 * High-weightage chapter estimates based on historical JEE question trends.
 *
 * IMPORTANT: These are NOT officially published chapter weightages by NTA or JEE Advanced.
 * NTA and JEE Advanced do not publish official chapter-wise weightage.
 * These estimates are derived from analysis of past years' question papers and
 * coaching institute trend analyses. They are indicative, not definitive.
 *
 * To update this data, replace the records below with the latest verified analysis.
 * The `lastUpdated` field tracks data freshness.
 *
 * Records use the new WeightageRecord format:
 *   exam: 'main' | 'advanced'
 *   chapterId: matches the chapter name in SYLLABUS
 *   category: qualitative (Very High / High / Moderate / Lower)
 *   evidenceLevel: strong / moderate / limited
 *   sourceType: historical-analysis / expert-review / trend-estimate
 *
 * No fake percentages are used. Categories are qualitative.
 */

export const WEIGHTAGE_DATA: WeightageRecord[] = [
  // ===================== JEE MAIN =====================
  // Physics
  { exam: 'main', subject: 'Physics', chapterId: 'Current Electricity', chapterName: 'Current Electricity', category: 'Very High', evidenceLevel: 'strong', explanation: 'Consistently appears with multiple questions across sessions; Kirchhoff and circuit analysis are core', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Electrostatics', chapterName: 'Electrostatics', category: 'Very High', evidenceLevel: 'strong', explanation: 'Frequently appears with 2-3 questions per session; Gauss law and field problems are common', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Kinematics', chapterName: 'Kinematics', category: 'High', evidenceLevel: 'strong', explanation: '1-2 questions per session, often mixed with other topics', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Laws of Motion', chapterName: 'Laws of Motion', category: 'High', evidenceLevel: 'strong', explanation: 'Regularly 1-2 questions; friction-based problems are common', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Rotational Motion', chapterName: 'Rotational Motion', category: 'High', evidenceLevel: 'strong', explanation: '2-3 questions per session; rolling and torque problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Thermodynamics', chapterName: 'Thermodynamics', category: 'High', evidenceLevel: 'strong', explanation: 'Consistent 2 questions per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Moving Charges and Magnetism', chapterName: 'Moving Charges and Magnetism', category: 'High', evidenceLevel: 'strong', explanation: '1-2 questions; Biot-Savart and Ampere law problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Ray Optics', chapterName: 'Ray Optics', category: 'High', evidenceLevel: 'moderate', explanation: '1-2 questions per session; lens and prism problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Work, Energy and Power', chapterName: 'Work, Energy and Power', category: 'Moderate', evidenceLevel: 'strong', explanation: '1 question per session; often collision problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Waves', chapterName: 'Waves', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session; Doppler effect is common', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Oscillations', chapterName: 'Oscillations', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session; SHM problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Electromagnetic Induction', chapterName: 'Electromagnetic Induction', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Dual Nature of Matter and Radiation', chapterName: 'Dual Nature of Matter and Radiation', category: 'High', evidenceLevel: 'strong', explanation: '1-2 questions; photoelectric effect is common', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Semiconductor Electronics', chapterName: 'Semiconductor Electronics', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session; logic gates', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Gravitation', chapterName: 'Gravitation', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Capacitance', chapterName: 'Capacitance', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Alternating Current', chapterName: 'Alternating Current', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session; LCR circuit problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Properties of Solids and Liquids', chapterName: 'Properties of Solids and Liquids', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question; surface tension or viscosity', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Kinetic Theory of Gases', chapterName: 'Kinetic Theory of Gases', category: 'Lower', evidenceLevel: 'moderate', explanation: 'Occasional 1 question', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Magnetism and Matter', chapterName: 'Magnetism and Matter', category: 'Lower', evidenceLevel: 'moderate', explanation: 'Rare; 0-1 questions', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Electromagnetic Waves', chapterName: 'Electromagnetic Waves', category: 'Lower', evidenceLevel: 'moderate', explanation: 'Rare; 0-1 questions', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Wave Optics', chapterName: 'Wave Optics', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question; YDSE is common', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Units, Dimensions and Measurement', chapterName: 'Units, Dimensions and Measurement', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question; dimensional analysis', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Experimental Physics', chapterName: 'Experimental Physics', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question; practical-based', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Atoms', chapterName: 'Atoms', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question; Bohr model', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Physics', chapterId: 'Nuclei', chapterName: 'Nuclei', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question; nuclear reactions', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },

  // Chemistry — JEE Main
  { exam: 'main', subject: 'Chemistry', chapterId: 'Some Basic Concepts of Chemistry', chapterName: 'Some Basic Concepts of Chemistry', category: 'High', evidenceLevel: 'strong', explanation: 'Mole concept and stoichiometry: 2 questions per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Chemical Bonding and Molecular Structure', chapterName: 'Chemical Bonding and Molecular Structure', category: 'Very High', evidenceLevel: 'strong', explanation: '2-3 questions per session; hybridization and MOT', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Equilibrium', chapterName: 'Equilibrium', category: 'High', evidenceLevel: 'strong', explanation: '2 questions per session; ionic equilibrium is common', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Electrochemistry', chapterName: 'Electrochemistry', category: 'High', evidenceLevel: 'strong', explanation: '1-2 questions; Nernst equation', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Chemical Kinetics', chapterName: 'Chemical Kinetics', category: 'High', evidenceLevel: 'strong', explanation: '1-2 questions; rate law and half-life', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Thermodynamics', chapterName: 'Thermodynamics', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Atomic Structure', chapterName: 'Atomic Structure', category: 'High', evidenceLevel: 'strong', explanation: '1-2 questions; quantum numbers', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Redox Reactions', chapterName: 'Redox Reactions', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question; balancing', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Solutions', chapterName: 'Solutions', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question; colligative properties', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Classification of Elements and Periodicity', chapterName: 'Classification of Elements and Periodicity', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question; periodic trends', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'p-Block Elements (Group 13-14)', chapterName: 'p-Block Elements (Group 13-14)', category: 'High', evidenceLevel: 'strong', explanation: '2 questions per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'p-Block Elements (Group 15-18)', chapterName: 'p-Block Elements (Group 15-18)', category: 'High', evidenceLevel: 'strong', explanation: '2 questions per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'd- and f-Block Elements', chapterName: 'd- and f-Block Elements', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Coordination Compounds', chapterName: 'Coordination Compounds', category: 'Very High', evidenceLevel: 'strong', explanation: '2-3 questions per session; CFT and isomerism', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Some Basic Principles of Organic Chemistry', chapterName: 'Some Basic Principles of Organic Chemistry', category: 'High', evidenceLevel: 'strong', explanation: '2 questions; isomerism and nomenclature', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Hydrocarbons', chapterName: 'Hydrocarbons', category: 'High', evidenceLevel: 'strong', explanation: '2 questions; aromaticity and reactions', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Haloalkanes and Haloarenes', chapterName: 'Haloalkanes and Haloarenes', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Alcohols, Phenols and Ethers', chapterName: 'Alcohols, Phenols and Ethers', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Aldehydes, Ketones and Carboxylic Acids', chapterName: 'Aldehydes, Ketones and Carboxylic Acids', category: 'High', evidenceLevel: 'strong', explanation: '1-2 questions; nucleophilic addition', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Chemistry', chapterId: 'Amines', chapterName: 'Amines', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },

  // Mathematics — JEE Main
  { exam: 'main', subject: 'Mathematics', chapterId: 'Conic Sections', chapterName: 'Conic Sections', category: 'Very High', evidenceLevel: 'strong', explanation: '2-3 questions per session; parabola and ellipse', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Differentiation', chapterName: 'Differentiation', category: 'High', evidenceLevel: 'strong', explanation: '1-2 questions per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Application of Derivatives', chapterName: 'Application of Derivatives', category: 'Very High', evidenceLevel: 'strong', explanation: '2-3 questions; maxima/minima and tangents', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Indefinite Integration', chapterName: 'Indefinite Integration', category: 'High', evidenceLevel: 'strong', explanation: '1-2 questions per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Definite Integration', chapterName: 'Definite Integration', category: 'High', evidenceLevel: 'strong', explanation: '1-2 questions; properties of definite integrals', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Probability', chapterName: 'Probability', category: 'High', evidenceLevel: 'strong', explanation: '2 questions per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Vectors', chapterName: 'Vectors', category: 'High', evidenceLevel: 'strong', explanation: '1-2 questions; dot and cross product', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Three-Dimensional Geometry', chapterName: 'Three-Dimensional Geometry', category: 'High', evidenceLevel: 'strong', explanation: '1-2 questions per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Complex Numbers and Quadratic Equations', chapterName: 'Complex Numbers and Quadratic Equations', category: 'High', evidenceLevel: 'strong', explanation: '1-2 questions per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Matrices and Determinants', chapterName: 'Matrices and Determinants', category: 'Very High', evidenceLevel: 'strong', explanation: '2 questions per session; system of equations', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Sequences and Series', chapterName: 'Sequences and Series', category: 'High', evidenceLevel: 'strong', explanation: '1-2 questions; AP/GP problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Trigonometry', chapterName: 'Trigonometry', category: 'High', evidenceLevel: 'strong', explanation: '1-2 questions; equations and identities', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Straight Lines', chapterName: 'Straight Lines', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Circles', chapterName: 'Circles', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Limits and Continuity', chapterName: 'Limits and Continuity', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Differential Equations', chapterName: 'Differential Equations', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Permutations and Combinations', chapterName: 'Permutations and Combinations', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Binomial Theorem', chapterName: 'Binomial Theorem', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Sets, Relations and Functions', chapterName: 'Sets, Relations and Functions', category: 'Moderate', evidenceLevel: 'moderate', explanation: '1 question per session', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'main', subject: 'Mathematics', chapterId: 'Statistics', chapterName: 'Statistics', category: 'Lower', evidenceLevel: 'moderate', explanation: '0-1 questions', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },

  // ===================== JEE ADVANCED =====================
  // Physics
  { exam: 'advanced', subject: 'Physics', chapterId: 'Rotational Motion', chapterName: 'Rotational Motion', category: 'Very High', evidenceLevel: 'strong', explanation: 'Consistently high-weightage; complex multi-concept problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Electrostatics', chapterName: 'Electrostatics', category: 'Very High', evidenceLevel: 'strong', explanation: 'Core topic; Gauss law and field problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Kinematics', chapterName: 'Kinematics', category: 'High', evidenceLevel: 'strong', explanation: 'Projectile motion and relative velocity problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Laws of Motion', chapterName: 'Laws of Motion', category: 'High', evidenceLevel: 'strong', explanation: 'Multi-body system problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Work, Energy and Power', chapterName: 'Work, Energy and Power', category: 'High', evidenceLevel: 'strong', explanation: 'Collision and energy conservation problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Centre of Mass and Linear Momentum', chapterName: 'Centre of Mass and Linear Momentum', category: 'High', evidenceLevel: 'strong', explanation: 'Core Advanced topic; collision and momentum problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Gravitation', chapterName: 'Gravitation', category: 'Moderate', evidenceLevel: 'moderate', explanation: 'Orbital mechanics problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Properties of Solids and Liquids', chapterName: 'Properties of Solids and Liquids', category: 'Moderate', evidenceLevel: 'moderate', explanation: 'Elasticity and fluid problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Thermodynamics', chapterName: 'Thermodynamics', category: 'High', evidenceLevel: 'strong', explanation: 'Carnot cycle and entropy problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Kinetic Theory of Gases', chapterName: 'Kinetic Theory of Gases', category: 'Moderate', evidenceLevel: 'moderate', explanation: 'Degrees of freedom problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Oscillations', chapterName: 'Oscillations', category: 'High', evidenceLevel: 'strong', explanation: 'SHM and coupled oscillation problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Waves', chapterName: 'Waves', category: 'High', evidenceLevel: 'strong', explanation: 'Standing waves and Doppler effect', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Capacitance', chapterName: 'Capacitance', category: 'High', evidenceLevel: 'strong', explanation: 'Circuit and dielectric problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Current Electricity', chapterName: 'Current Electricity', category: 'High', evidenceLevel: 'strong', explanation: 'Kirchhoff and circuit analysis', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Moving Charges and Magnetism', chapterName: 'Moving Charges and Magnetism', category: 'Very High', evidenceLevel: 'strong', explanation: 'Magnetic field and force problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Electromagnetic Induction', chapterName: 'Electromagnetic Induction', category: 'High', evidenceLevel: 'strong', explanation: 'Faraday and inductance problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Alternating Current', chapterName: 'Alternating Current', category: 'Moderate', evidenceLevel: 'moderate', explanation: 'LCR circuit problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Ray Optics', chapterName: 'Ray Optics', category: 'High', evidenceLevel: 'strong', explanation: 'Lens and prism problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Wave Optics', chapterName: 'Wave Optics', category: 'High', evidenceLevel: 'strong', explanation: 'YDSE and diffraction problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Dual Nature of Matter and Radiation', chapterName: 'Dual Nature of Matter and Radiation', category: 'Moderate', evidenceLevel: 'moderate', explanation: 'Photoelectric problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Atoms', chapterName: 'Atoms', category: 'Moderate', evidenceLevel: 'moderate', explanation: 'Bohr model problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Nuclei', chapterName: 'Nuclei', category: 'Moderate', evidenceLevel: 'moderate', explanation: 'Nuclear reaction problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Units, Dimensions and Measurement', chapterName: 'Units, Dimensions and Measurement', category: 'Moderate', evidenceLevel: 'moderate', explanation: 'Dimensional analysis problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Physics', chapterId: 'Experimental Physics', chapterName: 'Experimental Physics', category: 'Moderate', evidenceLevel: 'moderate', explanation: 'Practical-based questions', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },

  // Chemistry — JEE Advanced
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Chemical Bonding and Molecular Structure', chapterName: 'Chemical Bonding and Molecular Structure', category: 'Very High', evidenceLevel: 'strong', explanation: 'Core topic; MOT and hybridization', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Coordination Compounds', chapterName: 'Coordination Compounds', category: 'Very High', evidenceLevel: 'strong', explanation: 'CFT, isomerism, and bonding problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Electrochemistry', chapterName: 'Electrochemistry', category: 'High', evidenceLevel: 'strong', explanation: 'Nernst and electrolysis problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Chemical Kinetics', chapterName: 'Chemical Kinetics', category: 'High', evidenceLevel: 'strong', explanation: 'Rate law and mechanism problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Thermodynamics', chapterName: 'Thermodynamics', category: 'High', evidenceLevel: 'strong', explanation: 'Entropy and Gibbs energy', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Equilibrium', chapterName: 'Equilibrium', category: 'High', evidenceLevel: 'strong', explanation: 'Ionic equilibrium and buffer problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Atomic Structure', chapterName: 'Atomic Structure', category: 'High', evidenceLevel: 'strong', explanation: 'Quantum number problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Some Basic Concepts of Chemistry', chapterName: 'Some Basic Concepts of Chemistry', category: 'Moderate', evidenceLevel: 'moderate', explanation: 'Stoichiometry problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Redox Reactions', chapterName: 'Redox Reactions', category: 'Moderate', evidenceLevel: 'moderate', explanation: 'Balancing and titration problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Solutions', chapterName: 'Solutions', category: 'High', evidenceLevel: 'strong', explanation: 'Colligative properties problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Classification of Elements and Periodicity', chapterName: 'Classification of Elements and Periodicity', category: 'Moderate', evidenceLevel: 'moderate', explanation: 'Periodic trend problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'p-Block Elements (Group 13-14)', chapterName: 'p-Block Elements (Group 13-14)', category: 'High', evidenceLevel: 'strong', explanation: 'Boron and carbon family problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'p-Block Elements (Group 15-18)', chapterName: 'p-Block Elements (Group 15-18)', category: 'High', evidenceLevel: 'strong', explanation: 'Nitrogen and halogen family problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'd- and f-Block Elements', chapterName: 'd- and f-Block Elements', category: 'High', evidenceLevel: 'strong', explanation: 'Transition metal and lanthanide problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Some Basic Principles of Organic Chemistry', chapterName: 'Some Basic Principles of Organic Chemistry', category: 'Very High', evidenceLevel: 'strong', explanation: 'Isomerism and reaction mechanisms', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Hydrocarbons', chapterName: 'Hydrocarbons', category: 'High', evidenceLevel: 'strong', explanation: 'Aromaticity and reaction mechanisms', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Haloalkanes and Haloarenes', chapterName: 'Haloalkanes and Haloarenes', category: 'High', evidenceLevel: 'strong', explanation: 'SN1/SN2 and E1/E2 mechanisms', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Alcohols, Phenols and Ethers', chapterName: 'Alcohols, Phenols and Ethers', category: 'High', evidenceLevel: 'strong', explanation: 'Preparation and reaction problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Aldehydes, Ketones and Carboxylic Acids', chapterName: 'Aldehydes, Ketones and Carboxylic Acids', category: 'Very High', evidenceLevel: 'strong', explanation: 'Nucleophilic addition and aldol problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Chemistry', chapterId: 'Amines', chapterName: 'Amines', category: 'High', evidenceLevel: 'strong', explanation: 'Basicity and diazonium salt problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },

  // Mathematics — JEE Advanced
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Conic Sections', chapterName: 'Conic Sections', category: 'Very High', evidenceLevel: 'strong', explanation: 'Complex multi-part problems; parabola and ellipse', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Complex Numbers and Quadratic Equations', chapterName: 'Complex Numbers and Quadratic Equations', category: 'Very High', evidenceLevel: 'strong', explanation: 'Argand plane and geometry problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Differentiation', chapterName: 'Differentiation', category: 'High', evidenceLevel: 'strong', explanation: 'Chain rule and implicit differentiation', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Application of Derivatives', chapterName: 'Application of Derivatives', category: 'Very High', evidenceLevel: 'strong', explanation: 'Optimization and rate problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Indefinite Integration', chapterName: 'Indefinite Integration', category: 'High', evidenceLevel: 'strong', explanation: 'Integration techniques', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Definite Integration', chapterName: 'Definite Integration', category: 'Very High', evidenceLevel: 'strong', explanation: 'Properties and area problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Probability', chapterName: 'Probability', category: 'High', evidenceLevel: 'strong', explanation: 'Conditional probability and Bayes', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Vectors', chapterName: 'Vectors', category: 'High', evidenceLevel: 'strong', explanation: '3D geometry applications', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Three-Dimensional Geometry', chapterName: 'Three-Dimensional Geometry', category: 'High', evidenceLevel: 'strong', explanation: 'Lines and planes in space', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Matrices and Determinants', chapterName: 'Matrices and Determinants', category: 'High', evidenceLevel: 'strong', explanation: 'System of equations and properties', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Trigonometry', chapterName: 'Trigonometry', category: 'High', evidenceLevel: 'strong', explanation: 'Identities and inverse trig', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Sequences and Series', chapterName: 'Sequences and Series', category: 'High', evidenceLevel: 'strong', explanation: 'Sum and convergence problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Limits and Continuity', chapterName: 'Limits and Continuity', category: 'High', evidenceLevel: 'strong', explanation: 'Continuity and limit problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Differential Equations', chapterName: 'Differential Equations', category: 'Moderate', evidenceLevel: 'moderate', explanation: 'Solution methods', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Permutations and Combinations', chapterName: 'Permutations and Combinations', category: 'High', evidenceLevel: 'strong', explanation: 'Counting and arrangement problems', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Binomial Theorem', chapterName: 'Binomial Theorem', category: 'Moderate', evidenceLevel: 'moderate', explanation: 'Expansion properties', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Sets, Relations and Functions', chapterName: 'Sets, Relations and Functions', category: 'High', evidenceLevel: 'strong', explanation: 'Function properties and composition', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Straight Lines', chapterName: 'Straight Lines', category: 'Moderate', evidenceLevel: 'moderate', explanation: 'Family of lines', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
  { exam: 'advanced', subject: 'Mathematics', chapterId: 'Circles', chapterName: 'Circles', category: 'High', evidenceLevel: 'strong', explanation: 'Family of circles and tangents', lastUpdated: '2025-01-15', sourceType: 'historical-analysis' },
];

export function getWeightageByExam(exam: 'main' | 'advanced'): WeightageRecord[] {
  return WEIGHTAGE_DATA.filter((w) => w.exam === exam);
}

export function getLastUpdatedDate(): string {
  const dates = WEIGHTAGE_DATA.map((w) => w.lastUpdated).sort().reverse();
  return dates[0] ?? 'Unknown';
}

// ──────────────────────────────────────────────────────────────────────────
// VALIDATION
// ──────────────────────────────────────────────────────────────────────────

export interface WeightageValidationError {
  type:
    | 'missing-chapter'
    | 'exam-mismatch'
    | 'duplicate'
    | 'empty-name'
    | 'invalid-subject'
    | 'invalid-category'
    | 'invalid-evidence';
  message: string;
  record?: string;
}

/**
 * Validate all weightage records against the official syllabus.
 * Detects:
 *  - weightage record references a non-existent chapter
 *  - Main weightage points to a non-Main chapter
 *  - Advanced weightage points to a non-Advanced chapter
 *  - duplicate records
 *  - unsupported subject
 *  - empty chapter name
 *  - invalid category or evidence level
 *
 * Returns only VALID records (invalid ones are filtered out).
 */
export function validateWeightageRecords(): {
  valid: WeightageRecord[];
  errors: WeightageValidationError[];
} {
  const errors: WeightageValidationError[] = [];
  const valid: WeightageRecord[] = [];
  const seen = new Set<string>();

  const validCategories: WeightageLevel[] = ['Very High', 'High', 'Moderate', 'Lower'];
  const validEvidence: EvidenceLevel[] = ['strong', 'moderate', 'limited'];
  const validSources: SourceType[] = ['historical-analysis', 'expert-review', 'trend-estimate'];
  const validSubjects: Subject[] = ['Physics', 'Chemistry', 'Mathematics'];

  for (const rec of WEIGHTAGE_DATA) {
    const recordKey = `${rec.exam}-${rec.subject}-${rec.chapterId}`;
    let hasError = false;

    // Duplicate check
    if (seen.has(recordKey)) {
      errors.push({
        type: 'duplicate',
        message: `Duplicate weightage record: ${recordKey}`,
        record: rec.chapterName,
      });
      hasError = true;
    }
    seen.add(recordKey);

    // Empty name
    if (!rec.chapterName || rec.chapterName.trim() === '') {
      errors.push({
        type: 'empty-name',
        message: `Empty chapter name in ${rec.exam} weightage`,
        record: rec.chapterName,
      });
      hasError = true;
    }

    // Invalid subject
    if (!validSubjects.includes(rec.subject)) {
      errors.push({
        type: 'invalid-subject',
        message: `Invalid subject: ${rec.subject}`,
        record: rec.chapterName,
      });
      hasError = true;
    }

    // Invalid category
    if (!validCategories.includes(rec.category)) {
      errors.push({
        type: 'invalid-category',
        message: `Invalid category: ${rec.category} for ${rec.chapterName}`,
        record: rec.chapterName,
      });
      hasError = true;
    }

    // Invalid evidence level
    if (!validEvidence.includes(rec.evidenceLevel)) {
      errors.push({
        type: 'invalid-evidence',
        message: `Invalid evidence level: ${rec.evidenceLevel} for ${rec.chapterName}`,
        record: rec.chapterName,
      });
      hasError = true;
    }

    // Check source type
    if (!validSources.includes(rec.sourceType)) {
      errors.push({
        type: 'invalid-evidence',
        message: `Invalid source type: ${rec.sourceType} for ${rec.chapterName}`,
        record: rec.chapterName,
      });
      hasError = true;
    }

    // Check chapter exists in syllabus
    const syllabusChapter = findSyllabusChapter(rec.subject, rec.chapterId);
    if (!syllabusChapter) {
      errors.push({
        type: 'missing-chapter',
        message: `Weightage record references non-existent chapter: ${rec.subject}/${rec.chapterId}`,
        record: rec.chapterName,
      });
      hasError = true;
    } else {
      // Check exam membership match
      if (rec.exam === 'main' && !syllabusChapter.examMembership.main) {
        errors.push({
          type: 'exam-mismatch',
          message: `Main weightage record for "${rec.chapterName}" but chapter is not in JEE Main syllabus`,
          record: rec.chapterName,
        });
        hasError = true;
      }
      if (rec.exam === 'advanced' && !syllabusChapter.examMembership.advanced) {
        errors.push({
          type: 'exam-mismatch',
          message: `Advanced weightage record for "${rec.chapterName}" but chapter is not in JEE Advanced syllabus`,
          record: rec.chapterName,
        });
        hasError = true;
      }
    }

    if (!hasError) {
      valid.push(rec);
    }
  }

  return { valid, errors };
}

/**
 * Get validated weightage records for a specific exam.
 * Invalid records are automatically filtered out.
 */
export function getValidWeightageByExam(exam: 'main' | 'advanced'): WeightageRecord[] {
  const { valid } = validateWeightageRecords();
  return valid.filter((r) => r.exam === exam);
}
