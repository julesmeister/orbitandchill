/* eslint-disable @typescript-eslint/no-unused-vars */

// Traditional planetary aspect interpretations (Sun through Pluto)
// These are the classical astrological combinations between the main planets

export const planetaryAspectCombinations: Record<
  string,
  Record<string, Record<string, string>>
> = {
  sun: {
    moon: {
      conjunction: "The conscious will and unconscious instincts merge, creating a focused but potentially one-sided personality. This aspect brings internal unity but may lack the creative tension needed for growth and self-awareness.",
      sextile: "The conscious and unconscious minds work together harmoniously when effort is applied. This creates emotional stability and the ability to integrate different aspects of personality with some conscious work.",
      square: "Internal conflict between conscious will and emotional needs creates dynamic tension. This aspect demands integration of opposing inner forces and can lead to powerful self-awareness through resolving internal contradictions.",
      trine: "Conscious will and unconscious instincts flow together effortlessly. This creates natural self-confidence and emotional stability, though it may lack the motivation for deep personal growth.",
      opposition: "Conscious will and unconscious needs pull in opposite directions. This creates awareness of internal contradictions and the need to balance rational thinking with emotional wisdom.",
      quincunx: "Conscious will and emotional needs operate at awkward angles requiring constant adjustment. This creates a need to continuously adapt self-expression to changing emotional circumstances."
    },
    mercury: {
      conjunction: "The mind and identity fuse, creating strong intellectual confidence and clear self-expression. However, this can lead to mental subjectivity where it's difficult to see beyond one's own perspective.",
      sextile: "Mental abilities and self-expression support each other through active engagement. This aspect brings clear communication skills and the ability to articulate personal vision when cultivated.",
      square: "Mental expression and personal identity clash, creating communication challenges. This tension can develop into strong analytical abilities and unique perspectives once the conflicting energies are balanced.",
      trine: "Mind and identity work in perfect harmony, creating natural communication abilities. This aspect brings intellectual confidence and clear self-expression without internal mental conflicts.",
      opposition: "Identity and mental expression operate at cross-purposes. This aspect creates objectivity about oneself and the ability to see multiple perspectives once the opposition is integrated.",
      quincunx: "Identity and thinking patterns require ongoing adjustment and adaptation. This creates the need to continuously modify how feelings are expressed and understood mentally."
    },
    venus: {
      conjunction: "Personal magnetism and creative self-expression flow naturally, bringing charm and artistic abilities. This aspect can create vanity or over-identification with beauty and pleasure-seeking behaviors.",
      sextile: "Personal charm and creative abilities can be developed through conscious effort. This brings social grace and artistic talents that flourish when actively pursued.",
      square: "Personal values and self-expression conflict, creating relationship and creative tensions. This aspect challenges one to develop authentic self-worth and genuine artistic expression beyond superficial appearances.",
      trine: "Personal magnetism and creative expression flow together naturally. This creates charm, artistic ability, and ease in relationships, though it may lead to taking these gifts for granted.",
      opposition: "Personal values and self-expression exist in tension with others' expectations. This creates awareness of relationship dynamics and the need to balance personal desires with social harmony.",
      quincunx: "Personal values and self-expression require constant adjustment to aesthetic values and relationship harmony. This develops flexibility in emotional expression and adaptability in love relationships."
    },
    mars: {
      conjunction: "Willpower and action unite to create dynamic leadership and strong initiative. This combination can manifest as aggression or impatience when the energies aren't channeled constructively.",
      sextile: "Willpower and action support each other when properly directed. This creates leadership potential and the ability to assert oneself constructively through focused effort.",
      square: "Will and action create friction, leading to impatience and potential conflict. This dynamic tension can be channeled into extraordinary achievement and leadership once the competitive energies are properly directed.",
      trine: "Will and action unite smoothly, creating natural leadership and initiative. This aspect brings courage and the ability to assert oneself without aggression or internal conflict.",
      opposition: "Will and action exist in polarized tension, creating internal or external conflicts. This aspect develops diplomatic skills and the ability to balance assertion with cooperation.",
      quincunx: "Will and action require continuous recalibration and strategic adjustment. This develops tactical thinking and the ability to modify approach based on changing circumstances."
    },
    jupiter: {
      conjunction: "Confidence and expansion merge to create natural optimism and leadership abilities. This aspect can lead to overconfidence, exaggeration, or taking on more than one can handle.",
      sextile: "Confidence and expansion work together when opportunities are actively pursued. This brings optimism and growth potential that manifest through taking appropriate risks.",
      square: "Confidence and expansion create overextension and unrealistic expectations. This challenging aspect teaches proper judgment and realistic goal-setting through experiencing the consequences of overreach.",
      trine: "Confidence and expansion flow together, creating natural optimism and good fortune. This brings success and growth opportunities, though it may create overconfidence or lack of appreciation for blessings.",
      opposition: "Personal confidence conflicts with excessive expansion or moral certainty. This creates awareness of the need to balance optimism with realism and personal beliefs with others' perspectives.",
      quincunx: "Personal confidence needs ongoing adjustment to avoid overextension or unrealistic expectations. This creates the ability to adapt beliefs and goals based on practical experience."
    },
    saturn: {
      conjunction: "Identity formation occurs through discipline, responsibility, and facing limitations. This creates serious, methodical personalities but can manifest as pessimism or fear of self-expression.",
      sextile: "Personal discipline and structure support identity development through consistent effort. This creates the ability to build lasting achievements and develop authentic authority over time.",
      square: "Self-expression meets restriction and limitation, creating internal authority conflicts. This aspect builds character through overcoming obstacles and learning to balance freedom with responsibility.",
      trine: "Personal authority and discipline work together harmoniously. This creates natural leadership abilities and the capacity for sustained achievement through methodical effort.",
      opposition: "Self-expression meets external limitations and authority conflicts. This develops maturity through learning to balance personal freedom with social responsibility and commitment.",
      quincunx: "Self-expression requires constant adjustment to limitations and responsibilities. This develops the ability to find creative ways to express authenticity within restrictive circumstances."
    },
    uranus: {
      conjunction: "Individual expression seeks freedom and originality, creating innovative and rebellious personalities. This aspect can lead to erratic behavior or difficulty with consistent self-expression.",
      sextile: "Individual expression and innovation support each other through conscious experimentation. This brings originality and progressive thinking that can be channeled into creative breakthroughs.",
      square: "Individual expression conflicts with need for freedom and change. This creates unpredictable behavior and identity crises that ultimately lead to authentic self-discovery and innovation.",
      trine: "Individual expression and innovation flow together naturally. This brings originality and progressive thinking without the disruption often associated with Uranian energy.",
      opposition: "Individual expression conflicts with need for complete freedom or rebellion. This creates awareness of the tension between personal authenticity and social acceptance or stability.",
      quincunx: "Individual expression needs ongoing adaptation to changing need for freedom or innovation. This creates flexibility in self-expression and the ability to reinvent oneself as circumstances require."
    },
    neptune: {
      conjunction: "The ego seeks transcendence through imagination, spirituality, or creative expression. This can create confusion about identity or tendency toward escapism and unrealistic self-perception.",
      sextile: "Ego and intuition work together when spiritual or creative practices are cultivated. This enhances imagination and compassion that can be developed through artistic or service-oriented pursuits.",
      square: "Ego clarity conflicts with spiritual dissolution and confusion. This challenging aspect can create identity issues but ultimately develops discernment between illusion and higher truth.",
      trine: "Ego and intuition work in harmony, creating natural spiritual or artistic gifts. This aspect enhances imagination and compassion without the confusion typically associated with Neptune.",
      opposition: "Clear ego identity conflicts with dissolution and spiritual surrender. This aspect develops discernment between healthy spirituality and escapism while integrating ego and transcendence.",
      quincunx: "Ego clarity requires constant adjustment to spiritual or imaginative influences. This develops the ability to adapt personal identity to serve higher purposes or creative inspiration."
    },
    pluto: {
      conjunction: "Personal will merges with transformative power, creating intense, magnetic personalities. This aspect can manifest as controlling behavior or compulsive need to transform oneself and others.",
      sextile: "Personal will and transformative power support each other through conscious inner work. This creates the ability to reinvent oneself and influence others positively when the energy is actively developed.",
      square: "Personal will clashes with transformative power, creating intense internal struggles. This aspect generates tremendous personal power through learning to transform rather than control oneself and others.",
      trine: "Personal will and transformative power flow together smoothly. This creates natural magnetism and the ability to influence others positively without manipulation or power struggles.",
      opposition: "Personal will faces intense transformative pressure from others or circumstances. This creates awareness of power dynamics and the need to balance personal control with surrender to deeper forces.",
      quincunx: "Personal will needs ongoing adjustment to transformative pressures and power dynamics. This creates the ability to adapt and evolve personal power in response to changing circumstances."
    }
  },
  moon: {
    mercury: {
      conjunction: "Emotions and thoughts merge, creating intuitive thinking and empathetic communication. This aspect can lead to emotional thinking where feelings cloud rational judgment.",
      sextile: "Emotions and thoughts support each other when consciously developed. This creates the ability to communicate feelings clearly and think with emotional intelligence.",
      square: "Emotions and rational thinking create internal conflict and communication challenges. This aspect develops emotional intelligence through learning to balance feelings with logical analysis.",
      trine: "Emotions and thoughts flow together harmoniously, creating natural empathy and intuitive communication. This aspect brings emotional intelligence and the ability to articulate feelings clearly.",
      opposition: "Emotions and rational thinking exist in polarized tension. This creates objectivity about feelings and the ability to balance emotional expression with logical analysis.",
      quincunx: "Emotions and thinking require ongoing adjustment and adaptation. This creates the need to continuously modify how feelings are expressed and understood mentally."
    },
    venus: {
      conjunction: "Emotional needs and aesthetic values unite, creating natural charm and artistic sensitivity. This combination can manifest as emotional dependency on beauty, comfort, or others' approval.",
      sextile: "Emotional needs and aesthetic appreciation work together harmoniously. This brings natural grace, artistic ability, and the capacity for loving relationships when cultivated.",
      square: "Emotional needs conflict with social values and relationship expectations. This creates tension between personal feelings and the desire for harmony that teaches authentic emotional expression.",
      trine: "Emotional needs and aesthetic values work in perfect harmony. This creates natural charm, artistic sensitivity, and the ability to create beauty and comfort effortlessly.",
      opposition: "Personal emotional needs conflict with social harmony and others' values. This develops awareness of relationship dynamics and the need to balance personal feelings with social expectations.",
      quincunx: "Emotional needs require constant adjustment to aesthetic values and relationship harmony. This develops flexibility in emotional expression and adaptability in love relationships."
    },
    mars: {
      conjunction: "Instincts and action fuse, creating quick emotional responses and protective instincts. This aspect can lead to mood swings, emotional outbursts, or impulsive reactions to perceived threats.",
      sextile: "Instincts and action support each other through conscious effort. This creates protective abilities and emotional courage that can be developed through active engagement.",
      square: "Instincts and aggressive impulses create emotional volatility and reactive patterns. This challenging aspect develops emotional courage and the ability to channel protective instincts constructively.",
      trine: "Instincts and action flow together smoothly, creating emotional courage and protective abilities. This aspect brings natural ability to act on feelings and defend emotional boundaries.",
      opposition: "Emotional instincts oppose aggressive or assertive impulses. This creates tension between receptivity and action that develops diplomatic skills and emotional strategy.",
      quincunx: "Emotional instincts need ongoing adjustment to action and assertiveness. This creates the ability to modify emotional responses based on situational demands for action."
    },
    jupiter: {
      conjunction: "Emotional expression expands naturally, creating generous and optimistic feelings. This can manifest as emotional excess, overeating, or unrealistic emotional expectations.",
      sextile: "Emotional expansion and optimism support each other when opportunities are embraced. This brings emotional generosity and faith that grow through positive experiences.",
      square: "Emotional expression conflicts with excessive optimism or moral expectations. This teaches emotional moderation and the ability to balance feelings with realistic perspectives.",
      trine: "Emotional expression and expansion work together naturally. This creates emotional generosity, optimism, and the ability to find meaning in feelings and experiences.",
      opposition: "Emotional expression conflicts with excessive optimism or philosophical beliefs. This develops the ability to balance feelings with broader perspectives and realistic expectations.",
      quincunx: "Emotional expression requires adjustment to expansion and optimistic expectations. This develops the ability to adapt feelings to changing philosophical or cultural perspectives."
    },
    saturn: {
      conjunction: "Emotional security seeks structure and control, creating serious and responsible feelings. This aspect can manifest as emotional restriction, depression, or fear of vulnerability.",
      sextile: "Emotional security and structure work together through disciplined effort. This creates emotional stability and the ability to build lasting foundations for feelings.",
      square: "Emotional needs clash with restrictions and fears, creating depression or emotional blocks. This aspect builds emotional resilience through learning to process difficult feelings without suppression.",
      trine: "Emotional security and structure support each other effortlessly. This brings emotional stability, patience, and the ability to build lasting emotional foundations.",
      opposition: "Emotional needs face restrictions, limitations, or authoritarian pressure. This creates awareness of the balance between emotional expression and social responsibility or maturity.",
      quincunx: "Emotional needs require ongoing adaptation to limitations and responsibilities. This creates flexibility in emotional expression within restrictive or demanding circumstances."
    },
    uranus: {
      conjunction: "Emotional needs seek freedom and excitement, creating unpredictable moods and innovative intuition. This can lead to emotional instability or difficulty forming consistent emotional attachments.",
      sextile: "Emotional innovation and intuitive insights support each other when explored. This brings emotional originality and psychic abilities that can be developed through experimentation.",
      square: "Emotional security conflicts with need for freedom and change. This creates emotional instability that ultimately develops emotional independence and innovative intuitive abilities.",
      trine: "Emotional innovation and intuitive insights flow together naturally. This creates original emotional expression and natural psychic abilities without disrupting emotional security.",
      opposition: "Emotional security conflicts with need for freedom and revolutionary change. This develops awareness of the tension between emotional stability and personal independence.",
      quincunx: "Emotional security needs constant adjustment to changing need for freedom. This develops emotional adaptability and the ability to modify attachment patterns as circumstances change."
    },
    neptune: {
      conjunction: "Emotions seek transcendence through imagination or spirituality, creating psychic sensitivity. This aspect can create emotional confusion, escapism, or boundary issues with others.",
      sextile: "Emotions and spiritual sensitivity enhance each other through conscious development. This creates compassion and imagination that can be channeled into healing or artistic pursuits.",
      square: "Emotional clarity conflicts with confusion, illusion, or escapist tendencies. This challenging aspect develops emotional discernment and the ability to distinguish between intuition and wishful thinking.",
      trine: "Emotions and spiritual sensitivity enhance each other harmoniously. This brings natural compassion, imagination, and psychic abilities that feel comfortable and accessible.",
      opposition: "Emotional clarity faces dissolution, confusion, or spiritual surrender. This creates awareness of boundaries between self and others while developing spiritual sensitivity.",
      quincunx: "Emotional clarity requires ongoing adjustment to spiritual or imaginative influences. This creates the ability to adapt emotional expression to serve higher purposes or creative inspiration."
    },
    pluto: {
      conjunction: "Emotional depths merge with transformative power, creating intense and magnetic emotional expression. This can manifest as emotional manipulation, obsessive feelings, or compulsive emotional patterns.",
      sextile: "Emotional depths and transformative power work together through inner exploration. This brings psychological insight and healing abilities that develop through conscious emotional work.",
      square: "Emotional expression conflicts with deep psychological pressures and power struggles. This intense aspect transforms emotional patterns through facing the shadow side of feelings.",
      trine: "Emotional depths and transformative power work together smoothly. This creates natural psychological insight and the ability to process deep emotions without being overwhelmed.",
      opposition: "Emotional expression faces intense transformative pressure and power dynamics. This develops awareness of emotional manipulation and the need to balance emotional expression with psychological depth.",
      quincunx: "Emotional patterns need continuous adjustment to transformative pressures. This develops the ability to adapt emotional responses to deep psychological changes and power dynamics."
    }
  },
  mercury: {
    venus: {
      conjunction: "Mind and aesthetic values merge, creating harmonious and attractive communication. This aspect can lead to intellectual vanity or thinking that prioritizes beauty over truth.",
      sextile: "Mental abilities and aesthetic appreciation support each other through conscious effort. This creates the ability to think beautifully and communicate with charm when actively developed.",
      square: "Mental analysis conflicts with aesthetic values and social harmony. This aspect develops critical thinking skills through learning to balance intellectual honesty with diplomatic communication.",
      trine: "Thinking and aesthetic appreciation flow together harmoniously. This creates natural ability to think beautifully and communicate with grace and charm.",
      opposition: "Analytical thinking faces aesthetic values and social expectations. This creates objectivity about personal values and the ability to balance intellectual honesty with social harmony.",
      quincunx: "Thinking patterns require ongoing adjustment to aesthetic values and social harmony. This develops flexible communication and the ability to adapt mental expression to different social situations."
    },
    mars: {
      conjunction: "Thinking and action unite, creating sharp, direct communication and quick mental responses. This combination can manifest as argumentative thinking or mental aggression.",
      sextile: "Thinking and decisive action work together when properly directed. This brings mental courage and the ability to think strategically under pressure.",
      square: "Thinking clashes with impulsive action, creating mental conflicts and argumentative tendencies. This develops strategic thinking through learning to balance mental analysis with decisive action.",
      trine: "Mental processes and decisive action work together effortlessly. This brings quick thinking, mental courage, and the ability to communicate with confidence and directness.",
      opposition: "Mental analysis conflicts with impulsive action and aggressive communication. This develops diplomatic thinking and the ability to balance mental consideration with decisive action.",
      quincunx: "Mental processes need constant adjustment to action-oriented demands. This creates tactical thinking and the ability to modify mental approach based on situational requirements for quick action."
    },
    jupiter: {
      conjunction: "Mind and expansion fuse, creating broad thinking and philosophical communication. This aspect can lead to mental overconfidence or tendency toward exaggeration in thinking.",
      sextile: "Mental expansion and optimistic thinking support each other when opportunities are pursued. This creates philosophical thinking and the ability to see big-picture connections.",
      square: "Detailed thinking conflicts with broad generalizations and optimistic assumptions. This teaches intellectual humility through learning to balance specific facts with philosophical perspectives.",
      trine: "Detailed thinking and broad perspectives complement each other naturally. This creates philosophical intelligence and the ability to see both specific facts and universal principles.",
      opposition: "Detailed thinking faces broad generalizations and philosophical beliefs. This creates intellectual objectivity and the ability to balance specific analysis with universal perspectives.",
      quincunx: "Detailed thinking requires ongoing adaptation to expansive or philosophical perspectives. This develops the ability to adjust mental focus between specific facts and broad generalizations as needed."
    },
    saturn: {
      conjunction: "Thinking becomes structured and disciplined, creating methodical mental processes. This can manifest as mental rigidity or pessimistic thinking patterns.",
      sextile: "Disciplined thinking and mental structure work together through consistent effort. This builds practical intelligence and the ability to think methodically about complex problems.",
      square: "Mental flexibility conflicts with rigid thinking and fear of mental mistakes. This develops intellectual discipline through overcoming mental blocks and self-criticism.",
      trine: "Mental discipline and structured thinking support each other smoothly. This brings practical intelligence, methodical thinking, and the ability to concentrate for extended periods.",
      opposition: "Mental flexibility faces rigid thinking and authoritarian mental structures. This develops intellectual independence through learning to balance open thinking with disciplined analysis.",
      quincunx: "Mental flexibility needs continuous adjustment to structural limitations and responsibilities. This creates practical adaptability and the ability to think creatively within restrictive circumstances."
    },
    uranus: {
      conjunction: "Mind and innovation merge, creating original thinking and breakthrough insights. This aspect can lead to scattered thinking or difficulty with mental consistency.",
      sextile: "Original thinking and innovative insights support each other when actively explored. This brings breakthrough thinking and the ability to solve problems creatively.",
      square: "Logical thinking conflicts with innovative insights and mental rebellion. This creates intellectual breakthroughs through learning to integrate conventional and revolutionary thinking.",
      trine: "Logical thinking and innovative insights enhance each other naturally. This creates original thinking abilities and natural capacity for breakthrough insights without mental instability.",
      opposition: "Conventional thinking faces innovative insights and mental rebellion. This creates intellectual versatility and the ability to balance traditional and revolutionary thinking approaches.",
      quincunx: "Conventional thinking requires ongoing adjustment to innovative insights and changing perspectives. This develops mental agility and the ability to adapt thinking patterns to new information."
    },
    neptune: {
      conjunction: "Thinking blends with imagination, creating intuitive and inspired mental processes. This can manifest as confused thinking or difficulty distinguishing facts from fantasy.",
      sextile: "Rational thinking and intuitive insights enhance each other through conscious development. This creates inspired thinking and the ability to communicate spiritual or artistic concepts.",
      square: "Clear thinking conflicts with imagination, confusion, or deceptive information. This develops mental discernment through learning to distinguish between facts and illusions.",
      trine: "Rational thinking and intuitive insights work together harmoniously. This brings inspired thinking, psychic abilities, and natural capacity to understand abstract or spiritual concepts.",
      opposition: "Clear analytical thinking faces confusion, imagination, or deceptive information. This develops mental discernment and the ability to balance rational analysis with intuitive understanding.",
      quincunx: "Clear thinking needs constant adjustment to imaginative or spiritual influences. This creates the ability to adapt rational analysis to serve intuitive insights and creative inspiration."
    },
    pluto: {
      conjunction: "Mind merges with deep psychological insight, creating penetrating and transformative thinking. This aspect can lead to obsessive thinking or mental manipulation of others.",
      sextile: "Analytical thinking and psychological depth work together through conscious exploration. This brings investigative abilities and the capacity for transformative insights.",
      square: "Surface thinking conflicts with deep psychological insights and mental intensity. This transforms thinking patterns through confronting uncomfortable truths and mental obsessions.",
      trine: "Analytical thinking and psychological depth complement each other effortlessly. This creates natural investigative abilities and capacity for profound insights without mental obsession.",
      opposition: "Surface thinking faces deep psychological insights and mental transformation. This creates awareness of hidden mental patterns and the need to balance light conversation with profound communication.",
      quincunx: "Surface thinking requires ongoing adjustment to deep psychological insights. This develops the ability to modify communication depth based on others' capacity for psychological truth."
    }
  },
  venus: {
    mars: {
      conjunction: "Love and desire merge, creating passionate and attractive energy. This aspect can manifest as sexual compulsiveness or difficulty separating love from physical attraction.",
      sextile: "Love and desire support each other when consciously balanced. This creates the ability to integrate romantic feelings with healthy sexuality through active relationship work.",
      square: "Love and desire create tension between romantic ideals and sexual needs. This aspect develops mature love through learning to integrate tender affection with passionate physical expression.",
      trine: "Love and desire flow together harmoniously, creating natural romantic and sexual magnetism. This aspect brings ease in balancing tender affection with passionate physical expression.",
      opposition: "Romantic values face aggressive or sexual demands. This creates awareness of the balance between giving and receiving in love and the need to integrate tender and passionate expressions.",
      quincunx: "Romantic expression requires ongoing adjustment to sexual or aggressive energies. This develops flexible approaches to love and the ability to adapt affectionate expression to partners' different needs."
    },
    jupiter: {
      conjunction: "Love and expansion unite, creating generous and optimistic affection. This combination can lead to excessive indulgence or unrealistic expectations in relationships.",
      sextile: "Affection and expansion work together when opportunities for love are pursued. This brings generous love and the ability to find joy in relationships through optimistic engagement.",
      square: "Romantic values conflict with excessive indulgence or unrealistic expectations. This teaches relationship moderation through experiencing the consequences of over-idealizing love or partners.",
      trine: "Affection and expansion complement each other naturally. This creates generous, optimistic love and natural ability to find joy and meaning in relationships.",
      opposition: "Personal romantic values conflict with excessive expectations or moral judgments. This develops relationship wisdom through balancing personal desires with broader perspectives on love and partnership.",
      quincunx: "Love values need constant adjustment to changing beliefs or excessive expectations. This creates adaptability in relationships and the ability to modify romantic expression based on spiritual growth."
    },
    saturn: {
      conjunction: "Love seeks security and commitment, creating serious and lasting affections. This aspect can manifest as fear of love or tendency to restrict affectionate expression.",
      sextile: "Love and commitment support each other through dedicated effort. This creates the ability to build lasting relationships and develop mature love through patience and loyalty.",
      square: "Love needs conflict with fear, restriction, or commitment issues. This builds capacity for lasting love through overcoming emotional blocks and learning to balance freedom with dedication.",
      trine: "Love and commitment work together effortlessly. This brings natural ability to create lasting relationships and express mature, reliable affection without sacrificing romantic feelings.",
      opposition: "Love and affection face restrictions, fears, or commitment demands. This creates awareness of the balance between romantic freedom and relationship responsibility or security needs.",
      quincunx: "Affectionate expression requires ongoing adaptation to limitations and responsibilities. This develops the ability to express love creatively within restrictive circumstances or demanding commitments."
    },
    uranus: {
      conjunction: "Love and freedom merge, creating exciting but unpredictable romantic expression. This can lead to relationship instability or fear of emotional commitment.",
      sextile: "Romantic expression and freedom enhance each other when consciously balanced. This brings exciting love relationships that maintain independence through mutual respect for individuality.",
      square: "Romantic stability conflicts with need for excitement and independence. This develops authentic love through learning to balance security with freedom in relationships.",
      trine: "Romantic expression and freedom enhance each other naturally. This creates exciting relationships that maintain independence and bring innovative approaches to love and creativity.",
      opposition: "Romantic stability faces need for excitement and independence. This develops awareness of the tension between security and freedom in love relationships.",
      quincunx: "Romantic stability needs continuous adjustment to changing need for freedom or excitement. This creates flexibility in love relationships and ability to adapt to partners' evolving independence needs."
    },
    neptune: {
      conjunction: "Love seeks transcendence and idealization, creating romantic and spiritual affection. This aspect can manifest as unrealistic romantic expectations or deceptive relationships.",
      sextile: "Love and spiritual connection work together through conscious development. This creates compassionate love and artistic abilities that can be cultivated through spiritual or creative practices.",
      square: "Clear romantic values conflict with illusion, idealization, or deception. This teaches discriminating love through learning to distinguish between genuine affection and fantasy or manipulation.",
      trine: "Love and spiritual connection flow together smoothly. This brings natural compassion, romantic idealism that's grounded in reality, and artistic abilities that express divine love.",
      opposition: "Clear romantic values face idealization, confusion, or deceptive influences. This creates awareness of the difference between genuine love and fantasy while developing spiritual approaches to relationship.",
      quincunx: "Clear romantic values require ongoing adjustment to spiritual or imaginative influences. This develops the ability to adapt love expression to serve higher purposes or creative inspiration."
    },
    pluto: {
      conjunction: "Love and transformation unite, creating intense and magnetic attraction. This combination can lead to obsessive relationships or manipulative use of charm and beauty.",
      sextile: "Affection and transformation support each other through conscious emotional work. This brings the ability to deepen relationships and transform through love when psychological insights are actively pursued.",
      square: "Surface affection conflicts with deep emotional and sexual intensity. This transforms love relationships through confronting jealousy, possessiveness, and power dynamics in love.",
      trine: "Affection and transformation work together harmoniously. This creates naturally deep relationships and the ability to transform through love without manipulation or power struggles.",
      opposition: "Surface affection faces deep transformation and power dynamics. This develops awareness of hidden relationship patterns and the need to balance surface harmony with psychological depth.",
      quincunx: "Surface affection needs constant adjustment to deep transformation and power dynamics. This creates the ability to modify romantic expression based on psychological insights and changing power balances."
    }
  },
  mars: {
    jupiter: {
      conjunction: "Action and expansion merge, creating enthusiastic and ambitious energy. This aspect can manifest as overconfidence in action or tendency to take on more than can be accomplished.",
      sextile: "Action and expansion support each other when opportunities are actively pursued. This creates the ability to take confident action toward growth and adventure when courage is consciously applied.",
      square: "Impulsive action conflicts with expansive judgment, creating overreach and poor timing. This aspect develops strategic wisdom through learning to balance enthusiasm with realistic assessment of capabilities.",
      trine: "Action and expansion flow together naturally, creating confident and successful endeavors. This aspect brings natural ability to take bold action and achieve ambitious goals with good timing.",
      opposition: "Personal action faces excessive expansion or moral judgment. This creates awareness of the balance between individual assertion and broader philosophical or cultural perspectives.",
      quincunx: "Action requires ongoing adjustment to expanding opportunities or changing beliefs. This develops tactical flexibility and the ability to modify approach based on evolving philosophical understanding."
    },
    saturn: {
      conjunction: "Action meets restriction, creating disciplined but potentially frustrated energy. This combination can lead to anger about limitations or overly controlling behavior.",
      sextile: "Disciplined action and structure work together through consistent effort. This brings the ability to accomplish long-term goals through methodical action and sustained commitment.",
      square: "Dynamic action conflicts with limitations and fear, creating frustration and blocked energy. This builds authentic power through learning to work within constraints while maintaining assertive energy.",
      trine: "Dynamic action and discipline complement each other effortlessly. This creates natural ability to accomplish long-term goals through consistent, methodical action without losing enthusiasm.",
      opposition: "Dynamic energy faces restrictions, limitations, or authoritarian control. This develops awareness of the balance between assertive action and respect for structure, tradition, or authority.",
      quincunx: "Dynamic energy needs constant adjustment to limitations and responsibilities. This creates the ability to find creative ways to take action within restrictive circumstances."
    },
    uranus: {
      conjunction: "Action and innovation unite, creating explosive and unpredictable energy. This aspect can manifest as reckless behavior or inability to sustain consistent action.",
      sextile: "Dynamic action and innovation enhance each other when consciously directed. This creates breakthrough abilities and the capacity for original action when experimental approaches are actively explored.",
      square: "Consistent action conflicts with need for freedom and innovation. This develops authentic rebellion through learning to balance revolutionary energy with sustained constructive action.",
      trine: "Purposeful action and innovation work together harmoniously. This brings natural ability to take original action and implement breakthrough ideas without disrupting overall stability.",
      opposition: "Consistent action faces revolutionary change or need for complete freedom. This creates awareness of the tension between sustained effort and innovative breakthrough or independence.",
      quincunx: "Consistent action requires ongoing adaptation to changing need for freedom or innovation. This develops flexible strategies and the ability to modify action based on new insights."
    },
    neptune: {
      conjunction: "Action becomes inspired but potentially confused, creating spiritual warrior energy. This can lead to misdirected action or fighting for unclear or unrealistic causes.",
      sextile: "Purposeful action and spiritual inspiration support each other through conscious alignment. This brings the ability to fight for idealistic causes and take inspired action when higher guidance is actively sought.",
      square: "Clear action conflicts with confusion, idealism, or deceptive influences. This teaches discerning action through learning to distinguish between inspired action and escapist or misguided efforts.",
      trine: "Clear action and spiritual inspiration enhance each other naturally. This creates ability to take inspired action and fight for idealistic causes with practical effectiveness.",
      opposition: "Clear action faces confusion, idealism, or spiritual surrender. This develops awareness of the balance between assertive action and compassionate, selfless service.",
      quincunx: "Clear action needs continuous adjustment to spiritual influences or imaginative inspiration. This creates the ability to adapt assertive energy to serve higher purposes or creative vision."
    },
    pluto: {
      conjunction: "Action and transformation merge, creating intense and potentially destructive power. This combination can manifest as compulsive aggression or obsessive pursuit of goals.",
      sextile: "Dynamic action and transformative power work together through conscious direction. This creates the ability to take powerful action for deep change when psychological insights are actively applied.",
      square: "Personal action conflicts with deep transformative forces and power struggles. This develops authentic power through confronting manipulation and learning to channel intense energy constructively.",
      trine: "Dynamic action and transformative power complement each other smoothly. This brings natural ability to take powerful action for deep change without manipulation or destructive force.",
      opposition: "Personal action faces intense transformative pressure and power dynamics. This creates awareness of manipulation and the need to balance personal assertion with surrender to deeper forces.",
      quincunx: "Personal action requires ongoing adjustment to transformative pressures and power dynamics. This develops the ability to modify assertive approach based on psychological insights and changing circumstances."
    }
  },
  jupiter: {
    saturn: {
      conjunction: "Expansion and limitation merge, creating disciplined growth and structured optimism. This aspect can manifest as conflicted beliefs about success or alternating between excessive confidence and pessimism.",
      sextile: "Optimistic expansion and practical structure support each other through conscious effort. This creates the ability to build lasting success and develop realistic optimism through disciplined growth.",
      square: "Optimistic expansion conflicts with practical limitations and conservative restraint. This aspect teaches realistic optimism through learning to balance faith with practical consideration of actual circumstances.",
      trine: "Expansion and structure work together harmoniously, creating successful and enduring growth. This aspect brings natural ability to balance optimism with realism and build lasting achievements.",
      opposition: "Optimistic expansion faces practical limitations and conservative restraint. This creates awareness of the balance between faith and realism, growth and responsibility.",
      quincunx: "Optimistic expansion requires ongoing adjustment to practical limitations and responsibilities. This develops realistic goal-setting and the ability to adapt growth plans to actual circumstances."
    },
    uranus: {
      conjunction: "Expansion and innovation unite, creating revolutionary beliefs and sudden opportunities. This combination can lead to unrealistic expectations about change or extremist philosophical positions.",
      sextile: "Philosophical growth and innovative insights work together when actively explored. This brings progressive beliefs and the ability to expand consciousness through experimental approaches to truth.",
      square: "Philosophical beliefs conflict with need for revolutionary change or complete freedom. This develops authentic beliefs through questioning established philosophies and integrating innovative insights.",
      trine: "Philosophical expansion and innovation complement each other naturally. This creates progressive beliefs and natural ability to grow through experimental approaches to truth and freedom.",
      opposition: "Established beliefs face revolutionary insights and need for complete philosophical freedom. This develops awareness of the tension between traditional wisdom and innovative truth.",
      quincunx: "Established beliefs need constant adjustment to innovative insights and changing freedom needs. This creates philosophical flexibility and ability to modify worldview based on new revelations."
    },
    neptune: {
      conjunction: "Expansion and transcendence merge, creating spiritual idealism and inspirational beliefs. This aspect can manifest as impractical spirituality or confusion between faith and wishful thinking.",
      sextile: "Optimistic expansion and spiritual inspiration enhance each other through conscious development. This creates philosophical compassion and the ability to grow through service and spiritual practices.",
      square: "Realistic optimism conflicts with idealistic confusion or escapist spirituality. This teaches discriminating faith through learning to distinguish between genuine inspiration and wishful thinking.",
      trine: "Optimistic growth and spiritual inspiration flow together smoothly. This brings natural faith, compassionate philosophy, and ability to find meaning through service and transcendent experiences.",
      opposition: "Realistic optimism faces idealistic confusion or escapist spirituality. This creates awareness of the difference between genuine faith and wishful thinking or spiritual bypassing.",
      quincunx: "Realistic optimism requires ongoing adaptation to spiritual influences and imaginative inspiration. This develops the ability to adjust beliefs to serve higher purposes and creative vision."
    },
    pluto: {
      conjunction: "Expansion and transformation unite, creating powerful beliefs and intense convictions. This combination can lead to fanatical beliefs or compulsive need to convert others to one's philosophy.",
      sextile: "Growth-oriented beliefs and transformative insights support each other through conscious exploration. This brings the ability to expand through deep psychological work and regenerative experiences.",
      square: "Optimistic beliefs conflict with deep psychological truths and power dynamics. This transforms philosophical understanding through confronting shadow aspects of beliefs and dogmatic thinking.",
      trine: "Expansive beliefs and transformative power work together effortlessly. This creates natural ability to grow through deep psychological insights and regenerative life experiences.",
      opposition: "Optimistic beliefs face intense transformation and psychological depth. This develops awareness of shadow aspects in philosophy and the need to balance surface optimism with deep truth.",
      quincunx: "Expansive beliefs need continuous adjustment to transformative pressures and psychological insights. This creates the ability to modify philosophical understanding based on deep inner changes."
    }
  },
  saturn: {
    uranus: {
      conjunction: "Structure and innovation merge, creating revolutionary discipline or restricted freedom. This aspect can manifest as authoritarian rebellion or innovative tradition-building.",
      sextile: "Disciplined structure and innovation support each other through conscious effort. This creates the ability to build innovative systems and implement progressive changes through methodical approaches.",
      square: "Structural limitation conflicts with need for innovation and freedom. This aspect develops authentic authority through learning to balance tradition with progressive change and stability with revolution.",
      trine: "Structure and innovation work together harmoniously. This creates natural ability to implement progressive changes through methodical approaches and build innovative systems that endure.",
      opposition: "Established structure faces revolutionary change and need for complete freedom. This creates awareness of the balance between stability and innovation, tradition and progress.",
      quincunx: "Structured approach requires ongoing adjustment to innovative insights and changing freedom needs. This develops flexible discipline and ability to adapt systematic approaches to new revelations."
    },
    neptune: {
      conjunction: "Structure and transcendence unite, creating spiritual discipline or crystallized illusions. This combination can lead to rigid spirituality or practical mysticism.",
      sextile: "Practical structure and spiritual inspiration work together when consciously developed. This brings the ability to manifest spiritual ideals through disciplined practice and organized service.",
      square: "Practical structure conflicts with spiritual idealism and imaginative confusion. This teaches discriminating discipline through learning to distinguish between practical spirituality and escapist fantasy.",
      trine: "Practical discipline and spiritual inspiration complement each other naturally. This brings ability to manifest spiritual ideals through sustained practice and organized approaches to transcendence.",
      opposition: "Practical discipline faces spiritual idealism and imaginative dissolution. This develops awareness of the balance between earthly responsibility and transcendent service.",
      quincunx: "Practical structure needs constant adjustment to spiritual influences and imaginative inspiration. This creates the ability to adapt disciplined approaches to serve transcendent purposes."
    },
    pluto: {
      conjunction: "Limitation and transformation merge, creating intense pressure for structured change. This aspect can manifest as oppressive control or transformative discipline.",
      sextile: "Structured discipline and transformative power support each other through conscious application. This creates the ability to transform through sustained effort and systematic psychological work.",
      square: "Established structure conflicts with deep transformative forces and power dynamics. This builds authentic power through confronting authoritarian tendencies and learning to transform rather than control.",
      trine: "Structured approach and transformative power flow together smoothly. This creates natural ability to accomplish deep transformation through methodical psychological work and sustained regenerative effort.",
      opposition: "Structural authority faces intense transformation and power dynamics. This creates awareness of the difference between authentic authority and controlling manipulation.",
      quincunx: "Established structure requires ongoing adjustment to transformative pressures and power dynamics. This develops the ability to modify systematic approaches based on deep psychological insights."
    }
  },
  uranus: {
    neptune: {
      conjunction: "Innovation and transcendence merge, creating spiritual revolution or confused idealism. This aspect can manifest as impractical spirituality or breakthrough mystical insights.",
      sextile: "Innovation and spiritual inspiration support each other through conscious exploration. This creates the ability to revolutionize spiritual understanding and develop progressive approaches to transcendence.",
      square: "Revolutionary change conflicts with spiritual idealism and imaginative confusion. This aspect develops authentic innovation through learning to distinguish between genuine breakthrough and escapist fantasy.",
      trine: "Innovation and spiritual inspiration flow together harmoniously. This creates natural ability to revolutionize spiritual understanding and implement progressive approaches to transcendence without disruption.",
      opposition: "Revolutionary change faces spiritual idealism and imaginative dissolution. This creates awareness of the balance between progressive innovation and transcendent service or spiritual surrender.",
      quincunx: "Innovative insights require ongoing adjustment to spiritual influences and imaginative inspiration. This creates the ability to adapt revolutionary approaches to serve transcendent purposes."
    },
    pluto: {
      conjunction: "Innovation and transformation unite, creating revolutionary change or destructive rebellion. This combination can lead to extreme upheaval or breakthrough regeneration.",
      sextile: "Revolutionary change and transformative power work together when consciously directed. This brings the ability to transform through innovative approaches and implement breakthrough changes systematically.",
      square: "Need for freedom conflicts with deep transformative pressures and power dynamics. This creates revolutionary transformation through confronting control issues and learning to liberate rather than rebel.",
      trine: "Revolutionary energy and transformative power complement each other naturally. This brings ability to transform through innovation and implement breakthrough changes that regenerate rather than destroy.",
      opposition: "Need for complete freedom faces intense transformation and power dynamics. This develops awareness of the difference between authentic liberation and destructive rebellion.",
      quincunx: "Revolutionary energy needs constant adjustment to transformative pressures and power dynamics. This develops the ability to modify innovative approaches based on deep psychological insights."
    }
  },
  neptune: {
    pluto: {
      conjunction: "Transcendence and transformation merge, creating spiritual regeneration or confused power dynamics. This rare generational aspect can manifest as spiritual transformation or idealistic manipulation.",
      sextile: "Spiritual inspiration and transformative power support each other through conscious development. This long-term generational aspect creates the ability to transform through spiritual practice and serve regenerative purposes.",
      square: "Spiritual idealism conflicts with deep transformative forces and power dynamics. This generational aspect develops authentic spirituality through confronting spiritual materialism and learning to transcend rather than escape.",
      trine: "Spiritual inspiration and transformative power flow together harmoniously. This generational aspect brings natural ability to transform through spiritual understanding and serve regenerative purposes without manipulation.",
      opposition: "Spiritual transcendence faces intense transformation and power dynamics. This rare generational aspect creates awareness of the balance between spiritual surrender and psychological empowerment.",
      quincunx: "Spiritual influences require ongoing adjustment to transformative pressures and power dynamics. This creates the ability to adapt transcendent understanding to serve deep psychological transformation."
    }
  }
};