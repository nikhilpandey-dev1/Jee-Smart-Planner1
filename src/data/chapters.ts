import type { Chapter, Subject, SyllabusChapter, ExamMembership } from '@/types';

export const SUBJECTS: Subject[] = ['Physics', 'Chemistry', 'Mathematics'];

// ──────────────────────────────────────────────────────────────────────────
// OFFICIAL JEE SYLLABUS MEMBERSHIP
//
// Sources verified against:
//   • JEE Main 2024+ syllabus (NTA, effective from 2024)
//   • JEE Advanced 2024+ syllabus (IIT, effective from 2024)
//
// Chapters removed from JEE Main (2024 revision):
//   Chemistry: "Surface Chemistry", "General Principles of Isolation of Metals",
//   "Purification and Characterisation of Organic Compounds", "Biomolecules",
//   "Principles Related to Practical Chemistry" — removed from Main.
//   Some of these are still in Advanced or kept as prerequisites.
//
// Chapters removed from JEE Advanced (2024 revision):
//   Physics: "Semiconductor Electronics", "Electromagnetic Waves",
//   "Magnetism and Matter" — removed from Advanced.
//   Mathematics: "Statistics" — removed from Advanced.
//
// Mapping notes:
//   • JEE Main Physics "Kinematics" and "Laws of Motion" are official units.
//   • "Centre of Mass and Linear Momentum" is part of the JEE Advanced
//     "General Mechanics" unit but is a standard coaching chapter.
//     It is marked as a prerequisite/supporting topic for Main since
//     Main covers it under "Work, Energy and Power" and "Laws of Motion".
//   • "Experimental Physics" maps to the JEE Main "Experimental Skills"
//     unit and JEE Advanced practical-based questions.
// ──────────────────────────────────────────────────────────────────────────

