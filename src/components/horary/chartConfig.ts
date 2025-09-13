/**
 * Chart configuration and constants for horary charts
 * Extracted from InteractiveHoraryChart.tsx for better organization
 */

// Chart dimensions and radii
export const CHART_CONFIG = {
  size: 560,
  center: { x: 0, y: 0 },
  radii: {
    outerRing: 280,
    zodiacRing: 250,
    houseRing: 200,
    planetRing: 170,
    innerCircle: 120
  }
};

// Tooltip configuration
export const TOOLTIP_CONFIG = {
  offset: { x: 10, y: -10 },
  maxWidth: 300,
  padding: 8,
  borderRadius: 6,
  fontSize: "14px",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  textColor: "white",
  border: "1px solid rgba(255, 255, 255, 0.2)"
};

// Chart styling
export const CHART_STYLES = {
  background: "#f8fafc",
  gridLines: {
    stroke: "#e2e8f0",
    strokeWidth: 1,
    opacity: 0.6
  },
  houseLines: {
    stroke: "#64748b", 
    strokeWidth: 2,
    opacity: 0.8
  },
  zodiacWedges: {
    stroke: "#64748b",
    strokeWidth: 1,
    opacity: 0.15
  },
  angularMarkers: {
    stroke: "#dc2626",
    strokeWidth: 3,
    textColor: "#dc2626",
    fontSize: "16px",
    fontWeight: "bold"
  },
  planets: {
    fontSize: "22px",
    strokeWidth: 1,
    stroke: "#000"
  }
};

// Animation configuration
export const ANIMATION_CONFIG = {
  duration: 300,
  easing: "ease-in-out",
  hover: {
    scale: 1.1,
    opacity: 0.8
  }
};

// Chart rotation (global transformation)
export const CHART_ROTATION = 180; // degrees

// Default chart options
export const DEFAULT_CHART_OPTIONS = {
  showTooltips: true,
  showHouseNumbers: true,
  showDegreeMarkers: true,
  showAngularMarkers: true,
  showAspectLines: true,
  interactive: true
};