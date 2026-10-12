/**
 * The lab's six research focus areas — one per topic in the home-page Marquee.
 * Copy is drawn from our published papers. `stat` is the headline figure from
 * `body`, shown as a floating annotation in the home hero; keep the two in sync.
 */
export interface ResearchFocus {
  icon: string;
  title: string;
  body: string;
  stat: string;
}

export const RESEARCH_FOCUS: ResearchFocus[] = [
  {
    icon: '◇',
    title: 'Water Quality',
    body: 'Raising dissolved oxygen in water. Our multistage vortex aerator uses staged vortex flow and high-purity oxygen to reach over 40 mg/L in 60 minutes.',
    stat: 'Over 40 mg/L dissolved oxygen in 60 minutes',
  },
  {
    icon: '○',
    title: 'Digital Twins',
    body: 'Models that mirror real treatment systems. Our gas transfer model, built on oxygen mass and molar balances, simulates dissolved-oxygen change inside the aerator.',
    stat: 'Simulates dissolved-oxygen change inside the aerator',
  },
  {
    icon: '□',
    title: 'Water Resources',
    body: 'Treatment tested on real water bodies. Our biochar removes 76.5–97.3% of phosphate from lake, river and sewage water, and stays effective from pH 2 to 12.',
    stat: 'Removes 76.5–97.3% of phosphate from real water',
  },
  {
    icon: '△',
    title: 'Sustainability',
    body: 'Turning waste into treatment media. Mussel shells and spent coffee grounds become a calcium-rich biochar that captures up to 375.6 mg of phosphate per gram.',
    stat: 'Captures up to 375.6 mg of phosphate per gram',
  },
  {
    icon: '◎',
    title: 'Machine Learning',
    body: 'Data-driven models built on our adsorption and oxygen-transfer experiments, to predict treatment performance across temperatures, pressures and water conditions.',
    stat: 'Predicts treatment performance across conditions',
  },
  {
    icon: '◈',
    title: 'Environmental',
    body: 'Closing the nutrient loop from water to soil. Phosphate-laden biochar works as a slow-release fertilizer, lifting radish dry biomass by 63.1% and improving soil pH.',
    stat: 'Lifts radish dry biomass by 63.1%',
  },
];