export const SYLLABUS: SyllabusChapter[] = [
  // ===================== PHYSICS =====================
  { subject: 'Physics', chapterNumber: 1, chapterName: 'Units, Dimensions and Measurement', examMembership: { main: true, advanced: true }, majorTopics: ['SI units', 'dimensional analysis', 'least count', 'significant figures', 'error analysis'], importance: 5 },
  { subject: 'Physics', chapterNumber: 2, chapterName: 'Kinematics', examMembership: { main: true, advanced: true }, majorTopics: ['motion in a straight line', 'motion in a plane', 'projectile motion', 'relative velocity'], importance: 7 },
  { subject: 'Physics', chapterNumber: 3, chapterName: 'Laws of Motion', examMembership: { main: true, advanced: true }, majorTopics: ["Newton's laws", 'friction', 'spring force', 'pseudoforce'], importance: 8 },
  { subject: 'Physics', chapterNumber: 4, chapterName: 'Work, Energy and Power', examMembership: { main: true, advanced: true }, majorTopics: ['kinetic energy', 'potential energy', 'conservation of energy', 'power', 'collisions'], importance: 7 },
  { subject: 'Physics', chapterNumber: 5, chapterName: 'Centre of Mass and Linear Momentum', examMembership: { main: false, advanced: true }, majorTopics: ['centre of mass', 'linear momentum', 'impulse', 'collision in 1D and 2D'], importance: 7, isPrerequisite: true },
  { subject: 'Physics', chapterNumber: 6, chapterName: 'Rotational Motion', examMembership: { main: true, advanced: true }, majorTopics: ['torque', 'angular momentum', 'moment of inertia', 'rolling motion'], importance: 9 },
  { subject: 'Physics', chapterNumber: 7, chapterName: 'Gravitation', examMembership: { main: true, advanced: true }, majorTopics: ["Kepler's laws", 'gravitational field', 'escape velocity', 'satellites'], importance: 6 },
  { subject: 'Physics', chapterNumber: 8, chapterName: 'Properties of Solids and Liquids', examMembership: { main: true, advanced: true }, majorTopics: ['elasticity', "Young's modulus", 'surface tension', 'viscosity', 'Bernoulli'], importance: 6 },
  { subject: 'Physics', chapterNumber: 9, chapterName: 'Thermal Properties of Matter', examMembership: { main: true, advanced: false }, majorTopics: ['heat transfer', 'thermal expansion', 'calorimetry', 'specific heat'], importance: 4, isPrerequisite: true },
  { subject: 'Physics', chapterNumber: 10, chapterName: 'Thermodynamics', examMembership: { main: true, advanced: true }, majorTopics: ['laws of thermodynamics', 'Carnot engine', 'entropy', 'isothermal/adiabatic processes'], importance: 8 },
  { subject: 'Physics', chapterNumber: 11, chapterName: 'Kinetic Theory of Gases', examMembership: { main: true, advanced: true }, majorTopics: ['degrees of freedom', 'rms speed', 'specific heat capacity'], importance: 5 },
  { subject: 'Physics', chapterNumber: 12, chapterName: 'Oscillations', examMembership: { main: true, advanced: true }, majorTopics: ['SHM', 'damped oscillations', 'forced oscillations', 'resonance'], importance: 7 },
  { subject: 'Physics', chapterNumber: 13, chapterName: 'Waves', examMembership: { main: true, advanced: true }, majorTopics: ['transverse/longitudinal waves', 'Doppler effect', 'standing waves', 'beats'], importance: 7 },
  { subject: 'Physics', chapterNumber: 14, chapterName: 'Electrostatics', examMembership: { main: true, advanced: true }, majorTopics: ["Coulomb's law", 'electric field', 'Gauss law', 'electric potential', 'dipoles'], importance: 9 },
  { subject: 'Physics', chapterNumber: 15, chapterName: 'Capacitance', examMembership: { main: true, advanced: true }, majorTopics: ['capacitors', 'dielectrics', 'energy stored', 'parallel plate'], importance: 7 },
  { subject: 'Physics', chapterNumber: 16, chapterName: 'Current Electricity', examMembership: { main: true, advanced: true }, majorTopics: ["Ohm's law", 'Kirchhoff', 'Wheatstone bridge', 'meter bridge', 'potentiometer'], importance: 8 },
  { subject: 'Physics', chapterNumber: 17, chapterName: 'Moving Charges and Magnetism', examMembership: { main: true, advanced: true }, majorTopics: ['Biot-Savart', 'Ampere law', 'force on moving charge', 'cyclotron'], importance: 8 },
  { subject: 'Physics', chapterNumber: 18, chapterName: 'Magnetism and Matter', examMembership: { main: true, advanced: false }, majorTopics: ['magnetic properties', 'bar magnet', "Earth's magnetism", 'magnetic flux'], importance: 4 },
  { subject: 'Physics', chapterNumber: 19, chapterName: 'Electromagnetic Induction', examMembership: { main: true, advanced: true }, majorTopics: ["Faraday's law", "Lenz's law", 'self/mutual inductance', 'AC generator'], importance: 8 },
  { subject: 'Physics', chapterNumber: 20, chapterName: 'Alternating Current', examMembership: { main: true, advanced: true }, majorTopics: ['LCR circuits', 'impedance', 'resonance', 'power factor', 'transformer'], importance: 6 },
  { subject: 'Physics', chapterNumber: 21, chapterName: 'Electromagnetic Waves', examMembership: { main: true, advanced: false }, majorTopics: ['EM spectrum', "Maxwell's equations", 'properties of EM waves'], importance: 4 },
  { subject: 'Physics', chapterNumber: 22, chapterName: 'Ray Optics', examMembership: { main: true, advanced: true }, majorTopics: ['reflection', 'refraction', 'lenses', 'prism', 'optical instruments'], importance: 7 },
  { subject: 'Physics', chapterNumber: 23, chapterName: 'Wave Optics', examMembership: { main: true, advanced: true }, majorTopics: ['interference', 'diffraction', 'polarization', "Huygens' principle", "Young's double slit"], importance: 7 },
  { subject: 'Physics', chapterNumber: 24, chapterName: 'Dual Nature of Matter and Radiation', examMembership: { main: true, advanced: true }, majorTopics: ['photoelectric effect', 'de Broglie wavelength', 'matter waves'], importance: 6 },
  { subject: 'Physics', chapterNumber: 25, chapterName: 'Atoms', examMembership: { main: true, advanced: true }, majorTopics: ['Bohr model', 'hydrogen spectrum', 'energy levels'], importance: 5 },
  { subject: 'Physics', chapterNumber: 26, chapterName: 'Nuclei', examMembership: { main: true, advanced: true }, majorTopics: ['nuclear binding energy', 'radioactivity', 'fission', 'fusion'], importance: 6 },
  { subject: 'Physics', chapterNumber: 27, chapterName: 'Semiconductor Electronics', examMembership: { main: true, advanced: false }, majorTopics: ['diodes', 'transistors', 'logic gates', 'rectifiers'], importance: 5 },
  { subject: 'Physics', chapterNumber: 28, chapterName: 'Experimental Physics', examMembership: { main: true, advanced: true }, majorTopics: ['vernier calipers', 'screw gauge', 'simple pendulum', 'meter bridge', 'galvanometer'], importance: 4 },

  // ===================== CHEMISTRY =====================
  // Physical Chemistry
  { subject: 'Chemistry', chapterNumber: 1, chapterName: 'Some Basic Concepts of Chemistry', examMembership: { main: true, advanced: true }, majorTopics: ['mole concept', 'stoichiometry', 'Avogadro number', 'empirical formula'], importance: 7 },
  { subject: 'Chemistry', chapterNumber: 2, chapterName: 'Atomic Structure', examMembership: { main: true, advanced: true }, majorTopics: ['Bohr model', 'quantum numbers', 'orbitals', 'electronic configuration'], importance: 8 },
  { subject: 'Chemistry', chapterNumber: 3, chapterName: 'Chemical Bonding and Molecular Structure', examMembership: { main: true, advanced: true }, majorTopics: ['VSEPR', 'hybridization', 'VBT', 'MOT', 'intermolecular forces'], importance: 9 },
  { subject: 'Chemistry', chapterNumber: 4, chapterName: 'Thermodynamics', examMembership: { main: true, advanced: true }, majorTopics: ['enthalpy', 'entropy', 'Gibbs energy', 'Hess law', 'spontaneity'], importance: 8 },
  { subject: 'Chemistry', chapterNumber: 5, chapterName: 'Equilibrium', examMembership: { main: true, advanced: true }, majorTopics: ['Le Chatelier', 'Kc/Kp', 'ionic equilibrium', 'pH', 'buffer solutions'], importance: 8 },
  { subject: 'Chemistry', chapterNumber: 6, chapterName: 'Redox Reactions', examMembership: { main: true, advanced: true }, majorTopics: ['oxidation number', 'balancing redox', 'oxidizing/reducing agents'], importance: 6 },
  { subject: 'Chemistry', chapterNumber: 7, chapterName: 'Solutions', examMembership: { main: true, advanced: true }, majorTopics: ['concentration', 'Raoult law', 'colligative properties', 'van Hoff factor'], importance: 6 },
  { subject: 'Chemistry', chapterNumber: 8, chapterName: 'Electrochemistry', examMembership: { main: true, advanced: true }, majorTopics: ['galvanic cells', 'Nernst equation', 'electrolysis', 'conductance'], importance: 8 },
  { subject: 'Chemistry', chapterNumber: 9, chapterName: 'Chemical Kinetics', examMembership: { main: true, advanced: true }, majorTopics: ['rate law', 'order of reaction', 'Arrhenius equation', 'half-life'], importance: 8 },
  { subject: 'Chemistry', chapterNumber: 10, chapterName: 'Surface Chemistry', examMembership: { main: false, advanced: false }, majorTopics: ['adsorption', 'catalysis', 'colloids', 'emulsions'], importance: 4, isPrerequisite: true },
  // Inorganic Chemistry
  { subject: 'Chemistry', chapterNumber: 11, chapterName: 'Classification of Elements and Periodicity', examMembership: { main: true, advanced: true }, majorTopics: ['periodic table', 'periodic trends', 'atomic radius', 'ionization energy'], importance: 6 },
  { subject: 'Chemistry', chapterNumber: 12, chapterName: 'p-Block Elements (Group 13-14)', examMembership: { main: true, advanced: true }, majorTopics: ['boron family', 'carbon family', 'allotropes', 'oxides'], importance: 7 },
  { subject: 'Chemistry', chapterNumber: 13, chapterName: 'p-Block Elements (Group 15-18)', examMembership: { main: true, advanced: true }, majorTopics: ['nitrogen family', 'oxygen family', 'halogens', 'noble gases'], importance: 7 },
  { subject: 'Chemistry', chapterNumber: 14, chapterName: 'd- and f-Block Elements', examMembership: { main: true, advanced: true }, majorTopics: ['transition metals', 'lanthanides', 'actinides', 'oxidation states'], importance: 7 },
  { subject: 'Chemistry', chapterNumber: 15, chapterName: 'Coordination Compounds', examMembership: { main: true, advanced: true }, majorTopics: ['ligands', 'CFT', 'isomerism', 'nomenclature', 'bonding'], importance: 9 },
  { subject: 'Chemistry', chapterNumber: 16, chapterName: 'General Principles of Isolation of Metals', examMembership: { main: false, advanced: false }, majorTopics: ['metallurgy', 'extraction', 'refining', 'Ellingham diagram'], importance: 4, isPrerequisite: true },
  // Organic Chemistry
  { subject: 'Chemistry', chapterNumber: 17, chapterName: 'Purification and Characterisation of Organic Compounds', examMembership: { main: false, advanced: false }, majorTopics: ['crystallization', 'distillation', 'chromatography', 'qualitative analysis'], importance: 3, isPrerequisite: true },
  { subject: 'Chemistry', chapterNumber: 18, chapterName: 'Some Basic Principles of Organic Chemistry', examMembership: { main: true, advanced: true }, majorTopics: ['IUPAC nomenclature', 'isomerism', 'electronic effects', 'reaction intermediates'], importance: 8 },
  { subject: 'Chemistry', chapterNumber: 19, chapterName: 'Hydrocarbons', examMembership: { main: true, advanced: true }, majorTopics: ['alkanes', 'alkenes', 'alkynes', 'aromaticity', 'benzene'], importance: 8 },
  { subject: 'Chemistry', chapterNumber: 20, chapterName: 'Haloalkanes and Haloarenes', examMembership: { main: true, advanced: true }, majorTopics: ['SN1/SN2', 'E1/E2', 'reactivity', 'environmental effects'], importance: 7 },
  { subject: 'Chemistry', chapterNumber: 21, chapterName: 'Alcohols, Phenols and Ethers', examMembership: { main: true, advanced: true }, majorTopics: ['preparation', 'properties', 'reactions', 'identification'], importance: 7 },
  { subject: 'Chemistry', chapterNumber: 22, chapterName: 'Aldehydes, Ketones and Carboxylic Acids', examMembership: { main: true, advanced: true }, majorTopics: ['nucleophilic addition', 'aldol', 'Cannizzaro', 'acidity'], importance: 8 },
  { subject: 'Chemistry', chapterNumber: 23, chapterName: 'Amines', examMembership: { main: true, advanced: true }, majorTopics: ['basicity', 'preparation', 'diazonium salts', 'reactions'], importance: 6 },
  { subject: 'Chemistry', chapterNumber: 24, chapterName: 'Biomolecules', examMembership: { main: false, advanced: false }, majorTopics: ['carbohydrates', 'proteins', 'vitamins', 'nucleic acids'], importance: 5, isPrerequisite: true },
  { subject: 'Chemistry', chapterNumber: 25, chapterName: 'Principles Related to Practical Chemistry', examMembership: { main: false, advanced: false }, majorTopics: ['detection of functional groups', 'titrimetric analysis', 'organic preparation'], importance: 3, isPrerequisite: true },

  // ===================== MATHEMATICS =====================
  { subject: 'Mathematics', chapterNumber: 1, chapterName: 'Sets, Relations and Functions', examMembership: { main: true, advanced: true }, majorTopics: ['sets', 'relations', 'functions', 'domain', 'range'], importance: 6 },
  { subject: 'Mathematics', chapterNumber: 2, chapterName: 'Complex Numbers and Quadratic Equations', examMembership: { main: true, advanced: true }, majorTopics: ['complex numbers', 'Argand plane', 'quadratic equations', 'roots'], importance: 8 },
  { subject: 'Mathematics', chapterNumber: 3, chapterName: 'Matrices and Determinants', examMembership: { main: true, advanced: true }, majorTopics: ['matrix operations', 'determinants', 'inverse', 'system of equations'], importance: 8 },
  { subject: 'Mathematics', chapterNumber: 4, chapterName: 'Permutations and Combinations', examMembership: { main: true, advanced: true }, majorTopics: ['counting', 'arrangements', 'selections', 'factorial'], importance: 7 },
  { subject: 'Mathematics', chapterNumber: 5, chapterName: 'Binomial Theorem', examMembership: { main: true, advanced: true }, majorTopics: ['binomial expansion', 'general term', 'middle term', 'properties'], importance: 7 },
  { subject: 'Mathematics', chapterNumber: 6, chapterName: 'Sequences and Series', examMembership: { main: true, advanced: true }, majorTopics: ['AP', 'GP', 'HP', 'sum of series', 'AM/GM/HM inequality'], importance: 7 },
  { subject: 'Mathematics', chapterNumber: 7, chapterName: 'Trigonometry', examMembership: { main: true, advanced: true }, majorTopics: ['identities', 'equations', 'inverse trig', 'heights and distances'], importance: 8 },
  { subject: 'Mathematics', chapterNumber: 8, chapterName: 'Straight Lines', examMembership: { main: true, advanced: true }, majorTopics: ['slope', 'intercept', 'distance', 'angle between lines'], importance: 6 },
  { subject: 'Mathematics', chapterNumber: 9, chapterName: 'Circles', examMembership: { main: true, advanced: true }, majorTopics: ['equation of circle', 'tangent', 'normal', 'family of circles'], importance: 7 },
  { subject: 'Mathematics', chapterNumber: 10, chapterName: 'Conic Sections', examMembership: { main: true, advanced: true }, majorTopics: ['parabola', 'ellipse', 'hyperbola', 'eccentricity', 'directrix'], importance: 9 },
  { subject: 'Mathematics', chapterNumber: 11, chapterName: 'Limits and Continuity', examMembership: { main: true, advanced: true }, majorTopics: ['limits', "L'Hopital", 'continuity', 'indeterminate forms'], importance: 7 },
  { subject: 'Mathematics', chapterNumber: 12, chapterName: 'Differentiation', examMembership: { main: true, advanced: true }, majorTopics: ['derivatives', 'chain rule', 'product rule', 'implicit differentiation'], importance: 9 },
  { subject: 'Mathematics', chapterNumber: 13, chapterName: 'Application of Derivatives', examMembership: { main: true, advanced: true }, majorTopics: ['maxima/minima', 'tangent/normal', 'rate of change', 'monotonicity'], importance: 8 },
  { subject: 'Mathematics', chapterNumber: 14, chapterName: 'Indefinite Integration', examMembership: { main: true, advanced: true }, majorTopics: ['integration techniques', 'substitution', 'partial fractions', 'by parts'], importance: 9 },
  { subject: 'Mathematics', chapterNumber: 15, chapterName: 'Definite Integration', examMembership: { main: true, advanced: true }, majorTopics: ['properties of definite integrals', 'area under curve', 'Wallis formula'], importance: 8 },
  { subject: 'Mathematics', chapterNumber: 16, chapterName: 'Differential Equations', examMembership: { main: true, advanced: true }, majorTopics: ['order', 'degree', 'homogeneous', 'linear DE', 'variable separable'], importance: 6 },
  { subject: 'Mathematics', chapterNumber: 17, chapterName: 'Vectors', examMembership: { main: true, advanced: true }, majorTopics: ['dot product', 'cross product', 'unit vector', 'projection'], importance: 8 },
  { subject: 'Mathematics', chapterNumber: 18, chapterName: 'Three-Dimensional Geometry', examMembership: { main: true, advanced: true }, majorTopics: ['direction cosines', 'lines in space', 'planes', 'shortest distance'], importance: 7 },
  { subject: 'Mathematics', chapterNumber: 19, chapterName: 'Probability', examMembership: { main: true, advanced: true }, majorTopics: ['conditional probability', "Bayes' theorem", 'random variables', 'distributions'], importance: 8 },
  { subject: 'Mathematics', chapterNumber: 20, chapterName: 'Statistics', examMembership: { main: true, advanced: false }, majorTopics: ['mean', 'median', 'mode', 'variance', 'standard deviation'], importance: 4 },
];

