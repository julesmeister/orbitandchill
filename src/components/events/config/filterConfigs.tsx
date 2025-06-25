import React from 'react';
import { QuickFilter, TimingMethod, AdvancedFilter } from '../types/filterTypes';

// Filter button configurations
export const QUICK_FILTERS: QuickFilter[] = [
  {
    key: 'hideChallengingDates',
    label: 'Hide Challenging',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.464 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    tooltip: "Removes days with difficult planetary alignments like Mars-Saturn conflicts. These dates often bring obstacles, delays, or frustrations."
  },
  {
    key: 'showCombosOnly',
    label: 'Combos Only',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    tooltip: "Shows only powerful combinations like Venus-Jupiter (great benefics) together. These rare alignments bring exceptional luck and opportunity."
  },
  {
    key: 'showAspects',
    label: 'Daily Aspects',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    tooltip: "Displays daily planetary conversations (aspects). Trines and sextiles bring ease, while squares and oppositions create dynamic tension."
  }
];

export const TIMING_METHODS: TimingMethod[] = [
  { key: 'showHousesOnly', label: 'Houses' },
  { key: 'showAspectsOnly', label: 'Aspects' },
  { key: 'showElectionalOnly', label: 'Electional' }
];

export const ADVANCED_FILTERS: AdvancedFilter[] = [
  {
    key: 'mercuryFilter',
    label: 'Mercury',
    options: [
      { value: 'direct', label: 'Direct' },
      { value: 'all', label: 'All' }
    ],
    tooltip: "Mercury retrograde creates tech glitches and miscommunications. Choose 'Direct' for smooth communication or 'All' to include retrograde periods.",
    bgColor: 'bg-gray-100'
  },
  {
    key: 'moonPhaseFilter',
    label: 'Moon Phase',
    options: [
      { value: 'waxing', label: 'Waxing' },
      { value: 'new', label: 'New' },
      { value: 'full', label: 'Full' },
      { value: 'waning', label: 'Waning' },
      { value: 'all', label: 'All' }
    ],
    tooltip: "🌙 LUNAR TIMING GUIDE: 🌒 Waxing (BEST for starting) - building energy supports new projects, relationships, investments. 🌑 New Moon (good for planning) - fresh starts but energy is weak. 🌕 Full Moon (AVOID for new things) - peak energy but crisis-prone, emotional, overwhelming. 🌘 Waning (good for clearing) - releasing, ending, decluttering. Choose Waxing for most new ventures!",
    bgColor: 'bg-gray-100'
  },
  // Moon Sign Filter commented out per user request - info added to event titles instead
  // {
  //   key: 'moonSignFilter',
  //   label: '🌙 Moon Sign',
  //   options: [
  //     { value: 'haircut_growth', label: 'Hair Growth' },
  //     { value: 'haircut_maintenance', label: 'Hair Trim' },
  //     { value: 'travel_flexible', label: 'Travel (Flexible)' },
  //     { value: 'travel_stable', label: 'Travel (Stable)' },
  //     { value: 'creativity', label: 'Creative Work' },
  //     { value: 'luck_success', label: 'Luck & Success' },
  //     { value: 'avoid_void', label: 'Avoid Void Moon' },
  //     { value: 'all', label: 'All' }
  //   ],
  //   tooltip: "🌙 MOON SIGN ELECTIONAL GUIDE: 💇 Hair Growth (Cancer/Scorpio/Pisces/Taurus) - water signs for growth, Taurus for strength. 💇 Hair Trim (Virgo) - precision cutting for maintenance. ✈️ Travel Flexible (Gemini/Virgo/Sagittarius/Pisces) - mutable signs for adaptability. ✈️ Travel Stable (avoid fixed signs if flexibility needed). 🎨 Creative (Leo/Libra/Pisces) - fire for drama, air for beauty, water for imagination. 🍀 Luck (Cancer/Taurus + Jupiter aspects) - Moon in domicile/exaltation.",
  //   bgColor: 'bg-blue-50'
  // },
  {
    key: 'dignityFilter',
    label: 'Dignity',
    options: [
      { value: 'exalted', label: 'Exalted' },
      { value: 'no_debility', label: 'Strong' },
      { value: 'all', label: 'All' }
    ],
    tooltip: "Planetary dignity shows planet strength: Exalted planets are super-powered, Strong planets work well, weak planets struggle. Better dignity = smoother outcomes.",
    bgColor: 'bg-gray-100'
  },
  {
    key: 'maleficFilter',
    label: 'Malefics',
    options: [
      { value: 'no_mars_saturn', label: 'Avoid' },
      { value: 'soft_aspects', label: 'Soft' },
      { value: 'all', label: 'All' }
    ],
    tooltip: "⚔️ MARS & SATURN INFLUENCE: 'Avoid' excludes harsh Mars-Saturn combinations (conflict, restriction). 'Soft' includes gentle aspects only (trine/sextile = flowing energy). 'All' includes challenging aspects too. For easy outcomes, choose Soft or Avoid.",
    bgColor: 'bg-gray-100'
  },
  {
    key: 'scoreFilter',
    label: 'Score',
    options: [
      { value: '8_plus', label: '8+' },
      { value: '6_plus', label: '6+' },
      { value: 'all', label: 'All' }
    ],
    tooltip: "Overall timing quality score: 8+ is excellent (rare but powerful), 6+ is good (balanced), All shows every timing. Higher scores mean better cosmic support.",
    bgColor: 'bg-gray-100'
  },
  {
    key: 'electionalFilter',
    label: '🏛️',
    options: [
      { value: 'ready', label: 'Ready' },
      { value: 'benefics_angular', label: 'Angular' },
      { value: 'all', label: 'All' }
    ],
    tooltip: "🏛️ TRADITIONAL ELECTIONAL ASTROLOGY: 'Ready' = high-scoring events meeting ancient timing standards (score 6+, no warnings). 'Angular' = benefic planets (Jupiter/Venus) in powerful houses (1st, 4th, 7th, 10th). 'All' = any electional timing. Choose Ready for proven traditional timing!",
    bgColor: 'bg-amber-50'
  },
  {
    key: 'jupiterSectorFilter',
    label: 'Jupiter Sector',
    options: [
      { value: 'current_favored', label: 'Favored' },
      { value: 'avoid_saturn', label: 'Avoid Saturn' },
      { value: 'all', label: 'All' }
    ],
    tooltip: "🪐 JUPITER SECTOR TIMING: Current Jupiter in Gemini favors Transportation, Communication, Social Media, Internet companies. 'Favored' shows only current Jupiter-ruled activities. 'Avoid Saturn' excludes sectors opposed by Saturn (currently Pisces = avoid medical/pharma). Jupiter changes signs yearly - major sector shifts!",
    bgColor: 'bg-yellow-50'
  },
  {
    key: 'magicFormulaFilter',
    label: '✨ Magic',
    options: [
      { value: 'sun_jupiter_pluto', label: 'Full Formula' },
      { value: 'jupiter_pluto', label: 'Jupiter-Pluto' },
      { value: 'all', label: 'All' }
    ],
    tooltip: "✨ MAGIC FORMULA (CURRENTLY INACTIVE): Grace Morris discovered that stocks hitting $1000+ per share ALL have Sun-Jupiter-Pluto combinations. However, Jupiter and Pluto are not in aspect during 2025 (~215° apart). Last active: 2020. Next active period: ~2033-2035. This filter will return no results until astronomical conditions change.",
    bgColor: 'bg-purple-50'
  },
  {
    key: 'voidMoonFilter',
    label: 'Void Moon',
    options: [
      { value: 'avoid_void', label: 'Avoid' },
      { value: 'allow_declination', label: 'Allow w/ Decl' },
      { value: 'all', label: 'All' }
    ],
    tooltip: "🌙 VOID OF COURSE MOON: When Moon makes no aspects before changing signs, projects tend to 'go nowhere'. 'Avoid' excludes these periods for important launches. 'Allow w/ Declination' includes void periods where Moon has declination aspects (less problematic). Essential for business timing!",
    bgColor: 'bg-slate-50'
  },
  {
    key: 'ingressFilter',
    label: 'Ingress',
    options: [
      { value: 'three_week_window', label: '3-Week' },
      { value: 'exact_ingress', label: 'Exact' },
      { value: 'all', label: 'All' }
    ],
    tooltip: "🚀 PLANETARY INGRESS TIMING: Most powerful timing occurs within 3 weeks of major planets changing signs. '3-Week' shows optimal periods around ingresses. 'Exact' shows only exact change dates. Perfect for major launches, IPOs, business starts!",
    bgColor: 'bg-green-50'
  },
  {
    key: 'economicCycleFilter',
    label: 'Economy',
    options: [
      { value: 'expansion_phase', label: 'Expansion' },
      { value: 'consolidation_phase', label: 'Consolidation' },
      { value: 'all', label: 'All' }
    ],
    tooltip: "📈 ECONOMIC CYCLES: Based on outer planet positions. Currently Pluto leaving Capricorn (end of plutocrat era) entering Aquarius (common man era). Neptune approaching Aries (inflation cycle ~2025). 'Expansion' favors growth timing, 'Consolidation' favors conservative timing.",
    bgColor: 'bg-blue-50'
  }
];