/**
 * SVG symbol loader for natal charts
 * Loads SVG paths from the public directory
 */

// SVG symbol definitions (loaded from public/images/natal/svg_paths/)
export const SVG_SYMBOLS: Record<string, string> = {
  // Planets
  sun: `<path d="m10.025 9.7504c-0.10054-0.00336-0.20072 0.01355-0.2946 0.04971-0.09387 0.03616-0.17951 0.09083-0.25182 0.16077-0.07231 0.0699-0.12981 0.1537-0.16908 0.2463s-0.05951 0.1922-0.05951 0.2928 0.02024 0.2002 0.05951 0.2928 0.09677 0.1764 0.16908 0.2463 0.15795 0.1246 0.25182 0.1608c0.09388 0.0361 0.19406 0.053 0.2946 0.0497 0.1945-0.0065 0.3788-0.0883 0.5141-0.2282s0.2109-0.3268 0.2109-0.5214-0.0756-0.3815-0.2109-0.52141c-0.1353-0.13987-0.3196-0.22168-0.5141-0.22817z"/><path d="m10 2.1667c4.6028 0 8.3333 3.7305 8.3333 8.3333 0 4.6028-3.7305 8.3333-8.3333 8.3333-4.6028 0-8.3333-3.7305-8.3333-8.3333 0-4.6028 3.7305-8.3333 8.3333-8.3333z" stroke-miterlimit="10"/>`,
  
  moon: `<path d="m10 1.6667c4.6028 0 8.3333 3.7305 8.3333 8.3333 0 4.6028-3.7305 8.3333-8.3333 8.3333-2.3014 0-4.3841-0.93342-5.8926-2.442-1.5085-1.5086-2.442-3.5912-2.442-5.8913 0-4.6028 3.7305-8.3333 8.3333-8.3333z" stroke-miterlimit="10"/>`,
  
  mercury: `<path d="m10 16.667c2.7614 0 5-2.2386 5-5s-2.2386-5-5-5-5 2.2386-5 5 2.2386 5 5 5z" stroke-miterlimit="10"/><path d="m10 6.6667v-5" stroke-linecap="round" stroke-linejoin="round"/><path d="m7.5 3.3333h5" stroke-linecap="round" stroke-linejoin="round"/><path d="m10 16.667v1.6667" stroke-linecap="round" stroke-linejoin="round"/><path d="m7.5 18.333h5" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  venus: `<path d="m10 15c3.3137 0 6-2.6863 6-6s-2.6863-6-6-6-6 2.6863-6 6 2.6863 6 6 6z" stroke-miterlimit="10"/><path d="m10 15v3.3333" stroke-linecap="round" stroke-linejoin="round"/><path d="m7.5 16.667h5" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  mars: `<path d="m8.3333 11.667c2.3012 0 4.1667-1.8655 4.1667-4.1667s-1.8655-4.1667-4.1667-4.1667-4.1667 1.8655-4.1667 4.1667 1.8655 4.1667 4.1667 4.1667z" stroke-miterlimit="10"/><path d="m11.667 8.3333 5-5" stroke-linecap="round" stroke-linejoin="round"/><path d="m13.333 3.3333h3.3333v3.3333" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  jupiter: `<path d="m6.6667 10h6.6667" stroke-linecap="round" stroke-linejoin="round"/><path d="m6.6667 6.6667v10" stroke-linecap="round" stroke-linejoin="round"/><path d="m3.3333 3.3333c0 1.8411 1.4923 3.3333 3.3333 3.3333s3.3333-1.4922 3.3333-3.3333" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  saturn: `<path d="m10 3.3333v13.333" stroke-linecap="round" stroke-linejoin="round"/><path d="m6.6667 10h6.6667" stroke-linecap="round" stroke-linejoin="round"/><path d="m3.3333 6.6667c0-1.8411 1.4923-3.3333 3.3333-3.3333s3.3333 1.4922 3.3333 3.3333c0 1.8411-1.4923 3.3333-3.3333 3.3333" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  uranus: `<path d="m10 16.667c0.92047 0 1.6667-0.74619 1.6667-1.6667s-0.74619-1.6667-1.6667-1.6667-1.6667 0.74619-1.6667 1.6667 0.74619 1.6667 1.6667 1.6667z" stroke-miterlimit="10"/><path d="m10 13.333v-5" stroke-linecap="round" stroke-linejoin="round"/><path d="m6.6667 8.3333v-5" stroke-linecap="round" stroke-linejoin="round"/><path d="m13.333 8.3333v-5" stroke-linecap="round" stroke-linejoin="round"/><path d="m5 5h3.3333" stroke-linecap="round" stroke-linejoin="round"/><path d="m11.667 5h3.3333" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  neptune: `<path d="m10 15c1.3807 0 2.5-1.1193 2.5-2.5s-1.1193-2.5-2.5-2.5-2.5 1.1193-2.5 2.5 1.1193 2.5 2.5 2.5z" stroke-miterlimit="10"/><path d="m10 10v-6.6667" stroke-linecap="round" stroke-linejoin="round"/><path d="m6.6667 6.6667 3.3333-3.3333 3.3333 3.3333" stroke-linecap="round" stroke-linejoin="round"/><path d="m5 8.3333v5" stroke-linecap="round" stroke-linejoin="round"/><path d="m15 8.3333v5" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  pluto: `<path d="m10 15c2.7614 0 5-2.2386 5-5s-2.2386-5-5-5-5 2.2386-5 5 2.2386 5 5 5z" stroke-miterlimit="10"/><path d="m10 5v-1.6667" stroke-linecap="round" stroke-linejoin="round"/><path d="m7.5 1.6667h5" stroke-linecap="round" stroke-linejoin="round"/><path d="m10 15v3.3333" stroke-linecap="round" stroke-linejoin="round"/>`,

  // Signs
  aries: `<path d="m2.8867 9.53c-0.48441-0.48454-0.84187-1.0811-1.0407-1.7367-0.19883-0.65567-0.2329-1.3502-0.0992-2.0222 0.13371-0.67198 0.43106-1.3006 0.86572-1.8302 0.43467-0.52963 0.99323-0.9439 1.6262-1.2061 0.63299-0.26222 1.3209-0.36429 2.0027-0.29718 0.68187 0.06711 1.3367 0.30134 1.9064 0.68193 0.56973 0.38059 1.0368 0.8958 1.3599 1.5s0.49216 1.2788 0.49228 1.9639m0 0c1.1e-4 -0.68516 0.16921-1.3597 0.49231-1.9639 0.323-0.60421 0.7901-1.1194 1.3599-1.5 0.5697-0.38059 1.2245-0.61482 1.9063-0.68193 0.6819-0.06711 1.3698 0.03496 2.0028 0.29718 0.633 0.26221 1.1915 0.67648 1.6262 1.2061 0.4347 0.52962 0.732 1.1583 0.8657 1.8302 0.1337 0.67199 0.0997 1.3666-0.0992 2.0222-0.1988 0.65568-0.5563 1.2522-1.0407 1.7367m-7.1133-2.9467v12.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  taurus: `<path d="m10 14.583c3.6834 0 6.6667-2.9833 6.6667-6.6667s-2.9833-6.6667-6.6667-6.6667-6.6667 2.9833-6.6667 6.6667 2.9833 6.6667 6.6667 6.6667z" stroke-miterlimit="10"/><path d="m6.25 1.25c-1.3807 0-2.5 1.1193-2.5 2.5s1.1193 2.5 2.5 2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="m13.75 1.25c1.3807 0 2.5 1.1193 2.5 2.5s-1.1193 2.5-2.5 2.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  gemini: `<path d="m3.3333 3.3333v13.333" stroke-linecap="round" stroke-linejoin="round"/><path d="m16.667 3.3333v13.333" stroke-linecap="round" stroke-linejoin="round"/><path d="m3.3333 6.6667h13.333" stroke-linecap="round" stroke-linejoin="round"/><path d="m3.3333 13.333h13.333" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  cancer: `<path d="m5 10c0-2.7614 2.2386-5 5-5s5 2.2386 5 5-2.2386 5-5 5c-1.3807 0-2.6307-0.55964-3.5355-1.4645s-1.4645-2.1548-1.4645-3.5355z" stroke-miterlimit="10"/><path d="m15 10c0 2.7614-2.2386 5-5 5s-5-2.2386-5-5c0 1.3807 0.55964 2.6307 1.4645 3.5355s2.1548 1.4645 3.5355 1.4645c2.7614 0 5-2.2386 5-5z" stroke-miterlimit="10"/>`,
  
  leo: `<path d="m10 15c2.7614 0 5-2.2386 5-5s-2.2386-5-5-5-5 2.2386-5 5 2.2386 5 5 5z" stroke-miterlimit="10"/><path d="m5 10c0-1.3807 1.1193-2.5 2.5-2.5s2.5 1.1193 2.5 2.5-1.1193 2.5-2.5 2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="m5 10h8.3333" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  virgo: `<path d="m3.3333 16.667v-13.333" stroke-linecap="round" stroke-linejoin="round"/><path d="m8.3333 16.667v-13.333" stroke-linecap="round" stroke-linejoin="round"/><path d="m13.333 16.667v-8.3333c0-1.3807 1.1193-2.5 2.5-2.5s2.5 1.1193 2.5 2.5-1.1193 2.5-2.5 2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="m3.3333 10h10" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  libra: `<path d="m3.3333 13.333h13.333" stroke-linecap="round" stroke-linejoin="round"/><path d="m6.6667 13.333c0 1.8411-1.4923 3.3333-3.3333 3.3333" stroke-linecap="round" stroke-linejoin="round"/><path d="m13.333 13.333c0 1.8411 1.4923 3.3333 3.3333 3.3333" stroke-linecap="round" stroke-linejoin="round"/><path d="m10 10c2.7614 0 5-2.2386 5-5s-2.2386-5-5-5-5 2.2386-5 5 2.2386 5 5 5z" stroke-miterlimit="10"/>`,
  
  scorpio: `<path d="m3.3333 16.667v-13.333" stroke-linecap="round" stroke-linejoin="round"/><path d="m8.3333 16.667v-13.333" stroke-linecap="round" stroke-linejoin="round"/><path d="m13.333 16.667v-8.3333c0-1.3807 1.1193-2.5 2.5-2.5s2.5 1.1193 2.5 2.5-1.1193 2.5-2.5 2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="m3.3333 10h10" stroke-linecap="round" stroke-linejoin="round"/><path d="m13.333 16.667 2.5-2.5 1.6667 1.6667" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  sagittarius: `<path d="m3.3333 16.667 13.333-13.333" stroke-linecap="round" stroke-linejoin="round"/><path d="m11.667 3.3333h5v5" stroke-linecap="round" stroke-linejoin="round"/><path d="m6.6667 13.333h6.6667" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  capricorn: `<path d="m5 16.667v-8.3333c0-2.7614 2.2386-5 5-5s5 2.2386 5 5v8.3333" stroke-linecap="round" stroke-linejoin="round"/><path d="m15 11.667c0 1.8411 1.4923 3.3333 3.3333 3.3333s3.3333-1.4922 3.3333-3.3333-1.4923-3.3333-3.3333-3.3333" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  aquarius: `<path d="m3.3333 8.3333c1.6667 0 1.6667 3.3333 3.3333 3.3333s1.6667-3.3333 3.3333-3.3333 1.6667 3.3333 3.3333 3.3333 1.6667-3.3333 3.3333-3.3333" stroke-linecap="round" stroke-linejoin="round"/><path d="m3.3333 13.333c1.6667 0 1.6667 3.3333 3.3333 3.3333s1.6667-3.3333 3.3333-3.3333 1.6667 3.3333 3.3333 3.3333 1.6667-3.3333 3.3333-3.3333" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  pisces: `<path d="m3.3333 10c0-3.6834 2.9833-6.6667 6.6667-6.6667s6.6667 2.9833 6.6667 6.6667-2.9833 6.6667-6.6667 6.6667" stroke-linecap="round" stroke-linejoin="round"/><path d="m16.667 10c0 3.6834-2.9833 6.6667-6.6667 6.6667s-6.6667-2.9833-6.6667-6.6667 2.9833-6.6667 6.6667-6.6667" stroke-linecap="round" stroke-linejoin="round"/><path d="m6.6667 10h6.6667" stroke-linecap="round" stroke-linejoin="round"/>`,

  // Aspects
  conjunction: `<path d="m10 18.333c4.6028 0 8.3333-3.7305 8.3333-8.3333s-3.7305-8.3333-8.3333-8.3333-8.3333 3.7305-8.3333 8.3333 3.7305 8.3333 8.3333 8.3333z" stroke-miterlimit="10"/>`,
  
  opposition: `<path d="m10 18.333c4.6028 0 8.3333-3.7305 8.3333-8.3333s-3.7305-8.3333-8.3333-8.3333-8.3333 3.7305-8.3333 8.3333 3.7305 8.3333 8.3333 8.3333z" stroke-miterlimit="10"/><path d="m1.6667 10h16.667" stroke-linecap="round" stroke-linejoin="round"/>`,
  
  trine: `<path d="m10 3.3333 6.0622 10.5h-12.124z" stroke-linejoin="round"/>`,
  
  square: `<path d="m5 5h10v10h-10z" stroke-linejoin="round"/>`,
  
  sextile: `<path d="m10 3.3333 5 8.6603h-10z" stroke-linejoin="round"/><path d="m10 16.667 5-8.6603h-10z" stroke-linejoin="round"/>`,

  // Chart points  
  asc: `<path d="m10 1.6667 5 8.6603h-10z" stroke-linejoin="round"/>`,
  mc: `<path d="m10 18.333v-16.667" stroke-linecap="round" stroke-linejoin="round"/><path d="m5 8.3333 5-5 5 5" stroke-linecap="round" stroke-linejoin="round"/>`,
  dsc: `<path d="m10 18.333 5-8.6603h-10z" stroke-linejoin="round"/>`,
  ic: `<path d="m10 1.6667v16.667" stroke-linecap="round" stroke-linejoin="round"/><path d="m5 11.667 5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/>`,

  // Retrograde symbol
  retrograde: `<path d="m6.6667 10c0-1.8411 1.4923-3.3333 3.3333-3.3333s3.3333 1.4922 3.3333 3.3333" stroke-linecap="round" stroke-linejoin="round"/><path d="m8.3333 8.3333-1.6667 1.6667 1.6667 1.6667" stroke-linecap="round" stroke-linejoin="round"/>`
};

// Function to get SVG symbol for a given name
export function getSVGSymbol(name: string): string {
  const symbolName = name.toLowerCase().replace(/\s+/g, '');
  return SVG_SYMBOLS[symbolName] || SVG_SYMBOLS.sun; // fallback to sun
}

// Function to create an SVG group with symbol
export function createSymbolGroup(
  symbolName: string, 
  x: number, 
  y: number, 
  scale: number = 1,
  color: string = 'currentColor',
  strokeWidth: number = 1.5
): string {
  const symbol = getSVGSymbol(symbolName);
  
  return `<g transform="translate(${x - 10 * scale}, ${y - 10 * scale}) scale(${scale})" 
    stroke="${color}" stroke-width="${strokeWidth}" fill="none">
    ${symbol}
  </g>`;
}