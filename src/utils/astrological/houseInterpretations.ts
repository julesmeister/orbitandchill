/* eslint-disable @typescript-eslint/no-unused-vars */

// Planet in House interpretations
export const getPlanetInHouseInterpretation = (planet: string, house: number): string => {
  const planetName = planet.charAt(0).toUpperCase() + planet.slice(1);
  
  const planetHouseInterpretations: Record<string, Record<number, string>> = {
    sun: {
      1: "Your core identity shines through your personality and physical appearance. You are naturally confident, self-directed, and approach life with strong personal initiative. Your vitality and leadership qualities are immediately apparent to others, making you a natural focal point in any gathering.",
      2: "Your sense of self is closely tied to your values, possessions, and material security. You find confidence through building resources and may have a talent for attracting wealth. Your identity is expressed through what you own and value most deeply.",
      3: "Your identity is expressed through communication, learning, and connecting with your immediate environment. You're naturally curious, articulate, and may find your purpose through teaching, writing, or working with siblings and neighbors.",
      4: "Your core self is deeply connected to home, family, and your roots. You may be the center of your family or find your greatest fulfillment in domestic life. Your sense of identity is tied to your heritage and creating emotional security.",
      5: "You express your core identity through creativity, romance, and self-expression. You're naturally dramatic, playful, and may shine in entertainment or working with children. Your vitality comes through creative pursuits and matters of the heart.",
      6: "Your identity is expressed through service, health, and daily work routines. You find yourself by being useful to others and may be known for your dedication to health, healing, or efficient problem-solving.",
      7: "Your sense of self emerges through partnerships and relationships with others. You may define yourself through your significant relationships and have a natural talent for cooperation and understanding others' needs.",
      8: "Your identity involves transformation, shared resources, and exploring life's mysteries. You're drawn to psychology, the occult, or financial planning. Your sense of self emerges through intense experiences and managing others' resources.",
      9: "Your core identity is expressed through higher learning, travel, and philosophical pursuits. You may find yourself through teaching, publishing, or exploring foreign cultures. Your sense of purpose involves expanding horizons.",
      10: "Your identity is tied to your career, reputation, and public standing. You're naturally ambitious and may be well-known in your field. Your sense of self comes through professional achievement and social recognition.",
      11: "You express your identity through friendships, groups, and humanitarian causes. Your sense of self emerges through collective efforts and you may be known for your progressive ideals and ability to inspire groups.",
      12: "Your core identity involves spirituality, compassion, and service to those in need. You may work behind the scenes or in institutions. Your sense of self emerges through transcending ego and serving something greater."
    },
    moon: {
      1: "Your emotions are immediately visible and you react instinctively to your environment. You have strong nurturing instincts and may be seen as motherly or protective. Your moods significantly influence your appearance and approach to life.",
      2: "Your emotional security is tied to material stability and sensual comforts. You need financial security to feel emotionally safe and may have fluctuating income or strong emotional attachments to possessions.",
      3: "Your emotions find expression through communication and learning. You're emotionally curious and may have close relationships with siblings. Your feelings change quickly and you need mental stimulation for emotional satisfaction.",
      4: "This is the Moon's natural placement, emphasizing deep emotional connection to home and family. You're exceptionally nurturing and may be psychically sensitive. Your home is your emotional sanctuary.",
      5: "Your emotions are expressed dramatically and creatively. You have strong romantic feelings and may be emotionally involved with children or creative projects. Your heart seeks joy, play, and artistic expression.",
      6: "Your emotional well-being is tied to health, routine, and being useful. You find emotional satisfaction through service and may be drawn to healing professions. Daily habits significantly affect your mood.",
      7: "Your emotional nature emerges through partnerships and you seek emotional security through relationships. You're naturally diplomatic and may be emotionally dependent on others or drawn to nurturing partnerships.",
      8: "You experience emotions intensely and may be drawn to emotional transformation. You have deep psychological insights and may be interested in the emotional undercurrents of life. Emotional crises lead to growth.",
      9: "Your emotions are inspired by philosophy, travel, and higher learning. You seek emotional expansion through education and may have strong feelings about belief systems. Foreign cultures may deeply move you.",
      10: "Your emotions may be on public display or tied to your career reputation. You're emotionally invested in your professional success and public image. Your nurturing nature may be part of your career.",
      11: "You find emotional satisfaction through friendships and group involvement. Your feelings are influenced by collective ideals and you may be emotionally invested in humanitarian causes or progressive movements.",
      12: "Your emotional nature is compassionate and potentially psychic. You may feel others' emotions deeply and be drawn to spiritual or charitable work. Hidden emotions and subconscious patterns significantly influence you."
    },
    mercury: {
      1: "Your thinking and communication style are central to your identity. You're intellectually curious, articulate, and may be known for your wit or communication skills. Your mind is quick and adaptable.",
      2: "Your thinking focuses on practical matters, values, and material security. You communicate about tangible things and may have a talent for business communication. Your ideas need practical application to satisfy you.",
      3: "This is Mercury's natural placement, emphasizing communication, learning, and local connections. You're extremely articulate, curious, and may be involved in education, media, or transportation.",
      4: "Your thinking is influenced by family, tradition, and emotional factors. You may work from home or in real estate. Your communication style is nurturing and you think deeply about family matters.",
      5: "Your communication is creative, dramatic, and playful. You may be involved in entertainment, education of children, or creative writing. Your thinking is optimistic and focused on self-expression.",
      6: "Your thinking is practical, analytical, and focused on improvement. You communicate well about health, work, and efficiency. You may be involved in healthcare, technical writing, or service industries.",
      7: "Your thinking emerges through dialogue and partnership. You're naturally diplomatic and may be involved in counseling, law, or public relations. You think best when bouncing ideas off others.",
      8: "Your thinking penetrates beneath surface appearances to uncover hidden truths. You're drawn to research, investigation, or psychology. Your communication can be intense and transformative.",
      9: "Your mind seeks higher knowledge, foreign cultures, and philosophical understanding. You may be involved in publishing, education, or international communication. Your thinking is expansive and optimistic.",
      10: "Your communication skills are tied to your career and public reputation. You may be known for your expertise or speaking ability. Your thinking is ambitious and focused on achievement.",
      11: "Your thinking is progressive and focused on group activities and future goals. You communicate well with friends and may be involved in technology or humanitarian causes. Your ideas are often ahead of their time.",
      12: "Your thinking is intuitive and may involve spiritual or unconscious processes. You may be drawn to spiritual writing or work in institutions. Your communication can be inspired but sometimes unclear."
    },
    venus: {
      1: "Your natural charm and attractiveness are immediately apparent. You have refined tastes and may be artistic or beautiful. Love and beauty are central to your identity and approach to life.",
      2: "You attract money and possessions easily and have expensive tastes. You find love through shared values and may be attracted to wealthy or artistic partners. Material beauty brings you joy.",
      3: "You express love through communication and may be charming in speech or writing. You have harmonious relationships with siblings and neighbors. Short trips may lead to romantic encounters.",
      4: "You find love and beauty through home and family connections. Your home is likely beautiful and harmonious. You may be especially close to your mother or female family members.",
      5: "This is Venus's natural placement, emphasizing romance, creativity, and pleasure. You're naturally artistic, romantic, and may be involved in entertainment. Love affairs are significant in your life.",
      6: "You express love through service and may find romance through work or health activities. You're attracted to helpful, practical partners. Daily routines should include beauty and pleasure.",
      7: "This is Venus's other natural placement, emphasizing partnerships and marriage. You're naturally diplomatic and attractive to others. Relationships are central to your happiness and success.",
      8: "You experience love intensely and may be drawn to passionate, transformative relationships. You may benefit financially through partners or have talent for managing shared resources.",
      9: "You're attracted to foreign cultures, higher learning, and philosophical partners. Love may come through travel or education. You appreciate the beauty in different belief systems and cultures.",
      10: "Your charm and artistic abilities may be part of your career or public image. You may be attracted to successful, ambitious partners. Beauty and harmony in your professional life are important.",
      11: "You find love and beauty through friendships and group activities. You're attracted to progressive, humanitarian partners. Your social circle appreciates your artistic or diplomatic abilities.",
      12: "Your love nature is compassionate and self-sacrificing. You may be drawn to spiritual or charitable love expressions. Secret relationships or unrequited love may be themes in your life."
    },
    mars: {
      1: "Your energy and assertiveness are immediately apparent in your personality. You're naturally competitive, direct, and physically active. You approach life with courage and may be prone to accidents or scars.",
      2: "Your drive is focused on acquiring money and possessions. You work hard for material security and may be competitive about resources. Your energy is steady and practical rather than impulsive.",
      3: "Your mental energy is strong and you may be argumentative or debate-oriented. You're energetic in communication and may be involved in sports, driving, or competitive intellectual activities.",
      4: "Your energy is directed toward home and family protection. You may be defensive about your personal life or have conflicts with family. Your drive comes from emotional security needs.",
      5: "Your energy is expressed through creativity, romance, and competition. You're passionate about artistic pursuits and may be aggressive in romantic pursuits. You have strong competitive instincts in games and sports.",
      6: "Your energy is channeled into work, health, and service. You're a hard worker who may be involved in healthcare, military service, or competitive professions. You fight for improvement and efficiency.",
      7: "Your energy emerges through partnerships and may create conflict in relationships. You're attracted to strong, assertive partners but may also compete with them. Legal battles are possible.",
      8: "Your energy is directed toward transformation and shared resources. You may be involved in finance, surgery, or crisis management. Your drive involves managing intense situations and others' resources.",
      9: "Your energy is focused on higher learning, travel, and spreading your beliefs. You may be a crusader for philosophical or religious causes. Foreign experiences energize you.",
      10: "Your ambition and drive are focused on career achievement and public recognition. You're naturally competitive in your profession and may be known for your energy and leadership abilities.",
      11: "Your energy is directed toward group activities and social causes. You're motivated by humanitarian ideals and may be aggressive about progressive changes. You energize groups and organizations.",
      12: "Your energy may be hidden or directed toward spiritual or charitable causes. You may work behind the scenes or have hidden enemies. Your drive involves transcending personal desires."
    },
    jupiter: {
      1: "You have a naturally optimistic, generous personality that inspires confidence in others. You may be physically large or have an expansive presence. Luck and opportunities come through your positive attitude.",
      2: "You have natural money-making ability and generous attitudes toward resources. You may accumulate wealth through optimism and good judgment. Your values are expansive and philosophical.",
      3: "Your mind is naturally optimistic and focused on learning and growth. You're enthusiastic about communication and may be involved in education, publishing, or media. Siblings may be successful.",
      4: "You have a generous, protective attitude toward home and family. Your home may be large or you may come from a prominent family. Real estate investments may be particularly lucky for you.",
      5: "You're generous and optimistic about creative expression, children, and romance. You may be involved in education, entertainment, or working with children. Your creative endeavors tend to succeed.",
      6: "You bring optimism and expansion to your work and health routines. You may be involved in healthcare, teaching, or service professions. You're generous with colleagues and enjoy helping others improve.",
      7: "You attract generous, optimistic partners and have an expansive approach to relationships. You may benefit through marriage or partnerships. Legal matters tend to work in your favor.",
      8: "You have talent for managing shared resources and may benefit through insurance, investments, or inheritance. You approach transformation with optimism and may be involved in healing or research.",
      9: "This is Jupiter's natural placement, emphasizing higher learning, travel, and philosophical expansion. You're naturally wise, optimistic about life's meaning, and may be involved in education or religion.",
      10: "Your career involves expansion, education, or moral leadership. You have a good reputation and may be involved in law, education, or international business. Professional success comes through ethical behavior.",
      11: "You have optimistic friends and benefit through group activities. Your hopes and wishes tend to be fulfilled, often through social connections. You're generous with humanitarian causes.",
      12: "Your generosity is expressed through charitable or spiritual activities. You may work in institutions or behind the scenes. Your greatest growth comes through service and spiritual development."
    },
    saturn: {
      1: "You approach life with seriousness and discipline, often appearing older than your years. You may have faced early responsibilities that matured you quickly. Success comes through persistent effort and self-discipline.",
      2: "You approach money and possessions with caution and discipline. You may face financial restrictions early in life but build security through careful planning. You value quality over quantity.",
      3: "Your thinking is serious, practical, and disciplined. You may have experienced difficulties in early education or with siblings. Communication skills develop slowly but become authoritative with time.",
      4: "You may have experienced a restrictive or disciplined home environment. Family responsibilities may have been significant. You work hard to create security and may invest in real estate.",
      5: "You approach creativity and romance with seriousness and caution. You may delay having children or take parenting responsibilities very seriously. Creative expression develops with discipline and time.",
      6: "You're naturally disciplined about work and health routines. You may be involved in traditional professions or healthcare. You take service obligations seriously and prefer structured work environments.",
      7: "You approach partnerships with caution and seek stable, mature relationships. You may marry later in life or to someone older. Relationships require work but can be enduring and committed.",
      8: "You have a serious approach to shared resources and transformation. You may be involved in insurance, taxes, or estate planning. You face intense experiences with discipline and ultimately master them.",
      9: "You approach higher learning and philosophy with discipline and structure. You may be involved in traditional education or conservative belief systems. Wisdom comes through structured study and experience.",
      10: "This is Saturn's natural placement, emphasizing career achievement through discipline and time. You have natural authority and may rise to positions of responsibility. Success comes later but is lasting.",
      11: "You approach friendships and group activities with caution. Your social circle may include older, more established people. You achieve your goals through persistent effort rather than luck.",
      12: "You may work in institutions or behind the scenes in structured environments. Your spiritual development involves discipline and may include periods of solitude. You face subconscious fears with courage."
    },
    uranus: {
      1: "You have an original, unconventional personality that stands out from the crowd. You're naturally rebellious and may change your appearance or approach to life suddenly. You inspire others to be more authentic.",
      2: "You have unconventional attitudes toward money and possessions. Your income may be irregular or come from unusual sources. You may pioneer new financial technologies or investment approaches.",
      3: "Your thinking is original and inventive, often ahead of its time. You may be involved in technology, innovation, or avant-garde communication. Your ideas can be brilliant but sometimes impractical.",
      4: "Your home life may be unconventional or subject to sudden changes. You may live in unusual places or with unconventional family arrangements. Your roots may involve progressive or humanitarian themes.",
      5: "You express creativity in original, unconventional ways. Your romantic life may be unusual or involve sudden attractions. You may be involved in progressive education or innovative entertainment.",
      6: "You bring innovation to work and health routines. You may be involved in alternative health, technology, or humanitarian service. You rebel against routine and prefer flexible work arrangements.",
      7: "You seek freedom and originality in partnerships. Your relationships may be unconventional or involve sudden attractions and separations. You need partners who respect your independence.",
      8: "You have an innovative approach to shared resources and transformation. You may be involved in cutting-edge research or revolutionary financial systems. You experience sudden, transformative changes.",
      9: "Your philosophy is progressive and humanitarian. You may be involved in revolutionary education or promoting social change. Your beliefs are ahead of their time and inspire social progress.",
      10: "Your career involves innovation, technology, or social reform. You may have an unusual profession or work in progressive industries. Your reputation is for being original and forward-thinking.",
      11: "This is Uranus's natural placement, emphasizing friendship, groups, and humanitarian causes. You're naturally progressive and may be involved in social reform or technological advancement.",
      12: "Your spiritual approach is unconventional and may involve sudden insights or revolutionary understanding. You may work in progressive institutions or be involved in social reform behind the scenes."
    },
    neptune: {
      1: "You have a sensitive, compassionate personality with strong intuitive abilities. Others may see you as mysterious or ethereal. You're naturally artistic and may be psychically sensitive.",
      2: "You have idealistic attitudes toward money and possessions. Your financial situation may be unclear or involve deception. You may earn money through artistic or spiritual pursuits.",
      3: "Your thinking is intuitive and imaginative rather than logical. You may be involved in artistic communication or spiritual teaching. You're naturally empathetic in your interactions with others.",
      4: "Your home environment is spiritual or artistic. You may have psychic connections with family members or live near water. Your roots may involve spiritual or artistic traditions.",
      5: "You express creativity through imagination, spirituality, or artistic pursuits. Your romantic life may involve idealization or spiritual connections. You're naturally gifted with children.",
      6: "You bring compassion and healing to your work environment. You may be involved in healthcare, social services, or artistic professions. You serve others through spiritual or creative means.",
      7: "You seek spiritual or artistic connections in partnerships. You may idealize partners or be attracted to artistic, spiritual people. Relationships may involve sacrifice or spiritual growth.",
      8: "You have intuitive insights into shared resources and transformation. You may be involved in spiritual healing or psychic research. Your approach to crisis is compassionate and transcendent.",
      9: "Your philosophy is spiritual and compassionate. You may be involved in spiritual teaching or mystical studies. You seek transcendent meaning through religion or spiritual practices.",
      10: "Your career may involve spirituality, artistry, or compassionate service. Your reputation is for being sensitive and idealistic. You may work in film, music, or healing professions.",
      11: "Your friends share your spiritual or artistic interests. You're drawn to humanitarian causes and may be involved in spiritual or artistic groups. Your ideals inspire collective action.",
      12: "This is Neptune's natural placement, emphasizing spirituality, compassion, and service. You're naturally psychic and may work in spiritual or charitable institutions."
    },
    pluto: {
      1: "You have an intense, powerful personality that transforms yourself and others. You may have experienced significant personal transformation. Others sense your depth and psychological insight.",
      2: "You have an intense relationship with money and possessions. You may experience financial transformation or be involved in others' resources. You have power to transform material circumstances.",
      3: "Your thinking is penetrating and transformative. You may be involved in research, investigation, or psychological communication. Your words have power to influence and transform others.",
      4: "Your home and family life may involve power struggles or transformation. You may uncover family secrets or experience significant changes in your living situation. You transform through emotional security.",
      5: "You express creativity with intensity and power. Your romantic life may involve transformation or power dynamics. You may be involved in transformative education or psychological arts.",
      6: "You bring transformation to work and health routines. You may be involved in healing, research, or crisis management. You have power to transform daily life and serve others through intensity.",
      7: "Your partnerships involve transformation and power dynamics. You may attract intense partners or experience significant relationship changes. You learn about power through intimate connections.",
      8: "This is Pluto's natural placement, emphasizing transformation, shared resources, and psychological depth. You have natural ability to manage crisis and facilitate deep healing and regeneration.",
      9: "Your philosophy involves transformation and may challenge conventional beliefs. You may be involved in revolutionary education or transformative spiritual practices. You seek ultimate truth.",
      10: "Your career involves transformation, research, or managing crisis situations. You may have a powerful public reputation and be known for your ability to handle intense situations.",
      11: "Your friends and groups may be involved in transformation or social revolution. You're drawn to causes that involve fundamental change and may inspire collective transformation.",
      12: "Your spiritual development involves deep transformation and may include working with the shadow or unconscious. You may work in institutions that facilitate healing and transformation."
    }
  };

  const interpretations = planetHouseInterpretations[planet.toLowerCase()];
  if (interpretations && interpretations[house]) {
    return interpretations[house];
  }

  return `${planetName} in the ${house}th house brings its energy to this area of life, influencing how you express this planetary principle in the corresponding life themes.`;
};