// Backward-compatible CHAPTERS list derived from SYLLABUS
export const CHAPTERS: Chapter[] = SYLLABUS.map((s) => ({
  name: s.chapterName,
  subject: s.subject,
  importance: s.importance,
}));

export function getSyllabusBySubject(subject: Subject): SyllabusChapter[] {
  return SYLLABUS.filter((s) => s.subject === subject);
}

/**
 * Find a syllabus chapter by subject + chapter name.
 */
export function findSyllabusChapter(
  subject: Subject,
  chapterName: string,
): SyllabusChapter | undefined {
  return SYLLABUS.find(
    (s) => s.subject === subject && s.chapterName === chapterName,
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VALIDATION
// ──────────────────────────────────────────────────────────────────────────

export interface SyllabusValidationError {
  type: 'duplicate' | 'invalid-membership' | 'empty-name' | 'invalid-subject' | 'invalid-number';
  message: string;
  chapter?: string;
}

/**
 * Validate the SYLLABUS array for duplicate chapters, impossible membership,
 * empty names, invalid subjects, and invalid chapter numbers.
 * Call this in development to catch data-entry errors.
 */
export function validateSyllabus(): SyllabusValidationError[] {
  const errors: SyllabusValidationError[] = [];
  const seen = new Set<string>();

  for (const ch of SYLLABUS) {
    const key = `${ch.subject}-${ch.chapterName}`;
    if (seen.has(key)) {
      errors.push({
        type: 'duplicate',
        message: `Duplicate chapter: ${key}`,
        chapter: ch.chapterName,
      });
    }
    seen.add(key);

    if (!ch.chapterName || ch.chapterName.trim() === '') {
      errors.push({
        type: 'empty-name',
        message: `Empty chapter name in ${ch.subject}`,
        chapter: ch.chapterName,
      });
    }

    if (!SUBJECTS.includes(ch.subject)) {
      errors.push({
        type: 'invalid-subject',
        message: `Invalid subject: ${ch.subject}`,
        chapter: ch.chapterName,
      });
    }

    if (ch.chapterNumber < 1) {
      errors.push({
        type: 'invalid-number',
        message: `Invalid chapter number: ${ch.chapterNumber} for ${ch.chapterName}`,
        chapter: ch.chapterName,
      });
    }

    // A chapter should be in at least one exam OR be a prerequisite
    if (!ch.examMembership.main && !ch.examMembership.advanced && !ch.isPrerequisite) {
      errors.push({
        type: 'invalid-membership',
        message: `Chapter "${ch.chapterName}" is in neither exam and not marked as prerequisite`,
        chapter: ch.chapterName,
      });
    }
  }

  return errors;
}
