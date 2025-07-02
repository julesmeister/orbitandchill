/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Money Blocks Interpretations
 * 
 * Detailed interpretations for how each Major Arcana (1-22) creates
 * financial obstacles, limitations, and blocks around money flow.
 */

export interface MatrixInterpretation {
  general: string;
  positive: string;
  challenge: string;
  advice: string;
}

export interface MatrixAspectInterpretations {
  [arcanaNumber: number]: MatrixInterpretation;
}

/**
 * Money Blocks - Financial obstacles and limitations based on each arcana
 */
export const moneyBlocksInterpretations: MatrixAspectInterpretations = {
  1: {
    general: "Your money blocks stem from excessive independence and the belief that you must do everything alone to prove your worth. You may sabotage financial partnerships or refuse help that could accelerate your success because accepting support feels like weakness. This creates unnecessary struggle and limits your income potential by cutting you off from collaborative opportunities.",
    positive: "Recognizing this pattern allows you to maintain your natural leadership while learning to delegate and accept support. You can transform your drive for independence into healthy self-reliance that includes strategic partnerships. Your pioneering spirit becomes more effective when balanced with teamwork.",
    challenge: "Stubborn refusal to consider other perspectives or methods, even when your current approach isn't working financially. Tendency to burn out from overwork because you won't delegate or ask for help. May start multiple projects without finishing them due to impatience with the process.",
    advice: "Learn that accepting help and collaboration actually demonstrates strong leadership rather than weakness. Focus your powerful energy on completing one major financial goal before starting new ventures. Practice delegating tasks that others can do while you focus on high-level strategy and vision."
  },
  2: {
    general: "Your money blocks come from undervaluing your intuitive gifts and constantly doubting your inner wisdom about financial decisions. You may give away your services for free or charge far less than you're worth because you don't fully trust the value of your spiritual or healing abilities. This self-doubt creates a cycle of financial insecurity that contradicts your natural abundance.",
    positive: "Learning to trust and properly value your intuitive gifts can transform your relationship with money completely. You begin to see your sensitivity and healing abilities as valuable assets rather than impractical traits. Your financial flow improves dramatically when you honor both your spiritual nature and material needs.",
    challenge: "Chronic undercharging for services because you feel guilty about making money from spiritual or healing work. Passive approach to money that relies on others to recognize your value rather than advocating for yourself. May sabotage opportunities because deep down you don't believe you deserve abundance.",
    advice: "Research what others in your field charge and price your services accordingly, remembering that people value what they pay for. Trust your intuition about financial opportunities while also developing practical money management skills. Set clear boundaries around your time and energy to prevent giving away too much for free."
  },
  3: {
    general: "Your money blocks manifest as creative chaos where you start many projects but struggle to complete and monetize them effectively. You may also have boundary issues around money, constantly helping others financially while neglecting your own financial health. The abundance you naturally attract gets scattered across too many directions without focused financial planning.",
    positive: "Once you learn to focus your creative energy and establish healthy financial boundaries, your natural magnetism for abundance can create multiple successful income streams. You develop the business skills needed to monetize your creativity effectively while maintaining your generous spirit in sustainable ways.",
    challenge: "Tendency to overspend on others or give away creative work for free, especially to family and friends. Scattered focus leads to many unfinished projects with no income generation. Avoid dealing with the business side of creativity, preferring pure creative expression over marketing and sales.",
    advice: "Complete and monetize existing projects before starting new ones, focusing on sustainable income from your creative gifts. Set clear boundaries around your generosity, creating systems that allow you to help others while maintaining your financial health. Develop business skills or partner with someone who can handle the commercial aspects of your work."
  },
  4: {
    general: "Your money blocks come from excessive financial conservatism and fear of any risk that could destabilize your security. You may hoard money or miss profitable opportunities due to paralyzing fear of loss. This over-attachment to financial security actually limits your wealth-building potential by preventing necessary growth and adaptation.",
    positive: "Learning to balance security with calculated risks allows you to build wealth more effectively while maintaining your natural stability. You develop the confidence to take strategic chances that align with your long-term financial goals. Your methodical approach becomes more dynamic and responsive to opportunities.",
    challenge: "Paralyzed by fear of financial loss, missing profitable opportunities due to excessive caution. Rigid adherence to outdated financial methods that no longer serve your growth. May accumulate money but struggle to invest or use it to create more wealth.",
    advice: "Gradually expand your comfort zone by taking small, calculated risks that could increase your income potential. Research new opportunities thoroughly before making changes, allowing you to adapt while maintaining security. Set aside a small portion of your income for higher-risk investments while keeping your foundation stable."
  },
  5: {
    general: "Your money blocks stem from rigid adherence to traditional financial paths even when they're no longer serving your highest potential. You may limit yourself to 'respectable' careers that provide security but don't utilize your full abilities or earning potential. Fear of judgment keeps you trapped in conventional approaches that feel safe but limiting.",
    positive: "Honoring tradition while remaining open to innovation allows you to build on proven methods while adapting to new opportunities. You learn to evaluate financial decisions based on merit rather than just conventional acceptance. Your respect for established wisdom becomes a foundation for intelligent evolution.",
    challenge: "Resistance to unconventional income opportunities, even when they could be highly profitable and aligned with your values. Over-dependence on external validation for financial decisions rather than trusting your own judgment. Limited by traditional thinking about career paths and money-making methods.",
    advice: "Question whether traditional financial paths still serve your highest good and be willing to adapt when necessary. Stay informed about changes in your field and explore how your traditional knowledge might be valuable in new markets. Seek mentors who have successfully navigated both traditional and innovative approaches to wealth building."
  },
  6: {
    general: "Your money blocks manifest through people-pleasing and difficulty setting financial boundaries, leading to chronic undercharging or making unprofitable agreements to maintain harmony. You may financially enable others or become overly dependent on partners for security. The desire to be liked can override sound financial judgment and prevent necessary money conversations.",
    positive: "Learning to balance your natural desire for harmony with healthy financial boundaries creates more sustainable and profitable relationships. You discover that fair financial arrangements actually strengthen relationships rather than damaging them. Your collaborative nature becomes an asset when balanced with self-advocacy.",
    challenge: "Chronic undercharging to avoid conflict or seem 'nice,' leading to financial stress and resentment. Financial decisions overly influenced by emotions or desire to please others. Avoiding necessary money conversations that could resolve issues and improve financial situations.",
    advice: "Practice having direct conversations about money, recognizing that clarity serves everyone better than avoiding difficult topics. Set fair prices for your services and stick to them, understanding that undercharging doesn't actually help anyone. Choose business partners who respect your need for balanced, mutually beneficial financial arrangements."
  },
  7: {
    general: "Your money blocks come from impatience and the tendency to rush financial decisions without adequate planning or research. You may experience feast-or-famine cycles due to inconsistent action or pushing too hard in ways that aren't sustainable. The desire for quick results can lead to poor judgment and avoidable financial mistakes.",
    positive: "Channeling your natural drive into consistent, strategic action creates more stable and sustainable wealth building. You learn to balance urgency with patience, taking decisive action based on solid planning. Your determination becomes a powerful asset when directed toward long-term financial goals.",
    challenge: "Impulsive financial decisions made without adequate research or planning, leading to avoidable losses. Inconsistent income due to feast-or-famine cycles of intense activity followed by burnout or distraction. May exhaust yourself and others with unsustainable approaches to money-making.",
    advice: "Create systems that smooth out income fluctuations and require you to pause before making major financial decisions. Develop sustainable business practices that allow for consistent action over time rather than sporadic intense efforts. Balance your aggressive pursuit of opportunities with careful planning and risk assessment."
  },
  8: {
    general: "Your money blocks stem from chronic undervaluing of your gentle strength and patient approach, leading to accepting less money than you deserve. You may avoid financial confrontation even when necessary, allowing others to take advantage of your accommodating nature. Self-doubt about your abilities prevents you from charging appropriately for your valuable services.",
    positive: "Recognizing the true value of your patient, healing presence allows you to charge appropriately and attract clients who appreciate your unique gifts. You develop the confidence to set boundaries and standards for how you expect to be treated financially. Your gentle strength becomes a powerful differentiator in the marketplace.",
    challenge: "Consistently undercharging because you don't recognize the full value of your patient, healing approach. Taking too long to act on time-sensitive opportunities due to over-deliberation. Allowing difficult clients to take advantage of your patient, accommodating nature.",
    advice: "Research what others with your skills and experience charge, and price your services accordingly. Set clear boundaries about how you expect to be treated and compensated for your work. Trust in your unique abilities and the value they provide, even when others don't immediately recognize it."
  },
  9: {
    general: "Your money blocks come from isolation and the tendency to give away your wisdom freely without recognizing its financial value. You may retreat from the marketplace or avoid actively promoting your services, believing that the right people will find you. This passive approach limits your income potential despite having valuable knowledge that others need and would pay for.",
    positive: "Learning to actively share and monetize your wisdom while maintaining your depth and integrity creates sustainable income aligned with your nature. You develop systems for reaching more people with your insights without compromising your need for solitude. Your knowledge becomes a valuable service that people appreciate paying for.",
    challenge: "Giving away valuable knowledge and insights for free, not recognizing their monetary worth. Isolation from profitable opportunities due to spending too much time in solitude or reflection. Being too selective about clients or opportunities, severely limiting income potential.",
    advice: "Actively market your wisdom through multiple channels like writing, speaking, or online courses to reach people who need your guidance. Value your knowledge appropriately and charge fair prices, remembering that people often value what they pay for more than what they receive for free. Balance solitude with regular engagement in the marketplace."
  },
  10: {
    general: "Your money blocks manifest as over-reliance on luck and external circumstances rather than taking consistent action to influence your financial outcomes. You may become fatalistic about money, believing everything is predetermined and missing opportunities to actively improve your situation. Inconsistent income patterns make financial planning difficult and create unnecessary stress.",
    positive: "Learning to combine your natural timing ability with consistent action and planning creates more stable financial results while still honoring cyclical patterns. You develop the wisdom to know when to act and when to wait, while taking responsibility for your financial outcomes. Your understanding of cycles becomes a valuable asset for investment and business timing.",
    challenge: "Relying too heavily on luck or fate rather than taking consistent action to generate income. Unpredictable income patterns that make financial planning and stability difficult. Becoming passive about financial opportunities, waiting for external circumstances to change rather than taking initiative.",
    advice: "Create financial buffers during high-income periods to carry you through leaner times, smoothing out the natural cycles. Combine your intuitive timing ability with consistent daily actions that move you toward your financial goals. Take responsibility for your financial outcomes while working skillfully with natural timing and cycles."
  },
  11: {
    general: "Your money blocks stem from perfectionism and over-analysis that leads to missed opportunities due to slow decision-making. You may be too rigid about 'fair' pricing, either undercharging to avoid seeming greedy or losing opportunities because you won't compromise your idealistic standards. Judgment of others' business practices limits potential partnerships and growth.",
    positive: "Learning to make faster decisions within your ethical framework while maintaining your integrity creates more opportunities without compromising your values. You develop flexible approaches to fairness that serve both your ideals and practical business needs. Your high standards become an asset rather than a limitation.",
    challenge: "Paralyzed by trying to make the 'perfect' or most 'fair' decision, missing time-sensitive opportunities. Being too rigid about pricing or business practices, limiting flexibility and growth potential. Judging others' approaches harshly, which prevents learning and collaboration.",
    advice: "Establish clear ethical guidelines in advance that can guide quick decision-making in specific situations. Learn that fair pricing serves both you and your clients better than undercharging out of guilt. Remain open to learning from others who may have different but still ethical approaches to business."
  },
  12: {
    general: "Your money blocks come from martyrdom and the tendency to sacrifice your financial well-being for others without ensuring adequate compensation for your efforts. You may wait too long for opportunities to come to you rather than actively pursuing them. Unconventional thinking, while valuable, may lack practical implementation strategies that could generate actual income.",
    positive: "Learning to balance your willingness to serve with healthy financial boundaries creates sustainable abundance that allows you to help more people. You develop practical skills to implement your unique insights profitably. Your unconventional perspective becomes a valuable asset when combined with business acumen.",
    challenge: "Chronic financial sacrifice for others without ensuring your own needs are met, leading to resentment and depletion. Waiting too long for opportunities rather than actively pursuing them. Unique insights that lack practical implementation strategies for income generation.",
    advice: "Set clear boundaries around your willingness to sacrifice, ensuring that your giving serves a higher purpose rather than enabling others' irresponsibility. Sometimes taking action is more effective than waiting for the perfect opportunity to appear. Develop practical business skills to implement your unique perspective profitably."
  },
  13: {
    general: "Your money blocks involve resistance to necessary financial changes and holding onto outdated income strategies that no longer serve your growth. You may fear the financial uncertainty that comes with transformation, even when change would ultimately improve your situation. This resistance keeps you stuck in limiting financial patterns that need to be released.",
    positive: "Embracing financial transformation as a natural part of growth allows you to release what no longer serves and welcome new abundance. You develop comfort with financial uncertainty as a temporary state that leads to greater opportunities. Your ability to help others through change becomes a valuable service.",
    challenge: "Resistance to necessary financial changes, even when transformation would be beneficial for long-term prosperity. Fear of financial uncertainty that prevents taking necessary risks or making needed changes. Clinging to outdated income strategies that no longer serve your growth.",
    advice: "Embrace financial transformation as your natural path to greater abundance, recognizing that resistance to change often creates more suffering than the change itself. Develop multiple income streams to reduce fear about changing any single source. Trust that your ability to navigate change is actually a valuable skill that can generate income."
  },
  14: {
    general: "Your money blocks manifest as excessive conservatism and avoidance of necessary financial risks that could accelerate your growth. You may get stuck in moderate approaches that feel safe but limit your potential for significant wealth building. The desire to maintain balance can become an excuse for avoiding challenges that would expand your financial capacity.",
    positive: "Learning when to take calculated risks while maintaining your natural stability creates opportunities for growth without sacrificing security. You develop the wisdom to know when balance requires temporary imbalance for long-term gain. Your moderate approach becomes more dynamic and responsive to opportunities.",
    challenge: "Avoiding necessary financial risks or changes due to excessive desire for balance and moderation. Becoming stuck in 'safe' approaches that limit growth potential and wealth-building capacity. Using the need for balance as an excuse to avoid challenging but profitable opportunities.",
    advice: "Recognize that sometimes taking calculated risks is necessary for financial growth and long-term balance. Use your gift for moderation to evaluate opportunities carefully rather than automatically avoiding them. Trust that your natural ability to find equilibrium will help you navigate temporary imbalances that lead to greater stability."
  },
  15: {
    general: "Your money blocks involve becoming trapped by material obsession or making financial decisions based on greed and fear rather than wisdom. You may compromise your values for money or become so focused on accumulation that you neglect other important life areas. This creates a cycle where money controls you rather than serving your highest good.",
    positive: "Learning to pursue wealth without losing your freedom or integrity allows you to create abundant prosperity that serves your highest good. You develop the discipline to maintain ethical boundaries regardless of financial temptation. Your material understanding becomes a tool for conscious wealth building rather than unconscious accumulation.",
    challenge: "Obsessive focus on money and material accumulation at the expense of health, relationships, and personal fulfillment. Making financial decisions based on greed or fear rather than wisdom and values. Ethical compromises in pursuit of profit that ultimately damage reputation and long-term success.",
    advice: "Maintain clear ethical boundaries that you won't cross regardless of financial incentive, remembering that integrity is your most valuable asset. Use your natural intensity and material understanding to create abundance that serves others as well as yourself. Regular reflection and spiritual practice can help maintain proper perspective on money's role in your life."
  },
  16: {
    general: "Your money blocks involve financial instability and dramatic swings between abundance and scarcity that create ongoing stress and uncertainty. You may make sudden, poorly considered financial decisions that have long-term negative consequences. Resistance to necessary change can build pressure until financial structures collapse suddenly rather than evolving gradually.",
    positive: "Learning to channel your innovative energy constructively rather than destructively creates opportunities for breakthrough financial success. You develop the ability to recognize when financial structures need updating before they collapse. Your adaptability becomes an asset during times of economic change and uncertainty.",
    challenge: "Unstable income patterns with sudden financial shocks that make planning difficult and create ongoing stress. Making impulsive financial decisions without considering long-term consequences. Allowing financial pressure to build until dramatic changes become necessary rather than making gradual adjustments.",
    advice: "Build emergency funds and financial buffers to weather sudden changes and take advantage of unexpected opportunities. Develop multiple income streams to reduce dependence on any single source that might be disrupted. Address financial issues early through gradual changes rather than waiting for crisis situations."
  },
  17: {
    general: "Your money blocks stem from unrealistic optimism and naive expectations about how money flows, leading to poor planning and disappointing results. You may trust others too easily in financial matters or make decisions based on wishful thinking rather than realistic assessment. This idealism can prevent you from taking necessary practical steps toward financial security.",
    positive: "Grounding your natural optimism in realistic planning and practical action creates opportunities for genuine financial success while maintaining your hopeful perspective. You learn to trust wisely rather than naively. Your positive expectations become self-fulfilling when combined with strategic action.",
    challenge: "Unrealistic financial expectations that lead to disappointment and poor decision-making based on overly optimistic projections. Naive trust in others' financial promises or schemes without adequate verification. Avoiding practical financial planning in favor of hoping everything will work out magically.",
    advice: "Combine your natural optimism with realistic financial planning and concrete action steps toward your goals. Research opportunities thoroughly and verify others' claims before making financial commitments. Ground your hope in practical strategies while maintaining faith in positive outcomes."
  },
  18: {
    general: "Your money blocks involve financial confusion and difficulty distinguishing between genuine opportunities and illusions or scams. You may be deceived by others who take advantage of your trusting nature, or deceive yourself about unrealistic financial possibilities. Lack of clarity around money creates a pattern of poor decisions and missed opportunities.",
    positive: "Developing discernment to distinguish between genuine intuition and wishful thinking creates clearer financial direction and better outcomes. You learn to verify information carefully while still trusting your deeper knowing. Your intuitive abilities become reliable guides when properly developed and tested.",
    challenge: "Chronic financial confusion with difficulty making clear decisions about money and opportunities. Susceptibility to financial deception from others or self-deception about unrealistic possibilities. Unclear financial goals and direction that prevent focused action toward wealth building.",
    advice: "Develop systems for testing and validating your financial intuitions before acting on them, seeking practical guidance when needed. Learn to distinguish between genuine psychic impressions and emotional reactions or fears. Create clear financial goals and plans to provide direction for your intuitive insights."
  },
  19: {
    general: "Your money blocks come from taking abundance for granted and lacking financial discipline because money flows relatively easily to your positive energy. You may overspend on pleasure or give too generously without ensuring your own financial security. Avoiding difficult financial realities in favor of staying positive can create problems that eventually demand attention.",
    positive: "Learning to appreciate and manage your natural abundance responsibly allows you to enjoy financial flow while building long-term security. You develop the discipline to address necessary financial challenges proactively. Your positive energy attracts opportunities while practical skills ensure they translate into lasting wealth.",
    challenge: "Taking financial abundance for granted without proper appreciation or management of money. Overspending on pleasure, entertainment, or generous gestures that aren't financially sustainable. Avoiding difficult financial decisions or shadows in favor of maintaining positive energy.",
    advice: "Develop financial discipline and long-term planning to match your natural ability to attract abundance. Address necessary financial challenges proactively rather than avoiding them in favor of staying positive. Appreciate your financial gifts by stewarding them wisely for both current enjoyment and future security."
  },
  20: {
    general: "Your money blocks involve difficulty monetizing your spiritual purpose, believing that meaningful work shouldn't be adequately compensated or that charging for spiritual services is somehow wrong. You may choose purpose over profit even when both are possible, limiting your ability to serve more people and fulfill your mission effectively.",
    positive: "Recognizing that being well-compensated for your purpose-driven work allows you to help more people and serve your mission more effectively. You develop business skills that support rather than compromise your spiritual values. Your authentic alignment attracts clients who appreciate and fairly compensate your transformational work.",
    challenge: "Undercharging for spiritual or purpose-driven work due to beliefs that meaningful service shouldn't be profitable. Difficulty balancing financial needs with spiritual values, creating artificial separation between purpose and prosperity. Idealistic expectations about how quickly purpose-driven work will generate adequate income.",
    advice: "Remember that being appropriately compensated for transformational work allows you to reach more people and serve your purpose more effectively. Develop business skills that align with your spiritual values rather than contradicting them. Price your services based on the value you provide rather than limiting beliefs about spiritual work and money."
  },
  21: {
    general: "Your money blocks involve complacency and resting on past financial achievements without continuing to grow or adapt to changing conditions. You may become overly attached to current success and resist new opportunities that could expand your wealth. The need for new challenges and growth becomes a block when you prefer to maintain familiar patterns.",
    positive: "Using your financial mastery as a foundation for continued growth and new challenges keeps your success dynamic and expanding. You learn to share your expertise in ways that generate additional income while helping others. Your willingness to evolve prevents stagnation and maintains momentum toward greater achievement.",
    challenge: "Complacency about continued financial growth due to satisfaction with current achievements. Resistance to new opportunities or methods that could expand wealth because they disrupt comfortable patterns. Becoming overly focused on maintaining current success rather than pursuing new challenges.",
    advice: "Set new meaningful financial goals that challenge you to continue growing rather than resting on past achievements. Use your mastery to help others succeed, which can create additional income streams and prevent stagnation. Stay curious about new opportunities even when your current situation feels successful and secure."
  },
  22: {
    general: "Your money blocks stem from financial naivety and tendency to make impractical decisions based on enthusiasm rather than realistic assessment. You may fall for get-rich-quick schemes or trust others too easily in financial matters. Lack of practical skills and discipline can prevent you from sustaining any financial success you manage to create through your natural optimism and fresh thinking.",
    positive: "Combining your fresh perspective and unlimited potential with practical financial education and guidance creates powerful opportunities for breakthrough success. You learn to balance enthusiasm with realistic planning. Your willingness to try new approaches becomes an asset when supported by solid business fundamentals.",
    challenge: "Financial naivety that leads to poor decisions, scams, or unrealistic expectations about quick or easy money. Impractical financial choices based on enthusiasm without adequate analysis or planning. Lacking the discipline and practical skills needed to sustain and manage financial success.",
    advice: "Seek guidance from experienced mentors who can help you avoid common financial pitfalls while maintaining your fresh perspective. Develop practical money management skills and systems to support your natural optimism and willingness to try new approaches. Balance enthusiasm for opportunities with realistic planning and risk assessment."
  }
};