/* eslint-disable @typescript-eslint/no-unused-vars */

// Celestial Point Aspect Interpretations
// =====================================
// 
// Covers aspects between planets and celestial points:
// - Lilith (Black Moon Lilith): Shadow self, wild feminine power, authentic expression
// - Chiron: Wounded healer, transformation through healing, service
// - North Node: Soul purpose, karmic destiny, spiritual evolution
// - South Node: Past-life gifts, comfortable patterns, spiritual balance
// - Part of Fortune: Joy, prosperity, material success through spiritual alignment

export const celestialPointAspectCombinations: Record<
  string,
  Record<string, Record<string, string>>
> = {
  // SUN ASPECTS TO CELESTIAL POINTS
  sun: {
    lilith: {
      conjunction: "Personal identity merges with shadow self and wild feminine power. This creates magnetic personalities who embody authentic power but may struggle with social acceptance of their raw nature.",
      sextile: "Self-expression and shadow integration support each other through conscious work. This brings the ability to express authentic power while maintaining social connections when shadow work is actively pursued.",
      square: "Personal identity conflicts with shadow aspects and wild nature, creating tension between social acceptance and authentic expression. This develops authentic power through learning to integrate rather than suppress instinctual wisdom.",
      trine: "Self-expression and shadow integration flow together naturally. This creates magnetic personalities who easily express authentic power and wild nature without compromising social relationships.",
      opposition: "Conscious identity faces shadow self and repressed aspects. This creates awareness of what has been rejected or suppressed and the need to integrate authentic power with social identity.",
      quincunx: "Self-expression requires ongoing adjustment to shadow aspects and authentic power. This develops the ability to express wild nature appropriately while maintaining social connections."
    },
    chiron: {
      conjunction: "Personal identity merges with wounded healer energy. This creates personalities who embody healing wisdom but may struggle with wounds around self-expression and identity.",
      sextile: "Self-expression and healing abilities support each other through conscious development. This brings the ability to help others while maintaining healthy identity when healing gifts are actively cultivated.",
      square: "Personal identity conflicts with wounded patterns and healing work, creating challenges around expressing self while helping others. This develops authentic healing through learning to balance self-care with service.",
      trine: "Self-expression and healing wisdom flow together naturally. This creates natural healers who easily help others while maintaining strong, healthy identity and self-expression.",
      opposition: "Personal identity faces wounded healer role and others' pain. This creates awareness of boundaries between self and others while developing capacity to help without losing personal identity.",
      quincunx: "Self-expression requires ongoing adjustment to healing work and wounded patterns. This develops the ability to help others while maintaining authentic identity and appropriate boundaries."
    },
    northnode: {
      conjunction: "Personal identity aligns with soul purpose and karmic destiny. This creates personalities whose self-expression naturally serves spiritual evolution and life mission.",
      sextile: "Self-expression and soul purpose support each other through conscious alignment. This brings opportunities to fulfill life mission through authentic self-expression when growth is actively pursued.",
      square: "Personal identity conflicts with soul purpose, creating tension between comfortable self-expression and karmic growth. This develops authentic identity through embracing unfamiliar aspects of soul evolution.",
      trine: "Self-expression and soul purpose flow together harmoniously. This creates natural ability to fulfill karmic destiny through authentic identity and self-expression without internal conflict.",
      opposition: "Personal identity faces karmic destiny and future potential. This creates awareness of how current self-expression may need to evolve to serve soul purpose and spiritual growth.",
      quincunx: "Self-expression requires ongoing adjustment to soul purpose and karmic requirements. This develops the ability to evolve identity in service of spiritual growth and life mission."
    },
    southnode: {
      conjunction: "Personal identity draws heavily on past-life patterns and familiar talents. This creates natural abilities and comfortable self-expression but may limit spiritual growth and evolution.",
      sextile: "Self-expression and past wisdom support each other when consciously balanced. This brings the ability to use natural talents while ensuring they serve current growth rather than spiritual stagnation.",
      square: "Personal identity conflicts with over-reliance on past patterns, creating challenges around growth versus comfort. This develops authentic identity through using past gifts to support rather than avoid evolution.",
      trine: "Self-expression and past talents flow together effortlessly. This creates natural abilities and comfortable identity, though conscious effort is needed to ensure they serve current spiritual growth.",
      opposition: "Personal identity faces past-life comfort and familiar patterns. This creates awareness of how natural talents may need to serve growth rather than provide spiritual avoidance.",
      quincunx: "Self-expression requires ongoing adjustment to past patterns and spiritual growth needs. This develops the ability to use natural talents in service of evolution rather than comfort."
    },
    partoffortune: {
      conjunction: "Personal identity aligns with joy and material prosperity. This creates personalities whose authentic self-expression naturally attracts success and happiness.",
      sextile: "Self-expression and prosperity support each other through conscious alignment. This brings opportunities for success and joy when authentic identity is actively expressed and developed.",
      square: "Personal identity conflicts with prosperity needs, creating tension between authentic expression and material success. This develops true prosperity through learning to find joy in authentic self-expression.",
      trine: "Self-expression and prosperity flow together naturally. This creates natural magnetism for success and joy through authentic identity without compromising personal values.",
      opposition: "Personal identity faces external prosperity and material focus. This creates awareness of the balance between authentic self-expression and social expectations for success.",
      quincunx: "Self-expression requires ongoing adjustment to changing prosperity needs and material circumstances. This develops flexible identity that can adapt while maintaining authenticity."
    }
  },

  // MOON ASPECTS TO CELESTIAL POINTS
  moon: {
    lilith: {
      conjunction: "Emotional instincts merge with shadow self and wild feminine power. This creates intense emotional authenticity but may manifest as emotional rebellion or difficulty with conventional feelings.",
      sextile: "Emotional security and shadow integration support each other through conscious work. This brings the ability to feel deeply and authentically while maintaining emotional balance when inner work is actively pursued.",
      square: "Emotional needs conflict with shadow aspects and wild instincts, creating tension between emotional comfort and authentic feeling. This develops emotional courage through learning to feel without suppressing natural responses.",
      trine: "Emotional instincts and shadow integration flow together naturally. This creates natural emotional authenticity and the ability to feel deeply without emotional manipulation or suppression.",
      opposition: "Emotional security faces shadow self and repressed feelings. This creates awareness of suppressed emotions and the need to integrate authentic feeling with emotional safety.",
      quincunx: "Emotional security requires ongoing adjustment to shadow aspects and authentic feeling. This develops the ability to maintain emotional balance while honoring wild, instinctual responses."
    },
    chiron: {
      conjunction: "Emotional patterns merge with wounded healer energy. This creates deep emotional sensitivity and healing abilities but may manifest as emotional wounds around nurturing and security.",
      sextile: "Emotional healing and wounded wisdom support each other through conscious development. This brings the ability to heal emotional patterns while helping others process their feelings.",
      square: "Emotional security conflicts with wounded patterns and healing work, creating challenges around emotional boundaries and self-care. This develops emotional healing through learning to process pain constructively.",
      trine: "Emotional instincts and healing wisdom flow together naturally. This creates natural emotional healing abilities and the capacity to help others feel safe while processing their own emotions.",
      opposition: "Emotional security faces wounded healer role and others' emotional pain. This creates awareness of emotional boundaries and the need to nurture self while helping others heal.",
      quincunx: "Emotional patterns require ongoing adjustment to healing work and wounded wisdom. This develops the ability to maintain emotional health while serving others' healing needs."
    },
    northnode: {
      conjunction: "Emotional patterns align with soul purpose and karmic destiny. This creates personalities whose emotional expression naturally serves spiritual evolution and intuitive growth.",
      sextile: "Emotional instincts and soul purpose support each other through conscious development. This brings opportunities to fulfill life mission through emotional wisdom and intuitive guidance.",
      square: "Emotional comfort conflicts with soul purpose, creating tension between familiar feelings and karmic growth. This develops emotional courage through embracing unfamiliar emotional territory for spiritual evolution.",
      trine: "Emotional instincts and soul purpose flow together harmoniously. This creates natural ability to fulfill karmic destiny through emotional wisdom and intuitive understanding.",
      opposition: "Emotional security faces karmic destiny and future potential. This creates awareness of how emotional patterns may need to evolve to serve soul purpose and spiritual growth.",
      quincunx: "Emotional patterns require ongoing adjustment to soul purpose and karmic requirements. This develops the ability to evolve emotional responses in service of spiritual growth."
    },
    southnode: {
      conjunction: "Emotional patterns draw heavily on past-life comfort and familiar feelings. This creates natural emotional abilities but may limit emotional growth through over-reliance on past patterns.",
      sextile: "Emotional instincts and past wisdom support each other when consciously balanced. This brings the ability to use natural emotional talents while ensuring they serve current growth.",
      square: "Emotional comfort conflicts with over-reliance on past patterns, creating challenges around emotional growth versus familiar security. This develops emotional maturity through using past gifts for current evolution.",
      trine: "Emotional instincts and past patterns flow together effortlessly. This creates natural emotional abilities and comfort, though conscious effort is needed to ensure emotional growth continues.",
      opposition: "Emotional security faces past-life comfort and familiar emotional patterns. This creates awareness of how natural emotional responses may need to serve growth rather than avoid challenge.",
      quincunx: "Emotional patterns require ongoing adjustment between past comfort and current growth needs. This develops the ability to use emotional gifts in service of evolution rather than stagnation."
    },
    partoffortune: {
      conjunction: "Emotional patterns align with joy and material prosperity. This creates personalities whose authentic emotional expression naturally attracts happiness and success.",
      sextile: "Emotional instincts and prosperity support each other through conscious alignment. This brings opportunities for joy and success when emotional authenticity is actively expressed.",
      square: "Emotional needs conflict with prosperity requirements, creating tension between authentic feeling and material success. This develops true joy through learning to find prosperity in emotional authenticity.",
      trine: "Emotional instincts and prosperity flow together naturally. This creates natural magnetism for happiness and success through authentic emotional expression and intuitive wisdom.",
      opposition: "Emotional authenticity faces external prosperity and material expectations. This creates awareness of the balance between genuine feeling and social expectations for emotional expression.",
      quincunx: "Emotional patterns require ongoing adjustment to changing prosperity needs and material circumstances. This develops flexible emotional expression that maintains authenticity while adapting to external conditions."
    }
  },

  // MERCURY ASPECTS TO CELESTIAL POINTS
  mercury: {
    lilith: {
      conjunction: "Mental processes merge with shadow self and wild feminine power. This creates brilliant, unconventional thinking but may manifest as intellectual rebellion or thoughts that challenge social norms.",
      sextile: "Mental abilities and shadow integration support each other through conscious exploration. This brings the ability to think authentically and communicate wild wisdom when inner work is actively pursued.",
      square: "Mental patterns conflict with shadow aspects and wild thinking, creating tension between conventional logic and instinctual wisdom. This develops authentic intelligence through learning to trust intuitive insights.",
      trine: "Mental processes and shadow integration flow together naturally. This creates natural ability to think outside conventional frameworks and communicate authentic insights without social rejection.",
      opposition: "Rational thinking faces shadow self and suppressed mental patterns. This creates awareness of repressed thoughts and the need to integrate instinctual wisdom with logical analysis.",
      quincunx: "Mental processes require ongoing adjustment to shadow aspects and wild thinking. This develops the ability to communicate unconventional ideas while maintaining intellectual credibility."
    },
    chiron: {
      conjunction: "Mental processes merge with wounded healer energy. This creates healing communication abilities but may manifest as mental wounds around learning, speaking, or being heard.",
      sextile: "Mental abilities and healing wisdom support each other through conscious development. This brings the ability to communicate healing insights while processing one's own learning wounds.",
      square: "Mental patterns conflict with wounded wisdom and healing work, creating challenges around intellectual confidence and healing communication. This develops authentic teaching through healing learning wounds.",
      trine: "Mental processes and healing wisdom flow together naturally. This creates natural ability to communicate healing insights and help others learn while processing information intuitively.",
      opposition: "Rational thinking faces wounded healer role and others' learning pain. This creates awareness of mental boundaries and the need to learn while helping others understand.",
      quincunx: "Mental processes require ongoing adjustment to healing work and wounded wisdom. This develops the ability to maintain intellectual clarity while serving others' learning and communication needs."
    },
    northnode: {
      conjunction: "Mental processes align with soul purpose and karmic destiny. This creates personalities whose thinking and communication naturally serve spiritual evolution and wisdom sharing.",
      sextile: "Mental abilities and soul purpose support each other through conscious development. This brings opportunities to fulfill life mission through teaching, writing, or sharing wisdom.",
      square: "Mental comfort conflicts with soul purpose, creating tension between familiar thinking and karmic growth. This develops mental courage through embracing new ways of learning and communicating.",
      trine: "Mental processes and soul purpose flow together harmoniously. This creates natural ability to fulfill karmic destiny through wisdom sharing and evolutionary thinking.",
      opposition: "Mental patterns face karmic destiny and future potential. This creates awareness of how thinking patterns may need to evolve to serve soul purpose and spiritual communication.",
      quincunx: "Mental processes require ongoing adjustment to soul purpose and karmic requirements. This develops the ability to evolve thinking patterns in service of spiritual wisdom and communication."
    },
    southnode: {
      conjunction: "Mental processes draw heavily on past-life knowledge and familiar thinking patterns. This creates natural intellectual abilities but may limit mental growth through over-reliance on past wisdom.",
      sextile: "Mental abilities and past knowledge support each other when consciously balanced. This brings the ability to use natural intellectual talents while ensuring they serve current learning and growth.",
      square: "Mental comfort conflicts with over-reliance on past knowledge, creating challenges around intellectual growth versus familiar thinking. This develops mental maturity through using past wisdom for current learning.",
      trine: "Mental processes and past knowledge flow together effortlessly. This creates natural intellectual abilities and mental comfort, though conscious effort is needed to ensure continued learning.",
      opposition: "Mental patterns face past-life knowledge and familiar thinking. This creates awareness of how natural intellectual abilities may need to serve growth rather than avoid new learning.",
      quincunx: "Mental processes require ongoing adjustment between past knowledge and current learning needs. This develops the ability to use intellectual gifts in service of evolution rather than mental stagnation."
    },
    partoffortune: {
      conjunction: "Mental processes align with joy and material prosperity. This creates personalities whose authentic thinking and communication naturally attract success and happiness.",
      sextile: "Mental abilities and prosperity support each other through conscious alignment. This brings opportunities for success and joy when authentic thinking and communication are actively expressed.",
      square: "Mental needs conflict with prosperity requirements, creating tension between authentic thinking and material success. This develops true prosperity through learning to find joy in honest communication.",
      trine: "Mental processes and prosperity flow together naturally. This creates natural magnetism for success and happiness through authentic thinking, learning, and communication abilities.",
      opposition: "Mental authenticity faces external prosperity and material expectations. This creates awareness of the balance between genuine thinking and social expectations for communication and learning.",
      quincunx: "Mental processes require ongoing adjustment to changing prosperity needs and material circumstances. This develops flexible thinking that maintains authenticity while adapting to external learning requirements."
    }
  },

  // VENUS ASPECTS TO CELESTIAL POINTS
  venus: {
    lilith: {
      conjunction: "Love and beauty merge with shadow self and wild feminine power. This creates magnetic attraction and authentic sensuality but may manifest as unconventional relationships or challenging social beauty standards.",
      sextile: "Romantic values and shadow integration support each other through conscious self-acceptance. This brings the ability to love authentically and express wild beauty when inner work actively embraces rejected aspects of femininity.",
      square: "Love values conflict with shadow aspects and wild instincts, creating tension between social beauty standards and authentic sensuality. This develops genuine self-love through learning to embrace rather than hide natural magnetism.",
      trine: "Love and shadow integration flow together naturally. This creates natural ability to express authentic beauty and wild sensuality without compromising relationships or social acceptance.",
      opposition: "Romantic ideals face shadow self and suppressed desires. This creates awareness of what has been rejected in love and beauty, developing the need to integrate authentic sensuality with social values.",
      quincunx: "Love expression requires ongoing adjustment to shadow aspects and wild nature. This develops the ability to express authentic beauty and sensuality while maintaining loving relationships and social harmony."
    },
    chiron: {
      conjunction: "Love and beauty merge with wounded healer energy. This creates healing through love and artistic expression but may manifest as wounds around self-worth, beauty, or relationship patterns.",
      sextile: "Love values and healing wisdom support each other through conscious heart work. This brings the ability to heal through love and help others with relationship wounds when compassion is actively cultivated.",
      square: "Love needs conflict with wounded patterns and healing work, creating challenges around self-worth and relationship healing. This develops authentic love through learning to heal rather than repeat painful relationship patterns.",
      trine: "Love and healing wisdom flow together naturally. This creates natural ability to heal through love and help others develop healthy relationships while maintaining beautiful, harmonious connections.",
      opposition: "Love values face wounded healer role and others' relationship pain. This creates awareness of love boundaries and the need to maintain self-worth while helping others heal their hearts.",
      quincunx: "Love expression requires ongoing adjustment to healing work and relationship wounds. This develops the ability to maintain healthy love while serving others' healing needs and processing relationship lessons."
    },
    northnode: {
      conjunction: "Love values align with soul purpose and karmic destiny. This creates personalities whose approach to love and beauty naturally serves spiritual evolution and heart-centered growth.",
      sextile: "Love expression and soul purpose support each other through conscious heart opening. This brings opportunities to fulfill life mission through loving relationships and artistic expression when growth is actively pursued.",
      square: "Love comfort conflicts with soul purpose, creating tension between familiar relationship patterns and karmic heart growth. This develops authentic love through embracing new ways of loving and relating.",
      trine: "Love values and soul purpose flow together harmoniously. This creates natural ability to fulfill karmic destiny through heart-centered relationships and expressions of beauty that serve spiritual evolution.",
      opposition: "Love patterns face karmic destiny and heart evolution. This creates awareness of how current relationship approaches may need to evolve to serve soul purpose and spiritual growth through love.",
      quincunx: "Love expression requires ongoing adjustment to soul purpose and heart evolution requirements. This develops the ability to evolve relationship patterns in service of spiritual growth and heart-centered mission."
    },
    southnode: {
      conjunction: "Love values draw heavily on past-life relationship patterns and familiar approaches to beauty. This creates natural charm and relationship abilities but may limit heart growth through comfort seeking.",
      sextile: "Love expression and past relationship wisdom support each other when consciously balanced. This brings the ability to use natural charm while ensuring relationships serve current heart growth rather than spiritual stagnation.",
      square: "Love comfort conflicts with over-reliance on past relationship patterns, creating challenges around heart growth versus familiar love dynamics. This develops authentic love through using past relationship gifts for current evolution.",
      trine: "Love values and past relationship patterns flow together effortlessly. This creates natural relationship abilities and romantic comfort, though conscious effort is needed to ensure love serves current spiritual growth.",
      opposition: "Love patterns face past-life relationship comfort and familiar romantic approaches. This creates awareness of how natural relationship abilities may need to serve growth rather than provide emotional avoidance.",
      quincunx: "Love expression requires ongoing adjustment between past relationship patterns and current heart growth needs. This develops the ability to use relationship gifts in service of evolution rather than romantic stagnation."
    },
    partoffortune: {
      conjunction: "Love values align with joy and material prosperity. This creates personalities whose authentic approach to love and beauty naturally attracts success and happiness through heart-centered expression.",
      sextile: "Love expression and prosperity support each other through conscious heart alignment. This brings opportunities for success and joy when authentic love and artistic expression are actively shared and developed.",
      square: "Love needs conflict with prosperity requirements, creating tension between authentic heart expression and material success. This develops true prosperity through learning to find joy in genuine love and artistic authenticity.",
      trine: "Love values and prosperity flow together naturally. This creates natural magnetism for success and happiness through authentic relationships, artistic expression, and heart-centered approaches to material abundance.",
      opposition: "Love authenticity faces external prosperity and material expectations. This creates awareness of the balance between genuine heart expression and social expectations for relationships, beauty, and success.",
      quincunx: "Love expression requires ongoing adjustment to changing prosperity needs and material circumstances. This develops flexible heart expression that maintains authentic love while adapting to external requirements for success and beauty."
    }
  },

  // MARS ASPECTS TO CELESTIAL POINTS
  mars: {
    lilith: {
      conjunction: "Action and desire merge with shadow self and wild feminine power. This creates explosive passion and authentic assertion but may manifest as aggressive sexuality or conflicts around power and desire.",
      sextile: "Action and shadow integration support each other through conscious empowerment. This brings the ability to assert authentic power and express wild desires when inner work actively embraces instinctual nature.",
      square: "Action impulses conflict with shadow aspects and wild instincts, creating tension between social acceptability and authentic assertion. This develops genuine power through learning to channel rather than suppress instinctual aggression.",
      trine: "Action and shadow integration flow together naturally. This creates natural ability to assert authentic power and express wild desires without destructive aggression or social rejection.",
      opposition: "Assertive action faces shadow self and suppressed power. This creates awareness of denied anger and desires, developing the need to integrate authentic assertion with constructive action.",
      quincunx: "Action impulses require ongoing adjustment to shadow aspects and wild nature. This develops the ability to express authentic power and desire appropriately while maintaining constructive relationships and goals."
    },
    chiron: {
      conjunction: "Action and assertion merge with wounded healer energy. This creates healing through courage and protective action but may manifest as wounds around anger, assertion, or masculine expression.",
      sextile: "Action energy and healing wisdom support each other through conscious warrior work. This brings the ability to heal through courage and help others with assertion wounds when strength is actively applied to service.",
      square: "Action impulses conflict with wounded patterns and healing work, creating challenges around healthy anger and assertion healing. This develops authentic strength through learning to heal rather than repeat aggressive patterns.",
      trine: "Action and healing wisdom flow together naturally. This creates natural ability to heal through courage and help others develop healthy assertion while maintaining strong, constructive action.",
      opposition: "Action impulses face wounded healer role and others' assertion pain. This creates awareness of strength boundaries and the need to maintain healthy aggression while helping others heal their relationship with power.",
      quincunx: "Action expression requires ongoing adjustment to healing work and assertion wounds. This develops the ability to maintain healthy strength while serving others' healing needs and processing lessons about power and courage."
    },
    northnode: {
      conjunction: "Action and assertion align with soul purpose and karmic destiny. This creates personalities whose approach to action and courage naturally serves spiritual evolution and warrior-like growth.",
      sextile: "Action energy and soul purpose support each other through conscious courage development. This brings opportunities to fulfill life mission through brave action and protective service when growth is actively pursued.",
      square: "Action comfort conflicts with soul purpose, creating tension between familiar assertion patterns and karmic courage growth. This develops authentic strength through embracing new ways of taking action and expressing power.",
      trine: "Action energy and soul purpose flow together harmoniously. This creates natural ability to fulfill karmic destiny through courageous action and warrior-like service that serves spiritual evolution.",
      opposition: "Action patterns face karmic destiny and courage evolution. This creates awareness of how current assertion approaches may need to evolve to serve soul purpose and spiritual growth through brave action.",
      quincunx: "Action expression requires ongoing adjustment to soul purpose and courage evolution requirements. This develops the ability to evolve assertion patterns in service of spiritual growth and warrior-centered mission."
    },
    southnode: {
      conjunction: "Action energy draws heavily on past-life warrior patterns and familiar approaches to assertion. This creates natural courage and leadership abilities but may limit strength growth through aggressive comfort seeking.",
      sextile: "Action expression and past warrior wisdom support each other when consciously balanced. This brings the ability to use natural strength while ensuring action serves current growth rather than spiritual stagnation through aggression.",
      square: "Action comfort conflicts with over-reliance on past warrior patterns, creating challenges around strength growth versus familiar aggressive dynamics. This develops authentic courage through using past warrior gifts for current evolution.",
      trine: "Action energy and past warrior patterns flow together effortlessly. This creates natural leadership abilities and aggressive comfort, though conscious effort is needed to ensure strength serves current spiritual growth.",
      opposition: "Action patterns face past-life warrior comfort and familiar aggressive approaches. This creates awareness of how natural leadership abilities may need to serve growth rather than provide power avoidance through familiar dominance.",
      quincunx: "Action expression requires ongoing adjustment between past warrior patterns and current strength growth needs. This develops the ability to use leadership gifts in service of evolution rather than aggressive stagnation."
    },
    partoffortune: {
      conjunction: "Action energy aligns with joy and material prosperity. This creates personalities whose authentic approach to action and assertion naturally attracts success and happiness through courageous expression.",
      sextile: "Action expression and prosperity support each other through conscious strength alignment. This brings opportunities for success and joy when authentic courage and assertive action are actively expressed and applied.",
      square: "Action needs conflict with prosperity requirements, creating tension between authentic strength expression and material success. This develops true prosperity through learning to find joy in genuine courage and assertive authenticity.",
      trine: "Action energy and prosperity flow together naturally. This creates natural magnetism for success and happiness through authentic assertion, courageous action, and strength-centered approaches to material achievement.",
      opposition: "Action authenticity faces external prosperity and material expectations. This creates awareness of the balance between genuine strength expression and social expectations for assertion, leadership, and success through power.",
      quincunx: "Action expression requires ongoing adjustment to changing prosperity needs and material circumstances. This develops flexible strength expression that maintains authentic courage while adapting to external requirements for success and leadership."
    }
  },

  // JUPITER ASPECTS TO CELESTIAL POINTS
  jupiter: {
    lilith: {
      conjunction: "Expansion and optimism merge with shadow self and wild feminine power. This creates enthusiastic embrace of authentic nature but may manifest as excessive rebellion or over-identification with outsider status.",
      sextile: "Growth and shadow integration support each other through conscious expansion of authenticity. This brings the ability to grow through embracing rejected aspects when optimism actively includes shadow work and wild nature acceptance.",
      square: "Optimistic expansion conflicts with shadow aspects and wild instincts, creating tension between positive thinking and authentic darkness. This develops genuine wisdom through learning to integrate rather than spiritually bypass shadow material.",
      trine: "Expansion and shadow integration flow together naturally. This creates natural ability to grow through authentic self-acceptance and embrace wild nature without losing optimistic faith or spiritual growth.",
      opposition: "Optimistic beliefs face shadow self and suppressed wildness. This creates awareness of spiritual bypassing and the need to integrate authentic darkness with expansive growth and philosophical understanding.",
      quincunx: "Expansion requires ongoing adjustment to shadow aspects and wild nature. This develops the ability to maintain optimistic growth while honoring authentic darkness and integrating rejected aspects into spiritual philosophy."
    },
    chiron: {
      conjunction: "Expansion and optimism merge with wounded healer energy. This creates healing through wisdom and philosophical growth but may manifest as spiritual teacher wounds or excessive helping to avoid personal pain.",
      sextile: "Growth and healing wisdom support each other through conscious teaching development. This brings the ability to heal through sharing wisdom and help others grow when teaching gifts are actively applied to service.",
      square: "Optimistic expansion conflicts with wounded patterns and healing work, creating challenges around spiritual teacher wounds and growth through pain processing. This develops authentic wisdom through learning to heal rather than teach away from suffering.",
      trine: "Expansion and healing wisdom flow together naturally. This creates natural ability to heal through teaching and help others grow while maintaining wise, optimistic approaches to transformation and spiritual development.",
      opposition: "Optimistic growth faces wounded healer role and others' learning pain. This creates awareness of teaching boundaries and the need to maintain personal growth while helping others expand their wisdom and philosophical understanding.",
      quincunx: "Expansion requires ongoing adjustment to healing work and teaching wounds. This develops the ability to maintain wise growth while serving others' learning needs and processing lessons about teaching, wisdom, and spiritual authority."
    },
    northnode: {
      conjunction: "Expansion and optimism align with soul purpose and karmic destiny. This creates personalities whose approach to growth and wisdom naturally serves spiritual evolution and philosophical development.",
      sextile: "Growth energy and soul purpose support each other through conscious expansion development. This brings opportunities to fulfill life mission through teaching, travel, and wisdom sharing when growth is actively pursued.",
      square: "Growth comfort conflicts with soul purpose, creating tension between familiar expansion patterns and karmic wisdom development. This develops authentic understanding through embracing new approaches to learning and philosophical growth.",
      trine: "Growth energy and soul purpose flow together harmoniously. This creates natural ability to fulfill karmic destiny through wise teaching and philosophical service that serves spiritual evolution and expanded consciousness.",
      opposition: "Growth patterns face karmic destiny and wisdom evolution. This creates awareness of how current expansion approaches may need to evolve to serve soul purpose and spiritual growth through higher learning.",
      quincunx: "Growth expression requires ongoing adjustment to soul purpose and wisdom evolution requirements. This develops the ability to evolve expansion patterns in service of spiritual growth and teaching-centered mission."
    },
    southnode: {
      conjunction: "Growth energy draws heavily on past-life wisdom patterns and familiar approaches to expansion. This creates natural teaching and philosophical abilities but may limit growth through intellectual comfort seeking.",
      sextile: "Growth expression and past wisdom patterns support each other when consciously balanced. This brings the ability to use natural teaching gifts while ensuring expansion serves current growth rather than spiritual stagnation through knowledge hoarding.",
      square: "Growth comfort conflicts with over-reliance on past wisdom patterns, creating challenges around expansion growth versus familiar philosophical dynamics. This develops authentic understanding through using past teaching gifts for current evolution.",
      trine: "Growth energy and past wisdom patterns flow together effortlessly. This creates natural teaching abilities and philosophical comfort, though conscious effort is needed to ensure wisdom serves current spiritual growth.",
      opposition: "Growth patterns face past-life wisdom comfort and familiar teaching approaches. This creates awareness of how natural philosophical abilities may need to serve growth rather than provide learning avoidance through familiar knowledge superiority.",
      quincunx: "Growth expression requires ongoing adjustment between past wisdom patterns and current expansion growth needs. This develops the ability to use teaching gifts in service of evolution rather than intellectual stagnation."
    },
    partoffortune: {
      conjunction: "Expansion and optimism align with joy and material prosperity. This creates personalities whose authentic approach to growth and wisdom naturally attracts success and happiness through philosophical expression.",
      sextile: "Growth expression and prosperity support each other through conscious expansion alignment. This brings opportunities for success and joy when authentic wisdom and philosophical growth are actively shared and developed.",
      square: "Growth needs conflict with prosperity requirements, creating tension between authentic expansion and material success. This develops true prosperity through learning to find joy in genuine wisdom and philosophical authenticity.",
      trine: "Growth energy and prosperity flow together naturally. This creates natural magnetism for success and happiness through authentic teaching, philosophical expression, and wisdom-centered approaches to material abundance.",
      opposition: "Growth authenticity faces external prosperity and material expectations. This creates awareness of the balance between genuine wisdom expression and social expectations for teaching, philosophy, and success through knowledge.",
      quincunx: "Growth expression requires ongoing adjustment to changing prosperity needs and material circumstances. This develops flexible expansion that maintains authentic wisdom while adapting to external requirements for success and teaching."
    }
  },

  // SATURN ASPECTS TO CELESTIAL POINTS
  saturn: {
    lilith: {
      conjunction: "Structure and discipline merge with shadow self and wild feminine power. This creates disciplined integration of authentic nature but may manifest as rigid control of instinctual energy or systematic suppression of wildness.",
      sextile: "Structure and shadow integration support each other through conscious discipline of authenticity. This brings the ability to build lasting foundations while embracing wild nature when systematic inner work actively includes shadow acceptance.",
      square: "Structural limitations conflict with shadow aspects and wild instincts, creating tension between control and authentic expression. This develops mature authenticity through learning to structure rather than suppress instinctual wisdom.",
      trine: "Structure and shadow integration flow together naturally. This creates natural ability to build lasting foundations through authentic self-expression and channel wild nature into constructive, enduring forms.",
      opposition: "Structural authority faces shadow self and suppressed wildness. This creates awareness of control issues and the need to integrate disciplined responsibility with authentic instinctual expression.",
      quincunx: "Structure requires ongoing adjustment to shadow aspects and wild nature. This develops the ability to maintain disciplined growth while honoring authentic darkness and integrating rejected aspects into systematic development."
    },
    chiron: {
      conjunction: "Structure and discipline merge with wounded healer energy. This creates healing through systematic work and disciplined therapy but may manifest as rigid healing approaches or systematic avoidance of emotional processing.",
      sextile: "Structure and healing wisdom support each other through conscious discipline of therapeutic work. This brings the ability to heal systematically and help others build lasting recovery when healing gifts are applied with consistent effort.",
      square: "Structural limitations conflict with wounded patterns and healing work, creating challenges around systematic healing and disciplined therapy approaches. This develops authentic healing through learning to structure rather than control therapeutic process.",
      trine: "Structure and healing wisdom flow together naturally. This creates natural ability to heal through systematic approaches and help others build lasting recovery while maintaining disciplined, methodical therapeutic development.",
      opposition: "Structural authority faces wounded healer role and others' therapeutic needs. This creates awareness of healing boundaries and the need to maintain disciplined responsibility while helping others build systematic recovery.",
      quincunx: "Structure requires ongoing adjustment to healing work and therapeutic wounds. This develops the ability to maintain systematic healing while serving others' recovery needs and processing lessons about disciplined therapy and structured growth."
    },
    northnode: {
      conjunction: "Structure and discipline align with soul purpose and karmic destiny. This creates personalities whose approach to responsibility and systematic growth naturally serves spiritual evolution and disciplined development.",
      sextile: "Structure and soul purpose support each other through conscious discipline development. This brings opportunities to fulfill life mission through systematic work and responsible service when growth is actively pursued through consistent effort.",
      square: "Structural comfort conflicts with soul purpose, creating tension between familiar responsibility patterns and karmic discipline development. This develops authentic authority through embracing new approaches to systematic growth and structured evolution.",
      trine: "Structure and soul purpose flow together harmoniously. This creates natural ability to fulfill karmic destiny through disciplined service and systematic approaches that serve spiritual evolution and structured consciousness development.",
      opposition: "Structural patterns face karmic destiny and discipline evolution. This creates awareness of how current responsibility approaches may need to evolve to serve soul purpose and spiritual growth through systematic development.",
      quincunx: "Structure requires ongoing adjustment to soul purpose and discipline evolution requirements. This develops the ability to evolve systematic patterns in service of spiritual growth and responsibility-centered mission."
    },
    southnode: {
      conjunction: "Structure draws heavily on past-life discipline patterns and familiar approaches to responsibility. This creates natural authority and systematic abilities but may limit growth through rigid comfort seeking.",
      sextile: "Structure and past discipline patterns support each other when consciously balanced. This brings the ability to use natural authority while ensuring systematic approaches serve current growth rather than spiritual stagnation through rigid control.",
      square: "Structural comfort conflicts with over-reliance on past discipline patterns, creating challenges around responsibility growth versus familiar authoritarian dynamics. This develops authentic authority through using past systematic gifts for current evolution.",
      trine: "Structure and past discipline patterns flow together effortlessly. This creates natural authority abilities and systematic comfort, though conscious effort is needed to ensure responsibility serves current spiritual growth.",
      opposition: "Structural patterns face past-life discipline comfort and familiar authority approaches. This creates awareness of how natural systematic abilities may need to serve growth rather than provide responsibility avoidance through familiar control superiority.",
      quincunx: "Structure requires ongoing adjustment between past discipline patterns and current responsibility growth needs. This develops the ability to use authority gifts in service of evolution rather than systematic stagnation."
    },
    partoffortune: {
      conjunction: "Structure and discipline align with joy and material prosperity. This creates personalities whose authentic approach to responsibility and systematic work naturally attracts success and happiness through disciplined expression.",
      sextile: "Structure and prosperity support each other through conscious discipline alignment. This brings opportunities for success and joy when authentic responsibility and systematic work are actively applied and developed.",
      square: "Structural needs conflict with prosperity requirements, creating tension between authentic discipline and material success. This develops true prosperity through learning to find joy in genuine responsibility and systematic authenticity.",
      trine: "Structure and prosperity flow together naturally. This creates natural magnetism for success and happiness through authentic authority, disciplined work, and responsibility-centered approaches to material achievement.",
      opposition: "Structural authenticity faces external prosperity and material expectations. This creates awareness of the balance between genuine responsibility expression and social expectations for authority, discipline, and success through systematic control.",
      quincunx: "Structure requires ongoing adjustment to changing prosperity needs and material circumstances. This develops flexible discipline that maintains authentic responsibility while adapting to external requirements for success and systematic achievement."
    }
  },

  // URANUS ASPECTS TO CELESTIAL POINTS
  uranus: {
    lilith: {
      conjunction: "Innovation and revolution merge with shadow self and wild feminine power. This creates explosive breakthroughs in authentic expression but may manifest as shocking rebellion or sudden unleashing of suppressed power.",
      sextile: "Revolutionary change and shadow integration support each other through conscious awakening. This brings the ability to innovate authentically and break free from suppression when inner work is actively pursued.",
      square: "Revolutionary urges conflict with shadow aspects and wild instincts, creating unpredictable tension between freedom and authentic power. This develops genuine liberation through learning to channel instinctual rebellion constructively.",
      trine: "Innovation and shadow integration flow together naturally. This creates natural ability to break free from limitations and express authentic power without destructive rebellion or social upheaval.",
      opposition: "Revolutionary freedom faces shadow self and suppressed power. This creates sudden awareness of what has been denied or rejected and the need to liberate authentic expression without destructive consequences.",
      quincunx: "Revolutionary energy requires ongoing adjustment to shadow aspects and authentic power. This develops the ability to channel innovative rebellion appropriately while honoring wild, instinctual nature."
    },
    chiron: {
      conjunction: "Revolutionary change merges with wounded healer energy. This creates breakthrough healing through sudden insight and innovative therapeutic approaches but may manifest as disruptive healing crises or revolutionary therapy methods.",
      sextile: "Innovation and healing wisdom support each other through conscious awakening to therapeutic breakthroughs. This brings the ability to heal through revolutionary methods when healing gifts are applied with innovative consciousness.",
      square: "Revolutionary urges conflict with wounded patterns and healing work, creating unpredictable tension between freedom and therapeutic responsibility. This develops authentic healing through learning to innovate rather than disrupt healing process.",
      trine: "Innovation and healing wisdom flow together naturally. This creates natural ability to breakthrough healing limitations and develop revolutionary therapeutic approaches without destructive disruption to recovery process.",
      opposition: "Revolutionary freedom faces wounded healer role and therapeutic responsibility. This creates sudden awareness of healing limitations and the need to innovate therapeutic methods without abandoning healing commitment.",
      quincunx: "Revolutionary energy requires ongoing adjustment to healing work and therapeutic wounds. This develops the ability to channel innovative healing appropriately while maintaining therapeutic responsibility and recovery process."
    },
    northnode: {
      conjunction: "Revolutionary change aligns with soul purpose and karmic destiny. This creates personalities whose innovative consciousness and breakthrough insights naturally serve evolutionary awakening and revolutionary spiritual service.",
      sextile: "Innovation and soul purpose support each other through conscious awakening to evolutionary potential. This brings opportunities to fulfill life mission through revolutionary consciousness when breakthrough insights are actively applied to spiritual evolution.",
      square: "Revolutionary pressure conflicts with soul purpose, creating tension between innovative rebellion and karmic responsibility. This develops authentic spiritual revolution through learning to serve awakening rather than rebel against evolutionary requirement.",
      trine: "Innovation and soul purpose flow together harmoniously. This creates natural ability to fulfill karmic destiny through revolutionary consciousness and breakthrough spiritual service without destructive rebellion against spiritual responsibility.",
      opposition: "Revolutionary freedom faces karmic destiny and evolutionary responsibility. This creates awareness of spiritual rebellion dynamics and the need to use innovative consciousness to serve rather than rebel against soul evolution.",
      quincunx: "Revolutionary energy requires ongoing adjustment to soul purpose and evolutionary requirements. This develops the ability to channel breakthrough consciousness while serving spiritual awakening and evolutionary responsibility without destructive rebellion."
    },
    southnode: {
      conjunction: "Revolutionary change draws on past-life knowledge of innovative consciousness and breakthrough abilities. This creates natural revolutionary talents but may manifest as repeating past patterns of rebellious behavior or innovative disruption.",
      sextile: "Innovation and past revolutionary wisdom support each other when consciously balanced. This brings the ability to use natural breakthrough talents while ensuring they serve current evolution rather than past rebellion patterns.",
      square: "Revolutionary pressure conflicts with over-reliance on past innovative patterns, creating challenges around spiritual evolution versus familiar rebellion dynamics. This develops authentic revolution through using past breakthrough gifts for current evolutionary service.",
      trine: "Innovation and past revolutionary patterns flow together effortlessly. This creates natural breakthrough abilities and comfortable innovative consciousness, though conscious effort is needed to ensure revolutionary talents serve current spiritual evolution.",
      opposition: "Revolutionary freedom faces past-life innovative comfort and familiar rebellion patterns. This creates awareness of how natural breakthrough abilities may need to serve evolution rather than repeat familiar disruption dynamics or revolutionary superiority.",
      quincunx: "Revolutionary energy requires ongoing adjustment between past innovative patterns and current evolutionary needs. This develops the ability to use breakthrough gifts in service of spiritual awakening rather than rebellious disruption or revolutionary stagnation."
    },
    partoffortune: {
      conjunction: "Revolutionary change aligns with joy and material prosperity. This creates personalities whose authentic innovative consciousness and breakthrough insights naturally attract success and happiness through revolutionary expression.",
      sextile: "Innovation and prosperity support each other through conscious breakthrough alignment. This brings opportunities for success and joy when authentic revolutionary consciousness and innovative insights are actively expressed and applied.",
      square: "Revolutionary needs conflict with prosperity requirements, creating tension between authentic innovation and material success. This develops true prosperity through learning to find joy in genuine breakthrough consciousness and revolutionary authenticity.",
      trine: "Innovation and prosperity flow together naturally. This creates natural magnetism for success and happiness through authentic revolutionary consciousness, breakthrough insights, and innovation-centered approaches to material achievement.",
      opposition: "Revolutionary authenticity faces external prosperity and material expectations. This creates awareness of the balance between genuine breakthrough expression and social expectations for innovation, revolution, and success through disruptive change.",
      quincunx: "Revolutionary energy requires ongoing adjustment to changing prosperity needs and material circumstances. This develops flexible innovation that maintains authentic breakthrough consciousness while adapting to external requirements for success and revolutionary achievement."
    }
  },

  // NEPTUNE ASPECTS TO CELESTIAL POINTS  
  neptune: {
    lilith: {
      conjunction: "Spiritual transcendence merges with shadow self and wild feminine power. This creates mystical rebellion and spiritual authenticity but may manifest as spiritual delusion or escapist shadow work.",
      sextile: "Spiritual inspiration and shadow integration support each other through conscious transcendence. This brings the ability to access mystical insights while integrating authentic power when spiritual practices actively include shadow work.",
      square: "Spiritual idealism conflicts with shadow aspects and wild instincts, creating confusion between transcendence and authentic power. This develops genuine spirituality through learning to integrate rather than transcend instinctual wisdom.",
      trine: "Spiritual inspiration and shadow integration flow together naturally. This creates natural mystical abilities and the capacity to access higher wisdom while remaining grounded in authentic, instinctual power.",
      opposition: "Spiritual transcendence faces shadow self and earthly authenticity. This creates awareness of spiritual bypassing and the need to integrate mystical insights with wild, instinctual wisdom rather than escape from it.",
      quincunx: "Spiritual inspiration requires ongoing adjustment to shadow aspects and authentic power. This develops the ability to maintain mystical connection while honoring wild, instinctual nature and earthy authenticity."
    },
    chiron: {
      conjunction: "Spiritual transcendence merges with wounded healer energy. This creates mystical healing through divine connection and compassionate service but may manifest as martyr complexes or spiritual healing delusions.",
      sextile: "Spiritual inspiration and healing wisdom support each other through conscious compassion development. This brings the ability to heal through spiritual connection when healing gifts are applied with mystical consciousness and divine guidance.",
      square: "Spiritual idealism conflicts with wounded patterns and healing work, creating confusion between transcendence and therapeutic reality. This develops authentic spiritual healing through learning to ground mystical insights in practical therapeutic work.",
      trine: "Spiritual inspiration and healing wisdom flow together naturally. This creates natural ability to heal through divine connection and help others access spiritual healing while maintaining grounded therapeutic approaches.",
      opposition: "Spiritual transcendence faces wounded healer role and earthly healing responsibility. This creates awareness of spiritual bypassing in healing work and the need to integrate mystical insights with practical therapeutic service.",
      quincunx: "Spiritual inspiration requires ongoing adjustment to healing work and therapeutic wounds. This develops the ability to maintain divine connection while serving grounded healing needs and integrating mystical insights with practical therapy."
    },
    northnode: {
      conjunction: "Spiritual transcendence aligns with soul purpose and karmic destiny. This creates personalities whose mystical consciousness and divine connection naturally serve spiritual evolution and compassionate service to collective healing.",
      sextile: "Spiritual inspiration and soul purpose support each other through conscious divine alignment. This brings opportunities to fulfill life mission through mystical service when spiritual gifts are actively applied to collective healing and evolution.",
      square: "Spiritual idealism conflicts with soul purpose, creating tension between mystical transcendence and karmic responsibility. This develops authentic spiritual service through learning to ground divine insights in practical evolutionary work.",
      trine: "Spiritual inspiration and soul purpose flow together harmoniously. This creates natural ability to fulfill karmic destiny through mystical service and divine connection that serves collective spiritual evolution without escapist transcendence.",
      opposition: "Spiritual transcendence faces karmic destiny and earthly evolutionary responsibility. This creates awareness of spiritual bypassing in mission work and the need to use divine connection to serve rather than escape soul evolution.",
      quincunx: "Spiritual inspiration requires ongoing adjustment to soul purpose and evolutionary requirements. This develops the ability to channel divine consciousness while serving practical spiritual evolution and collective healing responsibility."
    },
    southnode: {
      conjunction: "Spiritual transcendence draws on past-life knowledge of mystical consciousness and divine connection abilities. This creates natural spiritual talents but may manifest as repeating past patterns of spiritual escapism or mystical superiority.",
      sextile: "Spiritual inspiration and past mystical wisdom support each other when consciously balanced. This brings the ability to use natural divine connection while ensuring spiritual gifts serve current evolution rather than past escapism patterns.",
      square: "Spiritual idealism conflicts with over-reliance on past mystical patterns, creating challenges around spiritual evolution versus familiar transcendence dynamics. This develops authentic spirituality through using past divine gifts for current grounded service.",
      trine: "Spiritual inspiration and past mystical patterns flow together effortlessly. This creates natural divine connection and comfortable spiritual consciousness, though conscious effort is needed to ensure mystical talents serve current practical evolution.",
      opposition: "Spiritual transcendence faces past-life mystical comfort and familiar divine connection patterns. This creates awareness of how natural spiritual abilities may need to serve evolution rather than repeat familiar escapism dynamics or mystical superiority.",
      quincunx: "Spiritual inspiration requires ongoing adjustment between past mystical patterns and current evolutionary needs. This develops the ability to use divine gifts in service of grounded spiritual growth rather than escapist transcendence or spiritual stagnation."
    },
    partoffortune: {
      conjunction: "Spiritual transcendence aligns with joy and material prosperity. This creates personalities whose authentic mystical consciousness and divine connection naturally attract success and happiness through spiritual expression and compassionate service.",
      sextile: "Spiritual inspiration and prosperity support each other through conscious divine alignment. This brings opportunities for success and joy when authentic mystical consciousness and spiritual gifts are actively expressed and applied to service.",
      square: "Spiritual needs conflict with prosperity requirements, creating tension between authentic divine connection and material success. This develops true prosperity through learning to find joy in genuine spiritual service and mystical authenticity.",
      trine: "Spiritual inspiration and prosperity flow together naturally. This creates natural magnetism for success and happiness through authentic divine connection, mystical service, and spirituality-centered approaches to material abundance through compassionate work.",
      opposition: "Spiritual authenticity faces external prosperity and material expectations. This creates awareness of the balance between genuine mystical expression and social expectations for spirituality, divine connection, and success through transcendent service.",
      quincunx: "Spiritual inspiration requires ongoing adjustment to changing prosperity needs and material circumstances. This develops flexible divine connection that maintains authentic mystical consciousness while adapting to external requirements for success and spiritual achievement."
    }
  },

  // PLUTO ASPECTS TO CELESTIAL POINTS
  pluto: {
    lilith: {
      conjunction: "Transformative power merges with shadow self and wild feminine power. This creates explosive psychological transformation through authentic power but may manifest as destructive shadow eruptions or obsessive power struggles.",
      sextile: "Transformative power and shadow integration support each other through conscious empowerment. This brings the ability to transform through embracing authentic power when psychological work actively includes shadow integration and instinctual wisdom.",
      square: "Transformative pressure conflicts with shadow aspects and wild instincts, creating intense tension between control and authentic power. This develops genuine transformation through learning to channel rather than control instinctual and shadow forces.",
      trine: "Transformative power and shadow integration flow together naturally. This creates natural ability to transform through authentic power and integrate wild instincts without destructive shadow eruptions or manipulative control dynamics.",
      opposition: "Transformative control faces shadow self and suppressed authentic power. This creates awareness of psychological power struggles and the need to integrate deep transformation with wild, instinctual wisdom rather than control it.",
      quincunx: "Transformative power requires ongoing adjustment to shadow aspects and authentic power. This develops the ability to facilitate deep psychological transformation while honoring wild, instinctual nature and shadow integration without destructive power dynamics."
    },
    chiron: {
      conjunction: "Transformative power merges with wounded healer energy. This creates profound healing through psychological transformation and regenerative therapy but may manifest as healing through crisis or transformative therapeutic intensity.",
      sextile: "Transformative power and healing wisdom support each other through conscious therapeutic evolution. This brings the ability to heal through deep transformation when healing gifts are applied with regenerative psychological insights.",
      square: "Transformative pressure conflicts with wounded patterns and healing work, creating intense challenges around therapeutic control and regenerative healing approaches. This develops authentic healing through learning to facilitate rather than control therapeutic transformation.",
      trine: "Transformative power and healing wisdom flow together naturally. This creates natural ability to heal through deep psychological transformation and help others access regenerative healing while maintaining therapeutic boundaries and healing integrity.",
      opposition: "Transformative control faces wounded healer role and therapeutic responsibility. This creates awareness of healing power dynamics and the need to use psychological depth to serve rather than control others' healing and therapeutic transformation.",
      quincunx: "Transformative power requires ongoing adjustment to healing work and therapeutic wounds. This develops the ability to maintain regenerative healing while serving others' therapeutic needs and integrating psychological transformation with healing service."
    },
    northnode: {
      conjunction: "Transformative power aligns with soul purpose and karmic destiny. This creates personalities whose deep psychological insights and regenerative abilities naturally serve evolutionary growth and transformative spiritual service.",
      sextile: "Transformative power and soul purpose support each other through conscious evolution. This brings opportunities to fulfill life mission through facilitating deep transformation when psychological insights are actively applied to spiritual growth.",
      square: "Transformative pressure conflicts with soul purpose, creating tension between psychological control and karmic evolution. This develops authentic spiritual power through learning to serve transformation rather than control evolutionary process.",
      trine: "Transformative power and soul purpose flow together harmoniously. This creates natural ability to fulfill karmic destiny through facilitating deep psychological transformation and regenerative spiritual service without manipulative control.",
      opposition: "Transformative control faces karmic destiny and evolutionary responsibility. This creates awareness of spiritual power dynamics and the need to use psychological depth to serve rather than control soul evolution and spiritual growth.",
      quincunx: "Transformative power requires ongoing adjustment to soul purpose and evolutionary requirements. This develops the ability to channel deep psychological transformation while serving spiritual growth and evolutionary responsibility."
    },
    southnode: {
      conjunction: "Transformative power draws on past-life knowledge of deep psychological work and regenerative abilities. This creates natural transformative talents but may manifest as repeating past patterns of psychological control or power struggles.",
      sextile: "Transformative power and past psychological wisdom support each other when consciously balanced. This brings the ability to use natural regenerative talents while ensuring they serve current evolution rather than past control patterns.",
      square: "Transformative pressure conflicts with over-reliance on past psychological patterns, creating challenges around spiritual evolution versus familiar power dynamics. This develops authentic transformation through using past regenerative gifts for current evolutionary service.",
      trine: "Transformative power and past psychological patterns flow together effortlessly. This creates natural regenerative abilities and comfortable psychological depth, though conscious effort is needed to ensure transformative talents serve current spiritual evolution.",
      opposition: "Transformative control faces past-life psychological comfort and familiar power patterns. This creates awareness of how natural regenerative abilities may need to serve evolution rather than repeat familiar control dynamics or power struggles.",
      quincunx: "Transformative power requires ongoing adjustment between past psychological patterns and current evolutionary needs. This develops the ability to use regenerative gifts in service of spiritual growth rather than psychological manipulation or control repetition."
    },
    partoffortune: {
      conjunction: "Transformative power aligns with joy and material prosperity. This creates personalities whose authentic psychological transformation and regenerative abilities naturally attract success and happiness through deep transformative work and empowerment.",
      sextile: "Transformative power and prosperity support each other through conscious regenerative alignment. This brings opportunities for success and joy when authentic psychological transformation and regenerative abilities are actively expressed and applied to service.",
      square: "Transformative needs conflict with prosperity requirements, creating tension between authentic psychological transformation and material success. This develops true prosperity through learning to find joy in genuine regenerative work and transformative authenticity.",
      trine: "Transformative power and prosperity flow together naturally. This creates natural magnetism for success and happiness through authentic psychological transformation, regenerative work, and empowerment-centered approaches to material achievement through deep service.",
      opposition: "Transformative authenticity faces external prosperity and material expectations. This creates awareness of the balance between genuine psychological transformation and social expectations for power, transformation, and success through regenerative control.",
      quincunx: "Transformative power requires ongoing adjustment to changing prosperity needs and material circumstances. This develops flexible regenerative abilities that maintain authentic psychological transformation while adapting to external requirements for success and transformative achievement."
    }
  },

  // CELESTIAL POINT TO CELESTIAL POINT ASPECTS
  // ===========================================

  // LILITH ASPECTS TO OTHER CELESTIAL POINTS
  lilith: {
    chiron: {
      conjunction: "Shadow self merges with wounded healer energy. This creates profound healing through embracing rejected aspects and wild nature, but may manifest as intense healing crises around authentic power and feminine expression.",
      sextile: "Shadow integration and healing wisdom support each other through conscious therapeutic work. This brings the ability to heal by embracing what has been rejected and help others integrate their shadow when inner work actively includes wild, instinctual nature.",
      square: "Shadow aspects conflict with wounded patterns and healing work, creating tension between authentic power and therapeutic responsibility. This develops deep healing through learning to integrate rather than suppress wild feminine wisdom and rejected aspects.",
      trine: "Shadow integration and healing wisdom flow together naturally. This creates natural ability to heal through embracing authentic power and help others integrate rejected aspects without destructive shadow eruptions or healing resistance.",
      opposition: "Shadow self faces wounded healer role and therapeutic service. This creates awareness of healing through shadow work and the need to integrate wild, instinctual wisdom with compassionate healing service to others.",
      quincunx: "Shadow integration requires ongoing adjustment to healing work and wounded patterns. This develops the ability to maintain authentic power while serving others' healing needs and integrating wild nature with therapeutic responsibility."
    },
    northnode: {
      conjunction: "Shadow self aligns with soul purpose and karmic destiny. This creates personalities whose wild, instinctual nature and authentic power naturally serve spiritual evolution through embracing what has been rejected by society.",
      sextile: "Shadow integration and soul purpose support each other through conscious authenticity development. This brings opportunities to fulfill life mission by embracing wild feminine power and authentic expression when inner work actively includes shadow acceptance.",
      square: "Shadow aspects conflict with soul purpose, creating tension between authentic power and karmic responsibility. This develops spiritual evolution through learning to integrate wild, instinctual wisdom with soul mission rather than suppress natural magnetism.",
      trine: "Shadow integration and soul purpose flow together harmoniously. This creates natural ability to fulfill karmic destiny through authentic power expression and wild feminine wisdom without sacrificing spiritual evolution for social acceptance.",
      opposition: "Shadow self faces karmic destiny and evolutionary responsibility. This creates awareness of how embracing rejected aspects serves soul growth and the need to integrate wild nature with spiritual mission and evolutionary purpose.",
      quincunx: "Shadow integration requires ongoing adjustment to soul purpose and karmic requirements. This develops the ability to honor wild, instinctual nature while serving spiritual evolution and integrating authentic power with evolutionary responsibility."
    },
    southnode: {
      conjunction: "Shadow self draws on past-life knowledge of wild feminine power and rejected aspects. This creates natural magnetism and authentic power but may manifest as repeating past patterns of rebellion or rejection by society.",
      sextile: "Shadow integration and past wisdom support each other when consciously balanced. This brings the ability to use natural wild power while ensuring authentic expression serves current growth rather than past rejection patterns.",
      square: "Shadow aspects conflict with over-reliance on past power patterns, creating challenges around spiritual evolution versus familiar rebellion dynamics. This develops authentic power through using wild nature for current growth rather than repeating rejection cycles.",
      trine: "Shadow integration and past power patterns flow together effortlessly. This creates natural wild feminine power and comfortable authentic expression, though conscious effort is needed to ensure shadow work serves current spiritual evolution.",
      opposition: "Shadow self faces past-life power comfort and familiar rejection patterns. This creates awareness of how natural magnetism may need to serve growth rather than repeat familiar rebellion dynamics or outsider status superiority.",
      quincunx: "Shadow integration requires ongoing adjustment between past power patterns and current growth needs. This develops the ability to use wild feminine wisdom in service of evolution rather than rebellious stagnation or rejection repetition."
    },
    partoffortune: {
      conjunction: "Shadow self aligns with joy and material prosperity. This creates personalities whose authentic wild power and embraced rejected aspects naturally attract success and happiness through instinctual magnetism and shadow integration.",
      sextile: "Shadow integration and prosperity support each other through conscious authenticity alignment. This brings opportunities for success and joy when wild feminine power and authentic expression are actively embraced and celebrated rather than suppressed.",
      square: "Shadow aspects conflict with prosperity requirements, creating tension between authentic power and material success. This develops true prosperity through learning to find joy in wild feminine wisdom and success through embracing rather than hiding rejected aspects.",
      trine: "Shadow integration and prosperity flow together naturally. This creates natural magnetism for success and happiness through authentic wild power, instinctual wisdom, and prosperity-centered approaches to shadow work and feminine expression.",
      opposition: "Shadow authenticity faces external prosperity and material expectations. This creates awareness of the balance between wild power expression and social expectations for success, developing prosperity through authentic magnetism rather than suppressed nature.",
      quincunx: "Shadow integration requires ongoing adjustment to changing prosperity needs and material circumstances. This develops flexible authentic expression that maintains wild feminine power while adapting to external requirements for success through embraced instinctual wisdom."
    }
  },

  // CHIRON ASPECTS TO OTHER CELESTIAL POINTS
  chiron: {
    northnode: {
      conjunction: "Wounded healer energy aligns with soul purpose and karmic destiny. This creates personalities whose healing abilities and therapeutic wisdom naturally serve spiritual evolution through processing pain and facilitating transformation for others.",
      sextile: "Healing wisdom and soul purpose support each other through conscious therapeutic development. This brings opportunities to fulfill life mission through healing service and helping others process wounds when healing gifts are actively cultivated for evolutionary service.",
      square: "Wounded patterns conflict with soul purpose, creating tension between healing work and karmic responsibility. This develops authentic spiritual service through learning to heal self while serving others' evolution and integrating therapeutic wisdom with soul mission.",
      trine: "Healing wisdom and soul purpose flow together harmoniously. This creates natural ability to fulfill karmic destiny through compassionate healing service and therapeutic work that facilitates spiritual evolution for self and others without therapeutic burnout.",
      opposition: "Wounded healer role faces karmic destiny and evolutionary responsibility. This creates awareness of how healing work serves soul growth and the need to integrate therapeutic service with personal spiritual evolution and karmic mission fulfillment.",
      quincunx: "Healing wisdom requires ongoing adjustment to soul purpose and karmic requirements. This develops the ability to maintain therapeutic effectiveness while serving spiritual evolution and integrating healing gifts with evolutionary responsibility and personal growth."
    },
    southnode: {
      conjunction: "Wounded healer energy draws on past-life knowledge of therapeutic work and healing abilities. This creates natural healing talents and wisdom but may manifest as repeating past patterns of martyrdom or healing without proper boundaries.",
      sextile: "Healing wisdom and past therapeutic patterns support each other when consciously balanced. This brings the ability to use natural healing gifts while ensuring therapeutic work serves current growth rather than past martyrdom or boundary-less service patterns.",
      square: "Wounded patterns conflict with over-reliance on past healing approaches, creating challenges around spiritual evolution versus familiar therapeutic dynamics. This develops authentic healing through using past gifts for current growth rather than repeating savior complexes.",
      trine: "Healing wisdom and past therapeutic patterns flow together effortlessly. This creates natural healing abilities and comfortable therapeutic service, though conscious effort is needed to ensure healing work serves current spiritual evolution rather than past martyr patterns.",
      opposition: "Wounded healer role faces past-life therapeutic comfort and familiar healing patterns. This creates awareness of how natural healing abilities may need to serve growth rather than repeat familiar martyrdom dynamics or therapeutic superiority without proper self-care.",
      quincunx: "Healing wisdom requires ongoing adjustment between past therapeutic patterns and current growth needs. This develops the ability to use healing gifts in service of evolution rather than martyrdom repetition or boundary-less service that depletes personal resources."
    },
    partoffortune: {
      conjunction: "Wounded healer energy aligns with joy and material prosperity. This creates personalities whose healing abilities and therapeutic wisdom naturally attract success and happiness through compassionate service and facilitating transformation that brings both healing and abundance.",
      sextile: "Healing wisdom and prosperity support each other through conscious therapeutic alignment. This brings opportunities for success and joy when healing gifts and therapeutic service are actively expressed and developed in ways that create both transformation and material abundance.",
      square: "Wounded patterns conflict with prosperity requirements, creating tension between healing service and material success. This develops true prosperity through learning to find joy in therapeutic work and creating abundance through compassionate healing rather than martyrdom or poverty consciousness.",
      trine: "Healing wisdom and prosperity flow together naturally. This creates natural magnetism for success and happiness through authentic therapeutic service, compassionate healing, and prosperity-centered approaches to facilitating transformation that honors both service and self-worth.",
      opposition: "Healing authenticity faces external prosperity and material expectations. This creates awareness of the balance between therapeutic service and financial self-worth, developing prosperity through healing work that honors both compassionate service and appropriate material compensation.",
      quincunx: "Healing wisdom requires ongoing adjustment to changing prosperity needs and material circumstances. This develops flexible therapeutic service that maintains authentic healing abilities while adapting to external requirements for success and creating abundance through compassionate work."
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
    }
  },

  // SOUTH NODE ASPECTS TO OTHER CELESTIAL POINTS
  southnode: {
    partoffortune: {
      conjunction: "Past-life patterns align with joy and material prosperity. This creates personalities whose familiar talents and comfortable abilities naturally attract success and happiness, though conscious effort is needed to ensure prosperity serves current spiritual growth rather than stagnation.",
      sextile: "Past wisdom and prosperity support each other through conscious balance of comfort and growth. This brings opportunities for success and joy when natural talents are actively used in service of current evolution rather than spiritual avoidance through familiar patterns that prevent growth.",
      square: "Comfortable patterns conflict with prosperity requirements, creating tension between familiar talents and material success through growth. This develops authentic abundance through learning to use past gifts for current evolution rather than prosperity through spiritual stagnation or comfort-seeking that limits potential.",
      trine: "Past patterns and prosperity flow together effortlessly. This creates natural magnetism for success through comfortable talents and familiar abilities, though conscious effort is needed to ensure material abundance serves spiritual evolution rather than reinforcing stagnant patterns or comfort addiction.",
      opposition: "Past-life comfort faces soul-aligned prosperity and evolutionary abundance. This creates awareness of how material success may need to serve spiritual growth rather than reinforce comfortable patterns, developing prosperity through using familiar talents in service of evolution and karmic mission.",
      quincunx: "Past patterns require ongoing adjustment to prosperity needs and material circumstances. This develops flexible use of natural talents that honors familiar abilities while ensuring success serves current spiritual evolution rather than comfortable stagnation or past-pattern repetition that limits growth potential."
    }
  }
};