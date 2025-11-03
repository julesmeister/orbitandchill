/* eslint-disable @typescript-eslint/no-unused-vars */

// Celestial Point to Celestial Point Aspect Interpretations
// ===========================================================
//
// Covers aspects between celestial points themselves:
// - Lilith to other celestial points
// - North Node to other celestial points
// - South Node to other celestial points
// - Part of Fortune to other celestial points

export const celestialPointInterAspects: Record<
  string,
  Record<string, Record<string, string>>
> = {
  // CELESTIAL POINT TO CELESTIAL POINT ASPECTS
  // ===========================================

  // LILITH ASPECTS TO OTHER CELESTIAL POINTS
  lilith: {
    northnode: {
      conjunction: "Shadow self aligns with soul purpose and karmic destiny. This creates personalities whose wild, instinctual nature and authentic power naturally serve spiritual evolution through embracing what has been rejected by society.",
      sextile: "Shadow integration and soul purpose support each other through conscious authenticity development. This brings opportunities to fulfill life mission by embracing wild feminine power and authentic expression when inner work actively includes shadow acceptance.",
      square: "Shadow aspects conflict with soul purpose, creating tension between authentic power and karmic responsibility. This develops spiritual evolution through learning to integrate wild, instinctual wisdom with soul mission rather than suppress natural magnetism.",
      trine: "Shadow integration and soul purpose flow together harmoniously. This creates natural ability to fulfill karmic destiny through authentic power expression and wild feminine wisdom without sacrificing spiritual evolution for social acceptance.",
      opposition: "Shadow self faces karmic destiny and evolutionary responsibility. This creates awareness of how embracing rejected aspects serves soul growth and the need to integrate wild nature with spiritual mission and evolutionary purpose.",
      quincunx: "Shadow integration requires ongoing adjustment to soul purpose and karmic requirements. This develops the ability to honor wild, instinctual nature while serving spiritual evolution and integrating authentic power with evolutionary responsibility."
    },
    southnode: {
      conjunction: "Shadow self draws on past-life knowledge of authentic power and wild nature. This creates natural magnetic presence and comfortable expression of instinctual wisdom but may manifest as repeating past patterns of social rejection or outsider status without growth.",
      sextile: "Shadow integration and past patterns support each other when consciously balanced. This brings the ability to use natural magnetism while ensuring authentic power serves current growth rather than past rebellion or comfortable outsider identity that prevents evolution.",
      square: "Shadow aspects conflict with over-reliance on past rebellious patterns, creating challenges around spiritual evolution versus comfortable wildness. This develops authentic power through using natural magnetism for current growth rather than repeating social rejection or outsider superiority dynamics.",
      trine: "Shadow integration and past patterns flow together effortlessly. This creates natural comfort with authentic power and wild nature, though conscious effort is needed to ensure magnetism serves current spiritual evolution rather than past rebellion patterns or comfortable outsider status.",
      opposition: "Shadow self faces past-life comfort with wildness and familiar rebellion patterns. This creates awareness of how natural authentic power may need to serve growth rather than repeat familiar outsider dynamics or comfortable social rejection without evolutionary purpose.",
      quincunx: "Shadow integration requires ongoing adjustment between past rebellious patterns and current growth needs. This develops the ability to use natural magnetism in service of evolution rather than comfortable outsider identity or repeating social rejection patterns that prevent spiritual progress."
    },
    partoffortune: {
      conjunction: "Shadow self aligns with joy and material prosperity. This creates personalities whose authentic power and wild nature naturally attract success and happiness through embracing rejected aspects and expressing instinctual wisdom that manifests abundance.",
      sextile: "Shadow integration and prosperity support each other through conscious authenticity development. This brings opportunities for success and joy when wild feminine power is embraced and authentic expression opens doors to material abundance and life satisfaction.",
      square: "Shadow aspects conflict with prosperity requirements, creating tension between authentic power and material success. This develops genuine abundance through learning to express wild nature in ways that create both spiritual fulfillment and material prosperity rather than choosing between authenticity and success.",
      trine: "Shadow integration and prosperity flow together naturally. This creates magnetic personalities whose authentic wild power naturally attracts material success and life satisfaction without compromising instinctual wisdom or rejecting aspects of self for social acceptance.",
      opposition: "Shadow self faces external prosperity and material expectations. This creates awareness of the balance between authentic power and financial success, developing abundance through expressing wild nature in ways that honor both instinctual wisdom and practical prosperity requirements.",
      quincunx: "Shadow integration requires ongoing adjustment to changing prosperity needs and material circumstances. This develops flexible expression of authentic power that maintains wild nature while adapting to external requirements for success and creating abundance through instinctual wisdom."
    },
    vertex: {
      conjunction: "Shadow self aligns with fated encounters and destiny points. This creates personalities whose authentic power and wild nature attract significant relationships and destined connections that require shadow integration and facilitate evolution through embracing rejected aspects.",
      sextile: "Shadow integration and fated encounters support each other through conscious authenticity in relationships. This brings destined opportunities when wild feminine power is embraced and authentic expression opens doors to life-changing connections.",
      square: "Shadow aspects conflict with fated relationship patterns, creating tension between authentic power and destined encounters. This develops genuine relating through learning to express wild nature in significant relationships rather than suppress instinctual wisdom to fit others' expectations.",
      trine: "Shadow integration and fated encounters flow together naturally. This creates magnetic personalities whose authentic wild power naturally attracts destined relationships and significant life-changing connections that honor instinctual wisdom and rejected aspects.",
      opposition: "Shadow self faces anti-vertex and complementary destiny points. This creates awareness of how authentic power attracts its opposite through fated encounters, developing relationships that integrate wild nature with others' complementary energies.",
      quincunx: "Shadow integration requires ongoing adjustment to fated relationship patterns. This develops the ability to maintain authentic wild power while remaining open to destined encounters that challenge and evolve your expression of instinctual wisdom and rejected aspects."
    }
  },

  // SOUTH NODE ASPECTS TO OTHER CELESTIAL POINTS
  southnode: {
    northnode: {
      conjunction: "This is astronomically impossible - North Node and South Node are always in exact opposition (180°), never in conjunction. This aspect cannot occur in any natal chart.",
      sextile: "This aspect is astronomically impossible - North and South Nodes are always exactly 180° apart. Any aspect between them other than opposition cannot occur in a natal chart.",
      square: "This aspect is astronomically impossible - North and South Nodes are always exactly 180° apart. Any aspect between them other than opposition cannot occur in a natal chart.",
      trine: "This aspect is astronomically impossible - North and South Nodes are always exactly 180° apart. Any aspect between them other than opposition cannot occur in a natal chart.",
      opposition: "Soul purpose faces past-life comfort and familiar patterns. This is the natural, permanent relationship between the Nodes - representing the tension between evolutionary growth (North) and comfortable past patterns (South). The key is consciously using past gifts to serve future evolution.",
      quincunx: "This aspect is astronomically impossible - North and South Nodes are always exactly 180° apart. Any aspect between them other than opposition cannot occur in a natal chart."
    },
    partoffortune: {
      conjunction: "Past-life patterns align with joy and material prosperity. This creates personalities whose familiar talents and comfortable abilities naturally attract success and happiness, though conscious effort is needed to ensure prosperity serves current spiritual growth rather than stagnation.",
      sextile: "Past wisdom and prosperity support each other through conscious balance of comfort and growth. This brings opportunities for success and joy when natural talents are actively used in service of current evolution rather than spiritual avoidance through familiar patterns that prevent growth.",
      square: "Comfortable patterns conflict with prosperity requirements, creating tension between familiar talents and material success through growth. This develops authentic abundance through learning to use past gifts for current evolution rather than prosperity through spiritual stagnation or comfort-seeking that limits growth potential.",
      trine: "Past patterns and prosperity flow together effortlessly. This creates natural magnetism for success through comfortable talents and familiar abilities, though conscious effort is needed to ensure material abundance serves spiritual evolution rather than reinforcing stagnant patterns or comfort addiction.",
      opposition: "Past-life comfort faces soul-aligned prosperity and evolutionary abundance. This creates awareness of how material success may need to serve spiritual growth rather than reinforce comfortable patterns, developing prosperity through using familiar talents in service of evolution and karmic mission.",
      quincunx: "Past patterns require ongoing adjustment to prosperity needs and material circumstances. This develops flexible use of natural talents that honors familiar abilities while ensuring success serves current spiritual evolution rather than comfortable stagnation or past-pattern repetition that limits growth potential."
    },
    vertex: {
      conjunction: "Past-life patterns align with fated encounters and destiny points. This creates personalities whose familiar talents attract significant relationships and destined connections, though conscious effort is needed to ensure fated encounters serve spiritual evolution rather than reinforce comfortable patterns.",
      sextile: "Past wisdom and fated encounters support each other through conscious balance of comfort and growth. This brings destined opportunities when natural talents are used in service of evolution rather than spiritual avoidance through familiar relationship patterns that prevent authentic connection.",
      square: "Comfortable patterns conflict with fated relationship dynamics, creating tension between familiar approaches and destined encounters. This develops authentic relating through learning to use past gifts in significant relationships rather than repeat comfortable patterns that limit transformative connection.",
      trine: "Past patterns and fated encounters flow together effortlessly. This creates natural magnetism for destined relationships through comfortable talents and familiar abilities, though conscious effort is needed to ensure significant connections serve spiritual evolution rather than reinforce stagnant relationship patterns.",
      opposition: "Past-life comfort faces anti-vertex and complementary destiny points. This creates awareness of how fated encounters may challenge familiar patterns, developing relationships that integrate natural talents with evolutionary growth through destined connections that push beyond comfort zones.",
      quincunx: "Past patterns require ongoing adjustment to fated relationship dynamics. This develops flexible use of natural talents in significant relationships while ensuring destined encounters serve current spiritual evolution rather than comfortable stagnation or past-pattern repetition in fated connections."
    }
  },

  // NORTH NODE ASPECTS TO OTHER CELESTIAL POINTS
  northnode: {
    southnode: {
      conjunction: "This is astronomically impossible - North Node and South Node are always in exact opposition (180°), never in conjunction. This aspect cannot occur in any natal chart.",
      sextile: "This aspect is astronomically impossible - North and South Nodes are always exactly 180° apart. Any aspect between them other than opposition cannot occur in a natal chart.",
      square: "This aspect is astronomically impossible - North and South Nodes are always exactly 180° apart. Any aspect between them other than opposition cannot occur in a natal chart.",
      trine: "This aspect is astronomically impossible - North and South Nodes are always exactly 180° apart. Any aspect between them other than opposition cannot occur in a natal chart.",
      opposition: "Soul purpose faces past-life comfort and familiar patterns. This is the natural, permanent relationship between the Nodes - representing the tension between evolutionary growth (North) and comfortable past patterns (South). The key is consciously using past gifts to serve future evolution.",
      quincunx: "This aspect is astronomically impossible - North and South Nodes are always exactly 180° apart. Any aspect between them other than opposition cannot occur in a natal chart."
    },
    partoffortune: {
      conjunction: "Soul purpose aligns with joy and material prosperity. This creates personalities whose karmic mission and spiritual evolution naturally attract success and happiness through fulfilling life purpose and serving soul growth with material abundance as a natural byproduct.",
      sextile: "Soul purpose and prosperity support each other through conscious evolutionary alignment. This brings opportunities for success and joy when karmic mission and spiritual growth are actively pursued and life purpose is expressed in ways that create both transformation and material rewards.",
      square: "Karmic mission conflicts with prosperity requirements, creating tension between soul purpose and material success. This develops authentic abundance through learning to find joy in spiritual evolution and creating prosperity through serving life mission rather than ego desires or comfort seeking.",
      trine: "Soul purpose and prosperity flow together naturally. This creates natural magnetism for success and happiness through fulfilling karmic destiny, serving spiritual evolution, and prosperity-centered approaches to life mission that honor both soul growth and material manifestation.",
      opposition: "Karmic mission faces material prosperity and external success expectations. This creates awareness of the balance between spiritual evolution and financial manifestation, developing prosperity through serving soul purpose in ways that honor both evolutionary responsibility and material needs.",
      quincunx: "Soul purpose requires ongoing adjustment to changing prosperity needs and material circumstances. This develops flexible evolutionary service that maintains authentic karmic mission while adapting to external requirements for success and creating abundance through spiritual growth and life purpose fulfillment."
    },
    vertex: {
      conjunction: "Soul purpose aligns with fated encounters and destiny points. This creates personalities whose karmic mission attracts significant relationships and destined connections that serve spiritual evolution and facilitate life purpose fulfillment through fated meetings.",
      sextile: "Soul purpose and fated encounters support each other through conscious openness to destiny. This brings destined opportunities when karmic mission is pursued and spiritual evolution opens doors to life-changing connections that serve soul growth.",
      square: "Karmic mission conflicts with fated relationship patterns, creating tension between soul purpose and destined encounters. This develops authentic evolution through learning to embrace fated connections that challenge comfort zones rather than resist relationships that serve spiritual growth.",
      trine: "Soul purpose and fated encounters flow together naturally. This creates personalities whose karmic mission naturally attracts destined relationships and significant life-changing connections that effortlessly serve spiritual evolution and life purpose fulfillment.",
      opposition: "Soul purpose faces anti-vertex and complementary destiny points. This creates awareness of how karmic mission attracts its opposite through fated encounters, developing relationships that integrate spiritual evolution with others' complementary growth paths.",
      quincunx: "Soul purpose requires ongoing adjustment to fated relationship patterns. This develops the ability to maintain karmic mission while remaining open to destined encounters that challenge and evolve your spiritual path and life purpose expression."
    }
  },

  // PART OF FORTUNE ASPECTS TO OTHER CELESTIAL POINTS
  partoffortune: {
    vertex: {
      conjunction: "Joy and material prosperity align with fated encounters and destiny points. This creates personalities whose path to success and happiness naturally attracts significant relationships and destined connections that facilitate abundance and fulfillment through fated meetings.",
      sextile: "Prosperity and fated encounters support each other through conscious openness to destined abundance. This brings opportunities for success and joy when material manifestation aligns with spiritual destiny and significant relationships open doors to life-changing prosperity.",
      square: "Prosperity needs conflict with fated relationship patterns, creating tension between material success and destined encounters. This develops authentic abundance through learning to embrace fated connections that challenge comfort zones rather than resist relationships that serve true prosperity and soul-aligned success.",
      trine: "Prosperity and fated encounters flow together naturally. This creates personalities whose path to joy and material success naturally attracts destined relationships and significant life-changing connections that effortlessly facilitate abundance and happiness through aligned partnerships.",
      opposition: "Prosperity path faces anti-vertex and complementary destiny points. This creates awareness of how material success and joy attract their opposite through fated encounters, developing relationships that integrate abundance with others' complementary prosperity paths and shared success.",
      quincunx: "Prosperity path requires ongoing adjustment to fated relationship patterns. This develops the ability to maintain authentic abundance while remaining open to destined encounters that challenge and evolve your approach to success, joy, and material manifestation through significant partnerships."
    }
  }
};
