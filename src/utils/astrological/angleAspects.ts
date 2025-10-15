/* eslint-disable @typescript-eslint/no-unused-vars */

// Angle Aspect Interpretations
// =============================
//
// Covers aspects between planets and the major chart angles:
// - Ascendant (AC): Self-identity, persona, how you appear to the world
// - Descendant (DC): Relationships, partnerships, the other
// - Midheaven (MC): Career, public image, life direction, achievements
// - Imum Coeli (IC): Home, roots, private self, foundation
// - Vertex (Vx): Fated encounters, destiny points, significant relationships

export const angleAspectCombinations: Record<
  string,
  Record<string, Record<string, string>>
> = {
  // SUN ASPECTS TO ANGLES
  sun: {
    ascendant: {
      conjunction: "Personal will merges with self-presentation and identity. This creates powerful personalities whose inner essence matches outer expression, bringing natural leadership and authentic self-expression.",
      sextile: "Personal will and self-presentation support each other through conscious development. This brings opportunities to align inner identity with outer persona when authentic expression is actively cultivated.",
      square: "Personal will conflicts with self-image and presentation, creating tension between true self and how others perceive you. This develops authentic identity through integrating inner essence with outer expression.",
      trine: "Personal will and self-presentation flow together naturally. This creates charismatic personalities whose authentic self easily shines through their persona and social presentation.",
      opposition: "Personal will faces relationship needs and partnership dynamics. This creates awareness of balancing self-expression with others' needs and integrating personal identity with relationship requirements.",
      quincunx: "Personal will requires ongoing adjustment to self-presentation needs. This develops the ability to maintain authentic essence while adapting how you present yourself to different situations."
    },
    midheaven: {
      conjunction: "Personal will merges with life direction and public image. This creates ambitious personalities whose identity is tied to career success and public recognition, bringing natural authority and leadership.",
      sextile: "Personal will and career direction support each other through conscious effort. This brings opportunities for professional success when authentic identity is expressed through career and public service.",
      square: "Personal will conflicts with career demands and public expectations, creating tension between personal desires and professional requirements. This develops authentic achievement through aligning identity with vocation.",
      trine: "Personal will and career direction flow together naturally. This creates successful personalities whose authentic self naturally leads to professional achievement and public recognition.",
      opposition: "Personal will faces private needs and home foundation. This creates awareness of balancing public ambition with private life and integrating career success with emotional security.",
      quincunx: "Personal will requires ongoing adjustment to career demands and public image needs. This develops flexible authentic expression that adapts to professional requirements while maintaining personal integrity."
    },
    descendant: {
      conjunction: "Personal will merges with relationship needs and partnership dynamics. This creates personalities who find identity through relationships, bringing powerful partnerships and intense relationship focus.",
      sextile: "Personal will and partnership needs support each other through conscious relationship development. This brings opportunities for growth through relationships when authentic self is shared with others.",
      square: "Personal will conflicts with partnership requirements, creating tension between independence and relationship needs. This develops authentic relating through balancing self-expression with partnership demands.",
      trine: "Personal will and relationship needs flow together naturally. This creates harmonious partnerships where authentic self-expression enhances rather than conflicts with relationship dynamics.",
      opposition: "Personal will faces self-identity and autonomous needs. This is the natural AC-DC opposition, creating awareness of balancing self with other and integrating independence with partnership.",
      quincunx: "Personal will requires ongoing adjustment to relationship needs. This develops the ability to maintain authentic identity while adapting to partnership requirements and relationship evolution."
    },
    ic: {
      conjunction: "Personal will merges with home foundation and emotional roots. This creates personalities whose identity is deeply connected to family and heritage, bringing strong family ties and emotional depth.",
      sextile: "Personal will and home foundation support each other through conscious emotional development. This brings opportunities to build secure foundations when authentic identity includes emotional and family needs.",
      square: "Personal will conflicts with home needs and emotional foundation, creating tension between personal ambition and family obligations. This develops authentic security through balancing individual expression with family bonds.",
      trine: "Personal will and emotional foundation flow together naturally. This creates secure personalities whose authentic self is supported by strong family connections and emotional roots.",
      opposition: "Personal will faces career ambitions and public life. This is the natural MC-IC opposition, creating awareness of balancing private emotional needs with public professional demands.",
      quincunx: "Personal will requires ongoing adjustment to home and family needs. This develops the ability to maintain authentic identity while honoring emotional foundations and family obligations."
    },
    vertex: {
      conjunction: "Personal will aligns with fated encounters and destiny points. This creates personalities whose identity is shaped by significant relationships and destined meetings, bringing transformative partnerships.",
      sextile: "Personal will and fated encounters support each other through conscious openness. This brings destined opportunities when authentic self is expressed in relationships and significant connections.",
      square: "Personal will conflicts with fated relationship patterns, creating tension between chosen path and destined encounters. This develops authentic relating through accepting rather than resisting significant relationships.",
      trine: "Personal will and fated encounters flow together naturally. This creates personalities whose authentic expression naturally attracts destined relationships and significant life-changing connections.",
      opposition: "Personal will faces anti-vertex and complementary destiny. This creates awareness of how personal identity attracts its opposite through fated encounters and destined relationship dynamics.",
      quincunx: "Personal will requires ongoing adjustment to fated relationship patterns. This develops the ability to maintain authentic identity while remaining open to destined encounters and significant partnerships."
    }
  },

  // MOON ASPECTS TO ANGLES
  moon: {
    ascendant: {
      conjunction: "Emotional nature merges with self-presentation and identity. This creates emotionally expressive personalities whose feelings are visible to others, bringing natural empathy and emotional authenticity in relationships.",
      sextile: "Emotional nature and self-presentation support each other through conscious emotional awareness. This brings opportunities to express feelings authentically while maintaining emotional intelligence and social grace.",
      square: "Emotional nature conflicts with self-image, creating tension between inner feelings and outer persona. This develops emotional maturity through learning to express feelings while maintaining appropriate boundaries.",
      trine: "Emotional nature and self-presentation flow together naturally. This creates personalities who comfortably express emotions and whose feelings enhance rather than complicate their social presence.",
      opposition: "Emotional nature faces relationship needs and partner's emotions. This creates awareness of balancing personal feelings with others' emotional needs and developing empathy through relationship dynamics.",
      quincunx: "Emotional nature requires ongoing adjustment to self-presentation needs. This develops the ability to express feelings authentically while adapting emotional expression to different social situations."
    },
    midheaven: {
      conjunction: "Emotional nature merges with career and public image. This creates personalities whose feelings influence professional life, bringing careers in nurturing fields or emotional public expression.",
      sextile: "Emotional nature and career direction support each other through conscious emotional intelligence. This brings professional success when feelings and intuition guide career choices and public service.",
      square: "Emotional nature conflicts with career demands, creating tension between feelings and professional requirements. This develops emotional maturity through balancing personal needs with career responsibilities.",
      trine: "Emotional nature and career direction flow together naturally. This creates successful careers in emotional fields where feelings enhance rather than hinder professional achievement.",
      opposition: "Emotional nature faces home foundation and private life. This creates awareness of balancing public emotional expression with private emotional needs and family security.",
      quincunx: "Emotional nature requires ongoing adjustment to career demands. This develops flexible emotional expression that adapts to professional requirements while maintaining emotional authenticity."
    },
    descendant: {
      conjunction: "Emotional nature merges with partnership needs. This creates personalities who seek emotional connection in relationships, bringing nurturing partnerships and emotional intimacy as primary relationship need.",
      sextile: "Emotional nature and partnership needs support each other through conscious emotional sharing. This brings opportunities for emotional growth through relationships when feelings are openly expressed.",
      square: "Emotional nature conflicts with partnership requirements, creating tension between emotional needs and relationship demands. This develops emotional maturity through balancing feelings with partnership responsibilities.",
      trine: "Emotional nature and relationship needs flow together naturally. This creates harmonious emotional partnerships where feelings enhance rather than complicate relationship dynamics.",
      opposition: "Emotional nature faces self-identity and autonomous feelings. This creates awareness of balancing emotional needs with independent identity and integrating feelings with self-reliance.",
      quincunx: "Emotional nature requires ongoing adjustment to partnership needs. This develops the ability to express emotions in relationships while adapting to partners' emotional styles and needs."
    },
    ic: {
      conjunction: "Emotional nature merges with home foundation and family roots. This creates deeply emotional personalities whose feelings are rooted in family and heritage, bringing strong emotional security through home and family.",
      sextile: "Emotional nature and home foundation support each other through conscious nurturing. This brings opportunities to build emotional security when feelings are honored and family needs are met.",
      square: "Emotional nature conflicts with home foundation, creating tension between emotional needs and family patterns. This develops emotional maturity through healing family wounds and creating new emotional foundations.",
      trine: "Emotional nature and home foundation flow together naturally. This creates emotionally secure personalities whose feelings are supported by loving family connections and stable home environment.",
      opposition: "Emotional nature faces career ambitions and public emotional demands. This creates awareness of balancing private feelings with public emotional expression and family needs with professional requirements.",
      quincunx: "Emotional nature requires ongoing adjustment to home and family needs. This develops the ability to maintain emotional authenticity while honoring family patterns and home obligations."
    },
    vertex: {
      conjunction: "Emotional nature aligns with fated encounters and destiny points. This creates personalities whose feelings attract significant relationships and destined emotional connections, bringing transformative emotional partnerships.",
      sextile: "Emotional nature and fated encounters support each other through emotional openness. This brings destined emotional opportunities when feelings are expressed authentically in significant relationships.",
      square: "Emotional nature conflicts with fated relationship patterns, creating tension between emotional comfort and destined encounters. This develops emotional maturity through accepting rather than resisting fated emotional connections.",
      trine: "Emotional nature and fated encounters flow together naturally. This creates personalities whose authentic feelings naturally attract destined relationships and significant emotional life-changing connections.",
      opposition: "Emotional nature faces anti-vertex and complementary emotional destiny. This creates awareness of how personal feelings attract opposite emotional types through fated encounters and destined relationship dynamics.",
      quincunx: "Emotional nature requires ongoing adjustment to fated relationship patterns. This develops the ability to maintain emotional authenticity while remaining open to destined encounters and significant emotional partnerships."
    }
  }
};
