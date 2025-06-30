/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { HoraryQuestion } from "@/store/horaryStore";
import {
  ESSENTIAL_DIGNITY_TABLE,
  calculateEssentialDignity,
  calculateAlmuten,
  getDispositor,
  analyzeContradictions,
  contextualDignityInterpretation,
  getDignityStrengthDescription,
  comparePlanetaryStrengths,
  isDay,
} from "@/utils/horary/essentialDignityInterpretations";
import {
  getStrengthStyle,
  DIGNITY_COLORS,
  CONFIDENCE_COLORS,
  INFO_BOX_COLORS,
  ASPECT_TYPE_COLORS,
  getAspectTypeStyle,
  getStrengthAssessmentStyle,
  getDignityBadgeStyle
} from "@/utils/horary/colorConfigurations";
import {
  ColoredBox,
  Badge,
  StatCard,
  InfoBox,
  DignityBadge,
  SectionHeader,
  TabConfig,
} from "@/components/horary/common/HoraryComponents";
import SynapsasDropdown from "@/components/reusable/SynapsasDropdown";

interface EssentialDignityTabProps {
  chartData: any;
  analysisData: any;
  question: HoraryQuestion;
}

export default function EssentialDignityTab({
  chartData,
  analysisData,
  question,
}: EssentialDignityTabProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [selectedDegree, setSelectedDegree] = useState<string>("");
  const [activeSection, setActiveSection] = useState<
    "overview" | "analysis" | "almuten" | "context"
  >("overview");

  // Extract actual planetary positions from chart data
  const getPlanetaryPositions = () => {
    const positions: {
      [key: string]: { sign: string; degree: number; house: number };
    } = {};

    if (!chartData || !chartData.planets || !chartData.houses) {
      return positions;
    }

    // Helper to get sign from longitude
    const getSignFromLongitude = (longitude: number): string => {
      const signs = [
        "Aries",
        "Taurus",
        "Gemini",
        "Cancer",
        "Leo",
        "Virgo",
        "Libra",
        "Scorpio",
        "Sagittarius",
        "Capricorn",
        "Aquarius",
        "Pisces",
      ];
      const signIndex = Math.floor(longitude / 30);
      return signs[signIndex] || "Unknown";
    };

    // Helper to get degree within sign
    const getDegreeInSign = (longitude: number): number => {
      return longitude % 30;
    };

    // Helper to get house from longitude
    const getHouseFromLongitude = (longitude: number): number => {
      if (!chartData.houses || chartData.houses.length === 0) return 1;

      for (let i = 0; i < chartData.houses.length; i++) {
        const currentHouse = chartData.houses[i]?.cusp || i * 30;
        const nextHouse = chartData.houses[(i + 1) % 12]?.cusp || (i + 1) * 30;

        if (currentHouse <= nextHouse) {
          if (longitude >= currentHouse && longitude < nextHouse) {
            return i + 1;
          }
        } else {
          // Handle wraparound at 360°
          if (longitude >= currentHouse || longitude < nextHouse) {
            return i + 1;
          }
        }
      }
      return 1; // Default to first house
    };

    // Process planets - handle both array and object formats
    if (Array.isArray(chartData.planets)) {
      chartData.planets.forEach((planet: any) => {
        if (planet.name && planet.longitude !== undefined) {
          const capitalizedName =
            planet.name.charAt(0).toUpperCase() + planet.name.slice(1);
          positions[capitalizedName] = {
            sign: getSignFromLongitude(planet.longitude),
            degree: getDegreeInSign(planet.longitude),
            house: planet.house || getHouseFromLongitude(planet.longitude),
          };
        }
      });
    } else if (typeof chartData.planets === "object") {
      Object.entries(chartData.planets).forEach(([name, data]) => {
        let longitude: number | undefined;
        let house: number | undefined;

        if (data && typeof data === "object" && "longitude" in data) {
          longitude = (data as any).longitude;
          house = (data as any).house;
        } else if (typeof data === "number") {
          // If data is just a longitude number
          longitude = data;
        }

        if (longitude !== undefined) {
          const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
          positions[capitalizedName] = {
            sign: getSignFromLongitude(longitude),
            degree: getDegreeInSign(longitude),
            house: house || getHouseFromLongitude(longitude),
          };
        }
      });
    }

    return positions;
  };

  const planetaryPositions = getPlanetaryPositions();

  // Determine if day or night chart
  const sunData = planetaryPositions.Sun || { house: 1 };
  const isDayChart = isDay(sunData.house);

  // Calculate dignities for all planets
  const planetaryDignities = Object.entries(planetaryPositions).map(
    ([planet, pos]) =>
      calculateEssentialDignity(planet, pos.sign, pos.degree, isDayChart)
  );

  // Sort by strength
  const sortedDignities = comparePlanetaryStrengths(planetaryDignities);

  const SectionHeader = ({
    icon,
    title,
    size = "lg",
  }: {
    icon: string;
    title: string;
    size?: "sm" | "lg";
  }) => (
    <div className="flex items-center mb-6">
      <div
        className={`${
          size === "lg" ? "w-16 h-16" : "w-12 h-12"
        } bg-black flex items-center justify-center mr-4`}
      >
        <span
          className={`text-white ${size === "lg" ? "text-2xl" : "text-lg"}`}
        >
          {icon}
        </span>
      </div>
      <div>
        <h4 className="font-space-grotesk font-bold text-black text-xl">
          {title}
        </h4>
        <div
          className={`${size === "lg" ? "w-16" : "w-24"} h-0.5 bg-black mt-1`}
        ></div>
      </div>
    </div>
  );

  const DignityCard = ({ dignity, rank }: { dignity: any; rank: number }) => {
    const strengthInfo = getDignityStrengthDescription(
      dignity.overallAssessment
    );
    const contextual = contextualDignityInterpretation(
      dignity,
      question.question
    );
    const contradictions = analyzeContradictions(dignity);

    return (
      <div
        className={`border border-black p-4 cursor-pointer transition-all duration-200 ${
          selectedPlanet === dignity.planet
            ? `${getAspectTypeStyle('neutral').badge.replace('border-black', 'border-2')}`
            : "bg-white hover:bg-gray-50"
        }`}
        onClick={() => setSelectedPlanet(dignity.planet)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="font-space-grotesk font-bold text-lg mr-2">
              {dignity.planet}
            </span>
            <span className="text-sm text-gray-600">#{rank}</span>
          </div>
          <Badge
            label={strengthInfo.label}
            backgroundColor={getStrengthAssessmentStyle(strengthInfo.label).backgroundColor}
            textColor={getStrengthAssessmentStyle(strengthInfo.label).color}
          />
        </div>

        <div className="text-sm mb-2">
          <span className="font-bold">{dignity.sign}</span>{" "}
          {Math.floor(dignity.degree)}°
          {String(Math.floor((dignity.degree % 1) * 60)).padStart(2, "0")}'
        </div>

        <div className="text-xs text-gray-700 mb-2">
          Score: {dignity.strengthScore} |{" "}
          {dignity.contextualMeaning.split("-")[0]}
        </div>

        <div className="space-y-1">
          {dignity.dignities.ruler && (
            <Badge 
              label="Ruler" 
              backgroundColor={getDignityBadgeStyle('ruler').backgroundColor}
              textColor={getDignityBadgeStyle('ruler').textColor}
            />
          )}
          {dignity.dignities.exaltation && (
            <Badge
              label="Exaltation"
              backgroundColor={getDignityBadgeStyle('exaltation').backgroundColor}
              textColor={getDignityBadgeStyle('exaltation').textColor}
            />
          )}
          {dignity.dignities.triplicity && (
            <Badge
              label="Triplicity"
              backgroundColor={getDignityBadgeStyle('triplicity').backgroundColor}
              textColor={getDignityBadgeStyle('triplicity').textColor}
            />
          )}
          {dignity.debilities.detriment && (
            <Badge
              label="Detriment"
              backgroundColor={getDignityBadgeStyle('detriment').backgroundColor}
              textColor={getDignityBadgeStyle('detriment').textColor}
            />
          )}
          {dignity.debilities.fall && (
            <Badge 
              label="Fall" 
              backgroundColor={getDignityBadgeStyle('fall').backgroundColor}
              textColor={getDignityBadgeStyle('fall').textColor}
            />
          )}
          {dignity.debilities.peregrine && (
            <Badge
              label="Peregrine"
              backgroundColor={getDignityBadgeStyle('peregrine').backgroundColor}
              textColor={getDignityBadgeStyle('peregrine').textColor}
            />
          )}
        </div>

        {contradictions.hasContradictions && (
          <div className="text-xs mt-1" style={{ color: getAspectTypeStyle('medium').text }}>
            ⚠ Mixed dignities
          </div>
        )}
      </div>
    );
  };

  const PlanetDetailPanel = ({ planet }: { planet: string }) => {
    const dignity = planetaryDignities.find((d) => d.planet === planet);
    if (!dignity) return null;

    const strengthInfo = getDignityStrengthDescription(
      dignity.overallAssessment
    );
    const contextual = contextualDignityInterpretation(
      dignity,
      question.question
    );
    const contradictions = analyzeContradictions(dignity);
    const dispositor = getDispositor(dignity.sign);

    return (
      <div className="bg-white border border-black p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h3 className="font-space-grotesk font-bold text-2xl mr-4">
              {planet}
            </h3>
            <div
              className="px-3 py-1 border border-black"
              style={getStrengthAssessmentStyle(strengthInfo.label)}
            >
              {strengthInfo.label}
            </div>
          </div>
          <button
            onClick={() => setSelectedPlanet(null)}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-space-grotesk font-bold mb-3">
              Position & Basic Info
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Sign:</strong> {dignity.sign}
              </div>
              <div>
                <strong>Degree:</strong> {Math.floor(dignity.degree)}°
                {String(Math.floor((dignity.degree % 1) * 60)).padStart(2, "0")}
                '
              </div>
              <div>
                <strong>Dispositor:</strong> {dispositor}
              </div>
              <div>
                <strong>Strength Score:</strong> {dignity.strengthScore}/15
              </div>
              <div>
                <strong>Chart Type:</strong> {isDayChart ? "Day" : "Night"}
              </div>
            </div>

            <h4 className="font-space-grotesk font-bold mb-3 mt-6">
              Dignities
            </h4>
            <div className="space-y-1 text-sm">
              {dignity.dignities.ruler && (
                <DignityBadge
                  type="Ruler"
                  backgroundColor={getDignityBadgeStyle('ruler').backgroundColor}
                  textColor={getDignityBadgeStyle('ruler').textColor}
                  score="+5"
                />
              )}
              {dignity.dignities.exaltation && (
                <DignityBadge
                  type="Exaltation"
                  backgroundColor={getDignityBadgeStyle('exaltation').backgroundColor}
                  textColor={getDignityBadgeStyle('exaltation').textColor}
                  score="+4"
                />
              )}
              {dignity.dignities.exaltationDegree && (
                <div className="text-xs ml-5" style={{ color: "#6bdbff" }}>
                  Super-exalted at exact degree!
                </div>
              )}
              {dignity.dignities.triplicity && (
                <DignityBadge
                  type="Triplicity"
                  backgroundColor={getDignityBadgeStyle('triplicity').backgroundColor}
                  textColor={getDignityBadgeStyle('triplicity').textColor}
                  score="+3"
                />
              )}
              {dignity.dignities.term && (
                <DignityBadge
                  type="Term"
                  backgroundColor={getDignityBadgeStyle('term').backgroundColor}
                  textColor={getDignityBadgeStyle('term').textColor}
                  score="+2"
                />
              )}
              {dignity.dignities.face && (
                <DignityBadge
                  type="Face"
                  backgroundColor={getDignityBadgeStyle('face').backgroundColor}
                  textColor={getDignityBadgeStyle('face').textColor}
                  score="+1"
                />
              )}
            </div>

            <h4 className="font-space-grotesk font-bold mb-3 mt-6">
              Debilities
            </h4>
            <div className="space-y-1 text-sm">
              {dignity.debilities.detriment && (
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded mr-2"></span>
                  Detriment
                </div>
              )}
              {dignity.debilities.fall && (
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-orange-500 rounded mr-2"></span>
                  Fall
                </div>
              )}
              {dignity.debilities.fallDegree && (
                <div className="text-xs text-orange-600 ml-5">
                  Super-debilitated at exact degree!
                </div>
              )}
              {dignity.debilities.peregrine && (
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-gray-500 rounded mr-2"></span>
                  Peregrine
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-space-grotesk font-bold mb-3">
              Interpretation
            </h4>
            <InfoBox
              title="General Meaning:"
              content={dignity.contextualMeaning}
              backgroundColor="#01bbf9"
              textColor="white"
              className="p-4 mb-4"
            />

            <InfoBox
              title="Strength Description:"
              content={strengthInfo.description}
              backgroundColor="#f5f5f5"
              className="p-4 mb-4"
            />

            {contextual.overrides.length > 0 && (
              <ColoredBox
                backgroundColor="#f2e356"
                textColor="black"
                className="p-4 mb-4"
              >
                <div className="font-bold text-sm mb-2">Context Overrides:</div>
                {contextual.overrides.map((override, index) => (
                  <div key={index} className="text-sm">
                    {override}
                  </div>
                ))}
              </ColoredBox>
            )}

            <ColoredBox 
              backgroundColor={getAspectTypeStyle('harmonious').text} 
              textColor="white" 
              className="p-4"
            >
              <div className="font-bold text-sm mb-2">For This Question:</div>
              <div className="text-sm">{contextual.interpretation}</div>
              <div className="text-xs mt-2">
                <Badge
                  label={`${contextual.confidence} confidence`}
                  backgroundColor={
                    contextual.confidence === 'high' ? getAspectTypeStyle('high').background :
                    contextual.confidence === 'medium' ? getAspectTypeStyle('medium').background :
                    getAspectTypeStyle('low').background
                  }
                  textColor={
                    contextual.confidence === 'high' ? getAspectTypeStyle('high').text :
                    contextual.confidence === 'medium' ? getAspectTypeStyle('medium').text :
                    getAspectTypeStyle('low').text
                  }
                />
              </div>
            </ColoredBox>
          </div>
        </div>

        {contradictions.hasContradictions && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-space-grotesk font-bold mb-3">
              Contradictions Analysis
            </h4>
            <ColoredBox
              backgroundColor="#f0e3ff"
              textColor="black"
              className="p-4"
            >
              <div className="font-bold text-sm mb-2">
                Mixed Dignities Found:
              </div>
              <ul className="text-sm space-y-1">
                {contradictions.contradictions.map((contradiction, index) => (
                  <li key={index}>• {contradiction}</li>
                ))}
              </ul>
              <div className="text-sm mt-3">
                <strong>Interpretation:</strong> {contradictions.interpretation}
              </div>
            </ColoredBox>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-space-grotesk font-bold mb-3">
            Descriptive Qualities
          </h4>
          <div className="flex flex-wrap gap-2">
            {dignity.descriptiveQualities.map((quality, index) => (
              <span
                key={index}
                className="text-xs bg-gray-200 px-2 py-1 rounded"
              >
                {quality}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const AlmutenSection = () => {
    const [almutenSign, setAlmutenSign] = useState("Aries");
    const [almutenDegree, setAlmutenDegree] = useState(0);

    const almutenResult = calculateAlmuten(
      almutenSign,
      almutenDegree,
      isDayChart
    );

    return (
      <div className="space-y-6">
        <div className="bg-white border border-black p-6">
          <h3 className="font-space-grotesk font-bold text-xl mb-4">
            Almuten Calculator
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            The almuten is the planet with the most essential dignity in any
            given degree. Use this when you cannot use the house ruler as
            significator.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold mb-2">Sign:</label>
              <SynapsasDropdown
                options={ESSENTIAL_DIGNITY_TABLE.map((sign) => ({
                  value: sign.sign,
                  label: sign.sign,
                }))}
                value={almutenSign}
                onChange={setAlmutenSign}
                placeholder="Select a sign"
                variant="thin"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Degree:</label>
              <input
                type="number"
                min="0"
                max="29"
                step="0.1"
                value={almutenDegree}
                onChange={(e) =>
                  setAlmutenDegree(parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 font-medium text-base"
                style={{ borderRadius: 0 }}
              />
            </div>
          </div>

          <ColoredBox
            backgroundColor="#e3f2fd"
            textColor="black"
            borderColor="blue-200"
            className="p-4"
          >
            <div className="font-bold text-lg mb-2">
              Almuten of {Math.floor(almutenDegree)}°
              {String(Math.floor((almutenDegree % 1) * 60)).padStart(2, "0")}'{" "}
              {almutenSign}
            </div>
            <div
              className="text-2xl font-bold mb-2"
              style={{ color: "#1976d2" }}
            >
              {almutenResult.almuten}
            </div>
            <div className="text-sm">Strength Score: {almutenResult.score}</div>
          </ColoredBox>

          <div className="mt-4">
            <h4 className="font-bold mb-2">All Planetary Scores:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {almutenResult.competitors.map((comp) => (
                <div
                  key={comp.planet}
                  className={`p-2 border rounded text-center ${
                    comp.planet === almutenResult.almuten
                      ? "bg-blue-100 border-blue-300"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <div className="font-bold">{comp.planet}</div>
                  <div className="text-sm">{comp.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon="👑" title="Essential Dignity & Planetary Strength" />

      {/* Navigation tabs */}
      <div className="flex gap-2 mb-6">
        {(
          [
            { id: "overview", label: "Overview", icon: "📋" },
            { id: "analysis", label: "Analysis", icon: "🔍" },
            { id: "almuten", label: "Almuten", icon: "⚖️" },
            { id: "context", label: "Context", icon: "🎯" },
          ] as TabConfig[]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-4 py-2 font-space-grotesk font-bold text-sm transition-colors ${
              activeSection === tab.id
                ? "bg-black text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Planet detail panel */}
      {selectedPlanet && <PlanetDetailPanel planet={selectedPlanet} />}

      {/* Content sections */}
      {activeSection === "overview" && (
        <div className="space-y-6">
          {/* Chart type indicator */}
          <ColoredBox
            backgroundColor="#e3f2fd"
            textColor="black"
            borderColor="blue-200"
            className="p-4"
          >
            <h4 className="font-space-grotesk font-bold mb-2">
              {isDayChart ? "Day" : "Night"} Chart
            </h4>
            <p className="text-sm text-gray-700">
              Sun in house {sunData.house} - determines triplicity rulers.
              {isDayChart
                ? " Using day triplicity rulers."
                : " Using night triplicity rulers."}
            </p>
          </ColoredBox>

          {/* Strength ranking */}
          <div className="bg-white border border-black p-6">
            <h4 className="font-space-grotesk font-bold mb-4">
              Planetary Strength Ranking
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedDignities.map((dignity, index) => (
                <DignityCard
                  key={dignity.planet}
                  dignity={dignity}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>

          {/* Key principles */}
          <ColoredBox
            backgroundColor="#fffde7"
            textColor="black"
            borderColor="yellow-200"
            className="p-4"
          >
            <h4 className="font-space-grotesk font-bold mb-3">
              The Three Keys to Judgment
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              {[
                {
                  title: "Essential Dignity",
                  description: "Shows power to act",
                },
                { title: "Reception", description: "Shows inclination to act" },
                { title: "Aspect", description: "Shows occasion to act" },
              ].map((key, index) => (
                <div key={index}>
                  <div className="font-bold">{key.title}</div>
                  <div>{key.description}</div>
                </div>
              ))}
            </div>
          </ColoredBox>
        </div>
      )}

      {activeSection === "analysis" && (
        <div className="space-y-6">
          <div className="bg-white border border-black p-6">
            <h3 className="font-space-grotesk font-bold text-xl mb-4">
              Detailed Dignity Analysis
            </h3>

            {/* Summary stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <StatCard
                value={
                  sortedDignities.filter(
                    (d) =>
                      d.overallAssessment === "very strong" ||
                      d.overallAssessment === "strong"
                  ).length
                }
                label="Strong Planets"
                backgroundColor={getAspectTypeStyle('harmonious').text}
                textColor="white"
              />
              <StatCard
                value={
                  sortedDignities.filter(
                    (d) =>
                      d.overallAssessment === "very weak" ||
                      d.debilities.detriment ||
                      d.debilities.fall
                  ).length
                }
                label="Debilitated"
                backgroundColor={getAspectTypeStyle('challenging').text}
                textColor="white"
              />
              <StatCard
                value={
                  sortedDignities.filter((d) => d.debilities.peregrine).length
                }
                label="Peregrine"
                backgroundColor={getAspectTypeStyle('low').text}
                textColor="white"
              />
              <StatCard
                value={
                  sortedDignities.filter(
                    (d) => analyzeContradictions(d).hasContradictions
                  ).length
                }
                label="Mixed Dignities"
                backgroundColor={getAspectTypeStyle('medium').text}
                textColor="white"
              />
            </div>

            {/* Individual planet summaries */}
            <div className="space-y-3">
              {sortedDignities.map((dignity, index) => {
                const strengthInfo = getDignityStrengthDescription(
                  dignity.overallAssessment
                );
                const contextual = contextualDignityInterpretation(
                  dignity,
                  question.question
                );

                return (
                  <div
                    key={dignity.planet}
                    className="border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-bold mr-2">
                          #{index + 1} {dignity.planet}
                        </span>
                        <span className="text-sm text-gray-600">
                          {dignity.sign} {Math.floor(dignity.degree)}°
                        </span>
                      </div>
                      <Badge
                        label={strengthInfo.label}
                        backgroundColor={getStrengthAssessmentStyle(strengthInfo.label).backgroundColor}
                        textColor={getStrengthAssessmentStyle(strengthInfo.label).color}
                      />
                    </div>
                    <div className="text-sm text-gray-700">
                      {contextual.interpretation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeSection === "almuten" && <AlmutenSection />}

      {activeSection === "context" && (
        <div className="bg-white border border-black p-6">
          <h3 className="font-space-grotesk font-bold text-xl mb-4">
            Contextual Interpretation
          </h3>

          <div className="space-y-4">
            <ColoredBox
              backgroundColor="#fff3e0"
              textColor="black"
              borderColor="orange-200"
              className="p-4"
            >
              <h4 className="font-bold mb-2">Current Question:</h4>
              <p className="text-sm">"{question.question}"</p>
            </ColoredBox>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3">The Golden Rule</h4>
                <InfoBox
                  title="Any planet in sign or exaltation can behave well"
                  content=""
                  backgroundColor="#e8f5e9"
                  textColor="black"
                  className="mb-3"
                />
                <InfoBox
                  title="Any planet in detriment or fall can be malign"
                  content=""
                  backgroundColor="#ffebee"
                  textColor="black"
                />
                <p className="text-sm mt-3 text-gray-700">
                  This overrides traditional benefic/malefic classifications.
                  Treat essentially strong planets as benefic, debilitated ones
                  as malefic.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-3">Context Override Examples</h4>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>
                    • Lost umbrella: Saturn in Cancer = wet barrier
                    (descriptive)
                  </li>
                  <li>
                    • Beach weather: Jupiter in Pisces = rain god (contextual
                    malefic)
                  </li>
                  <li>
                    • Job application: Planet in detriment = desperate,
                    unqualified
                  </li>
                  <li>
                    • Relationship: Venus/Moon strong = attractive, confident
                  </li>
                </ul>
              </div>
            </div>

            <ColoredBox
              backgroundColor="#e3f2fd"
              textColor="black"
              borderColor="blue-200"
              className="p-4"
            >
              <h4 className="font-bold mb-2">Important Notes</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                {[
                  "Dignity shows moral quality and power to act",
                  '"Weak" doesn\'t mean unable to act - shows nasty/unhappy',
                  "Contradictions reflect real-life ambiguities",
                  "Stronger dignity/debility takes precedence",
                  "Always consider question context",
                ].map((note, index) => (
                  <li key={index}>• {note}</li>
                ))}
              </ul>
            </ColoredBox>
          </div>
        </div>
      )}
    </div>
  );
}