// House Cusp Sign interpretations
export const getHouseCuspSignInterpretation = (house: number, sign: string): string => {
  const signName = sign.charAt(0).toUpperCase() + sign.slice(1);
  
  const houseCuspInterpretations: Record<number, Record<string, string>> = {
    1: {
      aries: "You approach life with directness, energy, and pioneering spirit. Your personality is bold and assertive, and you prefer to take initiative rather than wait for others. You make strong first impressions and are seen as courageous and independent.",
      taurus: "You approach life with steadiness, practicality, and appreciation for stability. Your personality appears reliable and grounded, and others see you as someone who values security and beauty. You make deliberate, well-considered decisions.",
      gemini: "You approach life with curiosity, adaptability, and communication skills. Your personality is versatile and intellectually oriented, and others see you as witty and socially engaging. You adapt quickly to new situations.",
      cancer: "You approach life with sensitivity, nurturing instincts, and emotional awareness. Your personality appears caring and protective, and others see you as empathetic and family-oriented. You respond to life through emotional intelligence.",
      leo: "You approach life with confidence, creativity, and natural leadership. Your personality is warm and dramatic, and others see you as charismatic and generous. You naturally draw attention and inspire others.",
      virgo: "You approach life with precision, service orientation, and attention to detail. Your personality appears competent and helpful, and others see you as organized and reliable. You improve whatever you encounter.",
      libra: "You approach life with diplomacy, charm, and desire for harmony. Your personality is gracious and cooperative, and others see you as fair and aesthetically aware. You seek balance in all interactions.",
      scorpio: "You approach life with intensity, depth, and transformative power. Your personality appears mysterious and powerful, and others sense your psychological insight. You penetrate beneath surface appearances.",
      sagittarius: "You approach life with optimism, adventure, and philosophical curiosity. Your personality is enthusiastic and freedom-loving, and others see you as inspiring and worldly. You expand horizons wherever you go.",
      capricorn: "You approach life with ambition, discipline, and respect for structure. Your personality appears mature and authoritative, and others see you as responsible and capable. You build lasting foundations.",
      aquarius: "You approach life with originality, independence, and humanitarian ideals. Your personality is unique and progressive, and others see you as innovative and forward-thinking. You champion collective causes.",
      pisces: "You approach life with compassion, intuition, and spiritual sensitivity. Your personality appears gentle and empathetic, and others see you as artistic and understanding. You flow with life's currents."
    },
    2: {
      aries: "You approach money and values with independence and initiative. You prefer to earn your own way and may take financial risks. Your values center on personal freedom and the courage to pursue what you want.",
      taurus: "You have a natural affinity for accumulating resources and building material security. You value quality, beauty, and comfort, and prefer steady, reliable income sources. Financial stability is essential to your well-being.",
      gemini: "You may have multiple income sources and changeable financial patterns. You value communication, learning, and intellectual pursuits. Money may come through writing, teaching, or social connections.",
      cancer: "Your approach to money is cautious and security-oriented. You may save for emotional security and family needs. Your values are tied to home, family, and creating a safe financial foundation.",
      leo: "You may spend generously on luxury and creative pursuits. You value quality, beauty, and things that enhance your image. Money may come through creative talents or leadership positions.",
      virgo: "You approach money with careful planning and practical analysis. You value efficiency, health, and useful possessions. You prefer to budget carefully and invest in things that improve your daily life.",
      libra: "You value beauty, harmony, and partnerships in financial matters. You may spend on aesthetics and social activities. Money may come through partnerships or artistic endeavors.",
      scorpio: "You have an intense relationship with money and may experience financial transformation. You value power and may be involved with others' resources. You approach investments with deep research.",
      sagittarius: "You may have an optimistic but sometimes careless approach to money. You value freedom, education, and experiences over material possessions. Money may come through teaching or international ventures.",
      capricorn: "You approach money with discipline and long-term planning. You value security, status, and quality investments. You prefer to build wealth slowly through conservative, practical methods.",
      aquarius: "You have an unconventional approach to money and may value humanitarian causes over personal wealth. Your income may be irregular or come from innovative sources.",
      pisces: "Your relationship with money may be unclear or overly generous. You value spiritual and artistic pursuits and may be careless with practical financial matters."
    },
    3: {
      aries: "Your communication style is direct, quick, and sometimes impatient. You prefer rapid exchanges and may speak before thinking. Your relationship with siblings and neighbors is energetic and sometimes competitive.",
      taurus: "Your communication is steady, practical, and focused on concrete matters. You prefer face-to-face conversation and may be slow to express your thoughts. Your learning style is methodical and thorough.",
      gemini: "This is the natural sign for the 3rd house. Your communication is versatile, quick, and intellectual. You're naturally curious and may have strong relationships with siblings and multiple interests.",
      cancer: "Your communication style is nurturing and emotionally aware. You prefer to create emotional safety in conversations. Your relationship with siblings may be protective and family-oriented.",
      leo: "Your communication is dramatic, confident, and entertaining. You enjoy storytelling and may be naturally good at public speaking. You prefer conversations that allow for creative expression.",
      virgo: "Your communication is precise, helpful, and detail-oriented. You prefer practical conversations and may be naturally good at explaining complex concepts. You learn through systematic study.",
      libra: "Your communication style is diplomatic and harmonious. You prefer balanced conversations and avoid conflict. You may be naturally good at mediation and seeing multiple perspectives.",
      scorpio: "Your communication is intense and penetrating. You prefer deep conversations and may be naturally good at psychological insight. You're interested in hidden meanings and motivations.",
      sagittarius: "Your communication is enthusiastic and philosophical. You prefer conversations about big ideas and may be naturally good at teaching. You're interested in foreign cultures and higher learning.",
      capricorn: "Your communication is authoritative and structured. You prefer serious conversations and may speak with natural authority. You learn through traditional methods and respect expertise.",
      aquarius: "Your communication is original and progressive. You prefer conversations about future possibilities and may be naturally good at networking. You're interested in technology and social causes.",
      pisces: "Your communication is intuitive and compassionate. You prefer emotionally connected conversations and may communicate more through feeling than words. You learn through inspiration and artistic methods."
    },
    4: {
      aries: "Your home environment is energetic and independent. You may prefer a home that allows for physical activity and personal freedom. Family dynamics may be competitive or leadership-oriented.",
      taurus: "Your home environment is stable, comfortable, and beautiful. You prefer a secure, well-furnished home with natural beauty. Family traditions and material comfort are important to you.",
      gemini: "Your home environment is intellectual and communicative. You may have books, communication devices, or learning materials throughout your home. Family relationships involve mental connection.",
      cancer: "This is the natural sign for the 4th house. Your home is your emotional sanctuary and family relationships are central to your well-being. You're naturally nurturing and protective of loved ones.",
      leo: "Your home environment is warm, creative, and dramatic. You prefer a beautiful home that reflects your personality. Family relationships are generous and you may be the center of family attention.",
      virgo: "Your home environment is organized, clean, and functional. You prefer a well-maintained home with everything in its place. You may be the family member who takes care of practical needs.",
      libra: "Your home environment is harmonious and aesthetically pleasing. You prefer a balanced, beautiful home atmosphere. Family relationships are cooperative and you avoid domestic conflict.",
      scorpio: "Your home environment may involve intensity or privacy. You prefer a protected, private space where you can retreat. Family relationships may be deep but complex.",
      sagittarius: "Your home environment reflects your love of freedom and learning. You may have books, travel mementos, or space for philosophical discussion. Family relationships are optimistic and educational.",
      capricorn: "Your home environment is traditional and structured. You prefer a well-established, respectable home. Family relationships may involve respect for tradition and achievement.",
      aquarius: "Your home environment is unique and progressive. You prefer an unconventional living situation that reflects your individuality. Family relationships are friendly but independent.",
      pisces: "Your home environment is peaceful and spiritually oriented. You prefer a quiet, artistic space near water if possible. Family relationships are compassionate and intuitive."
    },
    5: {
      aries: "Your creative expression is bold, pioneering, and energetic. You prefer competitive sports and adventurous romance. Your approach to children is active and encouraging of independence.",
      taurus: "Your creative expression is practical, beautiful, and sensual. You prefer artistic pursuits that create lasting beauty. Your approach to romance and children is steady and nurturing.",
      gemini: "Your creative expression is intellectual and communicative. You may enjoy writing, teaching, or media arts. Your approach to romance involves mental connection and variety.",
      cancer: "Your creative expression is nurturing and emotionally rich. You may be drawn to domestic arts or working with children. Your approach to romance is protective and family-oriented.",
      leo: "This is the natural sign for the 5th house. Your creative expression is dramatic and attention-getting. You naturally shine in creative and romantic pursuits and are generous with children.",
      virgo: "Your creative expression is precise and improvement-oriented. You may enjoy crafts or detailed artistic work. Your approach to romance and children is helpful and practical.",
      libra: "Your creative expression seeks beauty and harmony. You may be drawn to partnership arts or aesthetic pursuits. Your approach to romance is charming and cooperative.",
      scorpio: "Your creative expression is intense and transformative. You may be drawn to psychological arts or deep emotional expression. Your romantic relationships are passionate and transformative.",
      sagittarius: "Your creative expression is philosophical and adventurous. You may enjoy teaching, travel, or cultural arts. Your approach to romance involves shared beliefs and adventures.",
      capricorn: "Your creative expression is disciplined and achievement-oriented. You may prefer traditional arts or business creativity. Your approach to romance and children is responsible and long-term oriented.",
      aquarius: "Your creative expression is original and humanitarian. You may be drawn to innovative arts or group creativity. Your approach to romance is friendship-based and unconventional.",
      pisces: "Your creative expression is intuitive and spiritual. You may be drawn to musical, poetic, or healing arts. Your approach to romance is compassionate and idealistic."
    },
    6: {
      aries: "Your approach to work and health is energetic and independent. You prefer jobs that allow for physical activity and leadership. You may be impatient with routine tasks.",
      taurus: "Your approach to work is steady, reliable, and practical. You prefer stable employment and may be involved in beauty, food, or financial services. You have good physical endurance.",
      gemini: "Your approach to work involves communication and variety. You may have multiple jobs or work in media, education, or transportation. You need mental stimulation in your daily routine.",
      cancer: "Your approach to work is nurturing and service-oriented. You may work in healthcare, food service, or childcare. You prefer a supportive work environment that feels like family.",
      leo: "Your approach to work is creative and leadership-oriented. You prefer jobs that allow for self-expression and recognition. You bring warmth and enthusiasm to your workplace.",
      virgo: "This is the natural sign for the 6th house. Your approach to work is perfectionist and service-oriented. You naturally excel at detailed work and health-conscious routines.",
      libra: "Your approach to work emphasizes cooperation and aesthetics. You prefer harmonious work environments and may be involved in beauty, law, or public relations.",
      scorpio: "Your approach to work is intense and investigative. You may be involved in research, healing, or crisis management. You prefer work that allows for transformation.",
      sagittarius: "Your approach to work involves teaching, travel, or philosophical pursuits. You prefer work that allows for growth and meaning. You may work in education or international fields.",
      capricorn: "Your approach to work is ambitious and structured. You prefer traditional career paths and may slowly work your way up to positions of authority.",
      aquarius: "Your approach to work is innovative and humanitarian. You may be involved in technology, social causes, or progressive organizations. You prefer flexible work arrangements.",
      pisces: "Your approach to work is compassionate and service-oriented. You may be involved in healthcare, arts, or spiritual service. You prefer work that helps others heal."
    },
    7: {
      aries: "You attract independent, assertive partners who challenge you. Your approach to relationships may involve conflict or competition. You seek partners who share your pioneering spirit.",
      taurus: "You attract stable, reliable partners who provide security. Your approach to relationships is loyal and committed. You seek partners who share your values of comfort and beauty.",
      gemini: "You attract communicative, intellectual partners who stimulate your mind. Your approach to relationships involves mental connection. You may have multiple relationships or partners with varied interests.",
      cancer: "You attract nurturing, family-oriented partners who provide emotional security. Your approach to relationships is protective and caring. You seek partners who want to create a family.",
      leo: "You attract creative, generous partners who appreciate your uniqueness. Your approach to relationships is dramatic and romantic. You seek partners who can match your enthusiasm and creativity.",
      virgo: "You attract practical, helpful partners who support your goals. Your approach to relationships involves service and improvement. You seek partners who share your desire for perfection.",
      libra: "This is the natural sign for the 7th house. You attract charming, diplomatic partners who complement you perfectly. Your approach to relationships emphasizes balance, beauty, and cooperation.",
      scorpio: "You attract intense, transformative partners who challenge you deeply. Your approach to relationships involves psychological depth. You seek partners for profound emotional and spiritual connection.",
      sagittarius: "You attract adventurous, philosophical partners who expand your horizons. Your approach to relationships involves shared beliefs and exploration. You seek partners who love freedom and learning.",
      capricorn: "You attract ambitious, mature partners who support your goals. Your approach to relationships is serious and long-term oriented. You seek partners who share your desire for achievement.",
      aquarius: "You attract independent, progressive partners who respect your uniqueness. Your approach to relationships involves friendship and shared ideals. You seek partners who support your humanitarian goals.",
      pisces: "You attract compassionate, artistic partners who understand your sensitivity. Your approach to relationships involves spiritual connection. You seek partners who share your desire to serve others."
    },
    8: {
      aries: "Your approach to shared resources is direct and independent. You may experience sudden financial changes or prefer to manage crisis situations with courage and initiative.",
      taurus: "Your approach to shared resources is steady and security-oriented. You may be conservative with investments and prefer tangible assets. You approach transformation slowly but thoroughly.",
      gemini: "Your approach to shared resources involves communication and analysis. You may be involved in financial education or writing about investments. You adapt quickly to financial changes.",
      cancer: "Your approach to shared resources is protective and family-oriented. You may inherit from family or be involved in real estate. You approach transformation through emotional healing.",
      leo: "Your approach to shared resources is generous and creative. You may invest in entertainment or luxury items. You approach transformation with confidence and dramatic flair.",
      virgo: "Your approach to shared resources is analytical and practical. You may be involved in financial planning or healthcare investments. You approach transformation through systematic improvement.",
      libra: "Your approach to shared resources involves partnership and balance. You may benefit through marriage or legal settlements. You approach transformation through relationship healing.",
      scorpio: "This is the natural sign for the 8th house. Your approach to shared resources is intense and investigative. You naturally understand the deeper aspects of transformation and regeneration.",
      sagittarius: "Your approach to shared resources is optimistic and philosophical. You may invest in education or international ventures. You approach transformation through expanded understanding.",
      capricorn: "Your approach to shared resources is disciplined and long-term oriented. You may be involved in estate planning or corporate finance. You approach transformation through patient rebuilding.",
      aquarius: "Your approach to shared resources is innovative and humanitarian. You may be involved in technology investments or progressive financial systems. You approach transformation through revolutionary change.",
      pisces: "Your approach to shared resources is intuitive and compassionate. You may be involved in charitable investments or spiritual healing. You approach transformation through surrender and compassion."
    },
    9: {
      aries: "Your approach to higher learning is pioneering and independent. You prefer to explore new philosophical territories and may be drawn to adventure travel or competitive academics.",
      taurus: "Your approach to higher learning is practical and thorough. You prefer traditional education and may study subjects related to finance, art, or natural sciences.",
      gemini: "Your approach to higher learning is intellectual and communicative. You may be involved in teaching, writing, or media. You're naturally curious about multiple subjects.",
      cancer: "Your approach to higher learning is emotionally oriented and nurturing. You may study subjects related to family, history, or emotional healing. You prefer learning environments that feel safe.",
      leo: "Your approach to higher learning is creative and dramatic. You may study performing arts, education, or subjects that allow for self-expression. You're a natural teacher and performer.",
      virgo: "Your approach to higher learning is analytical and improvement-oriented. You may study health sciences, technical subjects, or practical applications of knowledge.",
      libra: "Your approach to higher learning emphasizes beauty, harmony, and justice. You may study law, arts, or subjects related to relationships and cooperation.",
      scorpio: "Your approach to higher learning is intense and investigative. You may study psychology, occult sciences, or subjects that explore the mysteries of life and death.",
      sagittarius: "This is the natural sign for the 9th house. Your approach to higher learning is naturally philosophical and expansive. You're drawn to foreign cultures, religion, and wisdom traditions.",
      capricorn: "Your approach to higher learning is structured and achievement-oriented. You prefer traditional academic paths and may study business, government, or subjects that lead to authority.",
      aquarius: "Your approach to higher learning is progressive and humanitarian. You may study social sciences, technology, or subjects that benefit humanity.",
      pisces: "Your approach to higher learning is intuitive and spiritual. You may study arts, healing, or mystical subjects. You learn through inspiration and compassionate understanding."
    },
    10: {
      aries: "Your career path involves leadership, independence, and pioneering new territories. You're naturally ambitious and prefer careers where you can be first or take initiative.",
      taurus: "Your career path involves stability, beauty, and practical value creation. You may be involved in finance, arts, food, or any field that provides security and tangible results.",
      gemini: "Your career path involves communication, education, and intellectual pursuits. You may work in media, teaching, writing, or any field that requires versatility and quick thinking.",
      cancer: "Your career path involves nurturing, protection, and family-oriented services. You may work in healthcare, real estate, food service, or any field that provides care for others.",
      leo: "Your career path involves creativity, leadership, and self-expression. You may work in entertainment, education, or any field that allows you to shine and inspire others.",
      virgo: "Your career path involves service, analysis, and improvement of systems. You may work in healthcare, technical fields, or any area that requires attention to detail and practical problem-solving.",
      libra: "Your career path involves beauty, harmony, and partnership. You may work in law, arts, diplomacy, or any field that requires cooperation and aesthetic sense.",
      scorpio: "Your career path involves transformation, investigation, and managing intense situations. You may work in psychology, research, finance, or any field dealing with crisis and renewal.",
      sagittarius: "Your career path involves teaching, travel, and philosophical pursuits. You may work in education, publishing, international business, or any field that expands horizons.",
      capricorn: "This is the natural sign for the 10th house. Your career path involves authority, structure, and long-term achievement. You naturally rise to positions of responsibility and respect.",
      aquarius: "Your career path involves innovation, technology, and humanitarian service. You may work in progressive fields or any area that benefits society through original thinking.",
      pisces: "Your career path involves compassion, artistry, and spiritual service. You may work in healthcare, arts, or charitable organizations where you can serve others through empathy."
    },
    11: {
      aries: "Your approach to friendships and groups is independent and leadership-oriented. You may start groups or organizations and prefer friends who share your pioneering spirit.",
      taurus: "Your approach to friendships is steady and loyal. You prefer long-term friendships and may be involved in groups related to finance, arts, or material security.",
      gemini: "Your approach to friendships is intellectual and communicative. You may have many acquaintances and be involved in educational or communication-oriented groups.",
      cancer: "Your approach to friendships is nurturing and family-like. You prefer close, emotionally supportive friendships and may be involved in groups that feel like extended family.",
      leo: "Your approach to friendships is generous and dramatic. You may be the center of your social circle and prefer friends who appreciate your creativity and leadership.",
      virgo: "Your approach to friendships is helpful and practical. You prefer friends who share your desire for improvement and may be involved in service-oriented groups.",
      libra: "Your approach to friendships is harmonious and cooperative. You prefer balanced friendships and may be involved in groups focused on beauty, justice, or social cooperation.",
      scorpio: "Your approach to friendships is intense and selective. You prefer deep, transformative friendships and may be involved in groups dealing with psychology or transformation.",
      sagittarius: "Your approach to friendships is optimistic and adventurous. You prefer friends who share your love of learning and may be involved in educational or philosophical groups.",
      capricorn: "Your approach to friendships is serious and goal-oriented. You prefer established, successful friends and may be involved in professional or achievement-oriented groups.",
      aquarius: "This is the natural sign for the 11th house. Your approach to friendships is humanitarian and progressive. You naturally connect with groups working for social change and human advancement.",
      pisces: "Your approach to friendships is compassionate and spiritual. You prefer empathetic friends and may be involved in charitable or artistic groups."
    },
    12: {
      aries: "Your subconscious motivations involve independence and leadership. You may work behind the scenes in pioneering or competitive fields. Hidden enemies may be aggressive or impulsive.",
      taurus: "Your subconscious motivations involve security and material comfort. You may work behind the scenes in financial or artistic fields. You find spiritual peace through nature and beauty.",
      gemini: "Your subconscious motivations involve communication and learning. You may work behind the scenes in education or media. Your spiritual development involves intellectual understanding.",
      cancer: "Your subconscious motivations involve nurturing and emotional security. You may work behind the scenes in healthcare or family services. You find spiritual peace through emotional healing.",
      leo: "Your subconscious motivations involve creativity and recognition. You may work behind the scenes in entertainment or education. Your spiritual development involves creative self-expression.",
      virgo: "Your subconscious motivations involve service and perfection. You may work behind the scenes in healthcare or analytical fields. Your spiritual development involves practical service.",
      libra: "Your subconscious motivations involve harmony and partnership. You may work behind the scenes in law or artistic fields. Your spiritual development involves creating balance.",
      scorpio: "Your subconscious motivations involve transformation and depth. You may work behind the scenes in psychological or investigative fields. Your spiritual development involves facing the shadow.",
      sagittarius: "Your subconscious motivations involve wisdom and freedom. You may work behind the scenes in education or spiritual fields. Your spiritual development involves philosophical understanding.",
      capricorn: "Your subconscious motivations involve authority and structure. You may work behind the scenes in government or traditional institutions. Your spiritual development involves disciplined practice.",
      aquarius: "Your subconscious motivations involve humanitarian service and innovation. You may work behind the scenes in progressive organizations. Your spiritual development involves serving humanity.",
      pisces: "This is the natural sign for the 12th house. Your subconscious motivations naturally involve compassion and spiritual service. You may work in institutions helping others heal and find peace."
    }
  };

  const interpretations = houseCuspInterpretations[house];
  if (interpretations && interpretations[sign.toLowerCase()]) {
    return interpretations[sign.toLowerCase()];
  }

  return `${signName} on the ${house}th house cusp brings the qualities of this sign to matters related to this life area.`;
};