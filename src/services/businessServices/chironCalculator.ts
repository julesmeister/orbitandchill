/* eslint-disable @typescript-eslint/no-unused-vars */
import { PlanetPosition } from '@/types/astrology';
import { SIGNS } from '@/constants/astrological';

interface ChironRefPoint {
  time: number;
  longitude: number;
}

const CHIRON_REFERENCE_DATA: ChironRefPoint[] = [
  { time: -2208988800000, longitude: 125.0 },
  { time: -2177452800000, longitude: 131.5 },
  { time: -2145916800000, longitude: 138.0 },
  { time: -2114380800000, longitude: 144.8 },
  { time: -2082844800000, longitude: 152.0 },
  { time: -2051308800000, longitude: 159.5 },
  { time: -2019772800000, longitude: 167.0 },
  { time: -1988236800000, longitude: 174.0 },
  { time: -1956700800000, longitude: 180.5 },
  { time: -1925164800000, longitude: 186.5 },
  { time: -1893628800000, longitude: 192.0 },
  { time: -1862092800000, longitude: 197.0 },
  { time: -1830556800000, longitude: 201.5 },
  { time: -1799020800000, longitude: 205.5 },
  { time: -1767484800000, longitude: 209.0 },
  { time: -1735948800000, longitude: 212.0 },
  { time: -1704412800000, longitude: 214.5 },
  { time: -1672876800000, longitude: 217.0 },
  { time: -1641340800000, longitude: 219.5 },
  { time: -1609804800000, longitude: 222.0 },
  { time: -1578268800000, longitude: 225.0 },
  { time: -1546732800000, longitude: 228.5 },
  { time: -1515196800000, longitude: 232.5 },
  { time: -1483660800000, longitude: 236.5 },
  { time: -1452124800000, longitude: 240.5 },
  { time: -1420588800000, longitude: 244.5 },
  { time: -1389052800000, longitude: 248.5 },
  { time: -1357516800000, longitude: 252.5 },
  { time: -1325980800000, longitude: 256.0 },
  { time: -1294444800000, longitude: 259.5 },
  { time: -1262908800000, longitude: 262.5 },
  { time: -1231372800000, longitude: 265.5 },
  { time: -1199836800000, longitude: 268.5 },
  { time: -1168300800000, longitude: 271.5 },
  { time: -1136764800000, longitude: 274.0 },
  { time: -1105228800000, longitude: 276.5 },
  { time: -1073692800000, longitude: 279.0 },
  { time: -1042156800000, longitude: 281.5 },
  { time: -1010620800000, longitude: 284.0 },
  { time: -979084800000, longitude: 286.5 },
  { time: -947548800000, longitude: 289.0 },
  { time: -916012800000, longitude: 291.5 },
  { time: -884476800000, longitude: 294.0 },
  { time: -852940800000, longitude: 296.5 },
  { time: -821404800000, longitude: 299.0 },
  { time: -789868800000, longitude: 301.5 },
  { time: -758332800000, longitude: 304.0 },
  { time: -726796800000, longitude: 306.5 },
  { time: -695260800000, longitude: 309.0 },
  { time: -663724800000, longitude: 311.5 },
  { time: -632188800000, longitude: 314.0 },
  { time: -600652800000, longitude: 316.5 },
  { time: -569116800000, longitude: 319.0 },
  { time: -537580800000, longitude: 321.5 },
  { time: -506044800000, longitude: 324.0 },
  { time: -474508800000, longitude: 326.5 },
  { time: -442972800000, longitude: 329.0 },
  { time: -411436800000, longitude: 331.5 },
  { time: -379900800000, longitude: 334.0 },
  { time: -348364800000, longitude: 336.5 },
  { time: -316828800000, longitude: 339.0 },
  { time: -285292800000, longitude: 341.5 },
  { time: -253756800000, longitude: 344.0 },
  { time: -222220800000, longitude: 346.5 },
  { time: -190684800000, longitude: 349.0 },
  { time: -159148800000, longitude: 351.5 },
  { time: -127612800000, longitude: 354.0 },
  { time: -96076800000, longitude: 356.5 },
  { time: -64540800000, longitude: 359.0 },
  { time: -33004800000, longitude: 1.5 },
  { time: -14112000000, longitude: 4.0 },
  { time: 31536000000, longitude: 6.5 },
  { time: 63072000000, longitude: 9.0 },
  { time: 94608000000, longitude: 11.5 },
  { time: 126144000000, longitude: 14.0 },
  { time: 157680000000, longitude: 16.5 },
  { time: 189216000000, longitude: 19.0 },
  { time: 220752000000, longitude: 21.5 },
  { time: 252288000000, longitude: 24.0 },
  { time: 283824000000, longitude: 26.5 },
  { time: 315360000000, longitude: 29.0 },
  { time: 346896000000, longitude: 31.5 },
  { time: 378432000000, longitude: 34.0 },
  { time: 409968000000, longitude: 36.5 },
  { time: 441504000000, longitude: 39.0 },
  { time: 473040000000, longitude: 41.5 },
  { time: 504576000000, longitude: 44.0 },
  { time: 536112000000, longitude: 46.5 },
  { time: 567648000000, longitude: 49.0 },
  { time: 599184000000, longitude: 51.5 },
  { time: 631152000000, longitude: 10.767 },
  { time: 633744000000, longitude: 13.1 },
  { time: 636278400000, longitude: 15.6 },
  { time: 638870400000, longitude: 18.4 },
  { time: 641462400000, longitude: 21.6 },
  { time: 643996800000, longitude: 25.0 },
  { time: 646588800000, longitude: 28.3 },
  { time: 649180800000, longitude: 31.5 },
  { time: 651772800000, longitude: 34.4 },
  { time: 654364800000, longitude: 37.0 },
  { time: 656956800000, longitude: 39.0 },
  { time: 659548800000, longitude: 40.5 },
  { time: 662688000000, longitude: 111.183 },
  { time: 665280000000, longitude: 115.0 },
  { time: 667814400000, longitude: 118.5 },
  { time: 670406400000, longitude: 121.8 },
  { time: 672998400000, longitude: 124.8 },
  { time: 675532800000, longitude: 127.5 },
  { time: 678124800000, longitude: 129.8 },
  { time: 680716800000, longitude: 131.8 },
  { time: 683308800000, longitude: 133.5 },
  { time: 685900800000, longitude: 135.0 },
  { time: 688492800000, longitude: 136.3 },
  { time: 691084800000, longitude: 137.5 },
  { time: 694310400000, longitude: 123.3 },
  { time: 696902400000, longitude: 126.5 },
  { time: 699436800000, longitude: 129.8 },
  { time: 702028800000, longitude: 132.9 },
  { time: 704620800000, longitude: 135.8 },
  { time: 707155200000, longitude: 138.4 },
  { time: 709747200000, longitude: 140.7 },
  { time: 712339200000, longitude: 142.7 },
  { time: 714931200000, longitude: 144.4 },
  { time: 717523200000, longitude: 145.8 },
  { time: 720115200000, longitude: 147.0 },
  { time: 722707200000, longitude: 148.1 },
  { time: 725846400000, longitude: 137.35 },
  { time: 728438400000, longitude: 140.5 },
  { time: 730972800000, longitude: 143.6 },
  { time: 733564800000, longitude: 146.5 },
  { time: 736156800000, longitude: 149.2 },
  { time: 738691200000, longitude: 151.7 },
  { time: 741283200000, longitude: 154.0 },
  { time: 743875200000, longitude: 156.1 },
  { time: 746467200000, longitude: 158.0 },
  { time: 749059200000, longitude: 159.7 },
  { time: 751651200000, longitude: 161.3 },
  { time: 754243200000, longitude: 162.8 },
  { time: 757382400000, longitude: 152.85 },
  { time: 759974400000, longitude: 155.7 },
  { time: 762508800000, longitude: 158.5 },
  { time: 765100800000, longitude: 161.3 },
  { time: 767692800000, longitude: 163.9 },
  { time: 770227200000, longitude: 166.4 },
  { time: 772819200000, longitude: 168.7 },
  { time: 775411200000, longitude: 170.8 },
  { time: 778003200000, longitude: 172.7 },
  { time: 780595200000, longitude: 174.4 },
  { time: 783187200000, longitude: 175.9 },
  { time: 785779200000, longitude: 177.2 },
  { time: 788918400000, longitude: 178.5 },
  { time: 791510400000, longitude: 180.3 },
  { time: 794044800000, longitude: 182.2 },
  { time: 796636800000, longitude: 184.1 },
  { time: 799228800000, longitude: 186.0 },
  { time: 801763200000, longitude: 187.8 },
  { time: 804355200000, longitude: 189.5 },
  { time: 806947200000, longitude: 191.1 },
  { time: 809539200000, longitude: 192.6 },
  { time: 812131200000, longitude: 194.0 },
  { time: 814723200000, longitude: 195.3 },
  { time: 817315200000, longitude: 196.5 },
  { time: 820540800000, longitude: 187.917 },
  { time: 823132800000, longitude: 189.9 },
  { time: 825667200000, longitude: 191.9 },
  { time: 828259200000, longitude: 193.9 },
  { time: 830851200000, longitude: 195.9 },
  { time: 833385600000, longitude: 197.9 },
  { time: 835977600000, longitude: 199.8 },
  { time: 838569600000, longitude: 201.6 },
  { time: 841161600000, longitude: 203.3 },
  { time: 843753600000, longitude: 204.9 },
  { time: 846345600000, longitude: 206.4 },
  { time: 848937600000, longitude: 207.8 },
  { time: 852076800000, longitude: 205.717 },
  { time: 854668800000, longitude: 207.9 },
  { time: 857203200000, longitude: 210.1 },
  { time: 859795200000, longitude: 212.3 },
  { time: 862387200000, longitude: 214.4 },
  { time: 864921600000, longitude: 216.4 },
  { time: 867513600000, longitude: 218.3 },
  { time: 870105600000, longitude: 220.1 },
  { time: 872697600000, longitude: 221.8 },
  { time: 875289600000, longitude: 223.4 },
  { time: 877881600000, longitude: 225.0 },
  { time: 880473600000, longitude: 226.5 },
  { time: 883612800000, longitude: 222.75 },
  { time: 886204800000, longitude: 224.9 },
  { time: 888739200000, longitude: 227.1 },
  { time: 891331200000, longitude: 229.3 },
  { time: 893923200000, longitude: 231.4 },
  { time: 896457600000, longitude: 233.4 },
  { time: 899049600000, longitude: 235.3 },
  { time: 901641600000, longitude: 237.1 },
  { time: 904233600000, longitude: 238.8 },
  { time: 906825600000, longitude: 240.4 },
  { time: 909417600000, longitude: 242.0 },
  { time: 912009600000, longitude: 243.5 },
  { time: 915148800000, longitude: 238.533 },
  { time: 917740800000, longitude: 240.7 },
  { time: 920275200000, longitude: 242.9 },
  { time: 922867200000, longitude: 245.1 },
  { time: 925459200000, longitude: 247.2 },
  { time: 927993600000, longitude: 249.2 },
  { time: 930585600000, longitude: 251.1 },
  { time: 933177600000, longitude: 252.9 },
  { time: 935769600000, longitude: 254.6 },
  { time: 938361600000, longitude: 256.2 },
  { time: 940953600000, longitude: 257.7 },
  { time: 943545600000, longitude: 259.1 },
  { time: 946684800000, longitude: 251.333 },
  { time: 949276800000, longitude: 253.3 },
  { time: 951811200000, longitude: 255.4 },
  { time: 954403200000, longitude: 257.5 },
  { time: 956995200000, longitude: 259.6 },
  { time: 959529600000, longitude: 261.6 },
  { time: 962121600000, longitude: 263.5 },
  { time: 964713600000, longitude: 265.3 },
  { time: 967305600000, longitude: 267.0 },
  { time: 969897600000, longitude: 268.6 },
  { time: 972489600000, longitude: 270.1 },
  { time: 975081600000, longitude: 271.5 },
  { time: 978307200000, longitude: 262.867 },
  { time: 1009843200000, longitude: 273.25 },
  { time: 1041379200000, longitude: 282.467 },
  { time: 1072915200000, longitude: 290.5 },
  { time: 1104537600000, longitude: 297.8 },
  { time: 1136073600000, longitude: 304.483 },
  { time: 1167609600000, longitude: 310.533 },
  { time: 1199145600000, longitude: 316.05 },
  { time: 1230768000000, longitude: 321.217 },
  { time: 1262304000000, longitude: 326.067 },
  { time: 1293840000000, longitude: 330.833 },
  { time: 1325376000000, longitude: 335.1 },
  { time: 1356998400000, longitude: 339.183 },
  { time: 1388534400000, longitude: 343.117 },
  { time: 1420070400000, longitude: 346.933 },
  { time: 1451606400000, longitude: 350.667 },
  { time: 1483228800000, longitude: 354.317 },
  { time: 1514764800000, longitude: 357.917 },
  { time: 1546300800000, longitude: 1.5 },
  { time: 1577836800000, longitude: 5.033 },
  { time: 1609459200000, longitude: 8.583 },
  { time: 1640995200000, longitude: 12.15 },
  { time: 1672531200000, longitude: 15.75 },
  { time: 1704067200000, longitude: 19.4 },
  { time: 1735689600000, longitude: 19.0 },
  { time: 1767225600000, longitude: 22.5 },
  { time: 1798761600000, longitude: 26.0 },
  { time: 1830297600000, longitude: 29.5 },
  { time: 1861910400000, longitude: 33.0 },
  { time: 1893446400000, longitude: 36.5 },
  { time: 1924982400000, longitude: 40.0 },
  { time: 1956432000000, longitude: 43.5 },
  { time: 1987968000000, longitude: 47.0 },
  { time: 2019504000000, longitude: 50.5 },
  { time: 2051040000000, longitude: 54.0 },
  { time: 2082662400000, longitude: 57.5 },
  { time: 2114198400000, longitude: 61.0 },
  { time: 2145734400000, longitude: 64.5 },
  { time: 2177270400000, longitude: 68.0 },
  { time: 2208806400000, longitude: 71.5 },
  { time: 2240342400000, longitude: 75.0 },
  { time: 2271964800000, longitude: 78.5 },
  { time: 2303500800000, longitude: 82.0 },
  { time: 2335036800000, longitude: 85.5 },
  { time: 2366572800000, longitude: 89.0 },
  { time: 2398108800000, longitude: 92.5 },
  { time: 2429644800000, longitude: 96.0 },
  { time: 2461267200000, longitude: 99.5 },
  { time: 2492803200000, longitude: 103.0 },
  { time: 2524339200000, longitude: 106.5 },
  { time: 2555875200000, longitude: 110.0 },
  { time: 2587411200000, longitude: 113.5 },
  { time: 2618947200000, longitude: 117.0 },
  { time: 2650569600000, longitude: 120.5 },
  { time: 2682105600000, longitude: 124.0 },
  { time: 2713641600000, longitude: 127.5 },
  { time: 2745177600000, longitude: 131.0 },
  { time: 2776713600000, longitude: 134.5 },
  { time: 2808249600000, longitude: 138.0 },
  { time: 2839872000000, longitude: 141.5 },
  { time: 2871408000000, longitude: 145.0 },
  { time: 2902944000000, longitude: 148.5 },
  { time: 2934480000000, longitude: 152.0 },
  { time: 2966016000000, longitude: 155.5 },
  { time: 2997552000000, longitude: 159.0 },
  { time: 3029088000000, longitude: 162.5 },
  { time: 3060624000000, longitude: 166.0 },
  { time: 3092256000000, longitude: 169.5 },
  { time: 3123792000000, longitude: 173.0 },
  { time: 3155328000000, longitude: 176.5 },
  { time: 3186864000000, longitude: 180.0 },
  { time: 3218400000000, longitude: 183.5 },
  { time: 3249936000000, longitude: 187.0 },
  { time: 3281472000000, longitude: 190.5 },
  { time: 3313008000000, longitude: 194.0 },
  { time: 3344620800000, longitude: 197.5 },
  { time: 3376156800000, longitude: 201.0 },
  { time: 3407692800000, longitude: 204.5 },
  { time: 3439228800000, longitude: 208.0 },
  { time: 3470764800000, longitude: 211.5 },
  { time: 3502300800000, longitude: 215.0 },
  { time: 3533836800000, longitude: 218.5 },
  { time: 3565372800000, longitude: 222.0 },
  { time: 3596908800000, longitude: 225.5 },
  { time: 3628521600000, longitude: 229.0 },
  { time: 3660057600000, longitude: 232.5 },
  { time: 3691593600000, longitude: 236.0 },
  { time: 3723129600000, longitude: 239.5 },
  { time: 3754665600000, longitude: 243.0 },
  { time: 3786201600000, longitude: 246.5 },
  { time: 3817737600000, longitude: 250.0 },
  { time: 3849360000000, longitude: 253.5 },
  { time: 3880896000000, longitude: 257.0 },
  { time: 3912432000000, longitude: 260.5 },
  { time: 3943968000000, longitude: 264.0 },
  { time: 3975504000000, longitude: 267.5 },
  { time: 4007040000000, longitude: 271.0 },
  { time: 4038576000000, longitude: 274.5 },
  { time: 4070112000000, longitude: 278.0 },
  { time: 4101648000000, longitude: 281.5 },
];

function normalizeLongitudeDelta(delta: number): number {
  if (delta > 180) return delta - 360;
  if (delta < -180) return delta + 360;
  return delta;
}

function findBracketingPoints(targetTime: number): [ChironRefPoint, ChironRefPoint] {
  const data = CHIRON_REFERENCE_DATA;

  if (targetTime <= data[0].time) {
    return [data[0], data[1]];
  }
  if (targetTime >= data[data.length - 1].time) {
    return [data[data.length - 2], data[data.length - 1]];
  }

  let left = 0;
  let right = data.length - 1;

  while (left < right - 1) {
    const mid = Math.floor((left + right) / 2);
    const midTime = data[mid].time;

    if (targetTime < midTime) {
      right = mid;
    } else if (targetTime > midTime) {
      left = mid;
    } else {
      return [data[mid], data[mid + 1]];
    }
  }

  return [data[left], data[right]];
}

function interpolateLongitude(
  targetTime: number,
  beforePoint: ChironRefPoint,
  afterPoint: ChironRefPoint
): number {
  const timeDiff = afterPoint.time - beforePoint.time;
  const positionInSegment = targetTime - beforePoint.time;
  const fraction = positionInSegment / timeDiff;

  let longDiff = afterPoint.longitude - beforePoint.longitude;
  longDiff = normalizeLongitudeDelta(longDiff);

  let longitude = beforePoint.longitude + (longDiff * fraction);
  longitude = ((longitude % 360) + 360) % 360;

  return longitude;
}

function calculateRetrogradeStatus(targetTime: number, currentLongitude: number): boolean {
  const oneDayAhead = targetTime + (24 * 60 * 60 * 1000);
  const [beforeAhead, afterAhead] = findBracketingPoints(oneDayAhead);
  const longitudeAhead = interpolateLongitude(oneDayAhead, beforeAhead, afterAhead);

  if (Math.abs(longitudeAhead - currentLongitude) > 180) {
    return longitudeAhead > currentLongitude;
  }
  return longitudeAhead < currentLongitude;
}

export function calculateChiron(date: Date): Partial<PlanetPosition> {
  const targetTime = date.getTime();
  const [beforePoint, afterPoint] = findBracketingPoints(targetTime);
  const longitude = interpolateLongitude(targetTime, beforePoint, afterPoint);

  const signIndex = Math.floor(longitude / 30) % 12;
  const sign = SIGNS[signIndex] || 'aries';
  const isRetrograde = calculateRetrogradeStatus(targetTime, longitude);

  return {
    name: 'chiron',
    longitude,
    sign,
    retrograde: isRetrograde,
    isPlanet: false,
    pointType: 'centaur',
    symbol: '⚷',
  };
}
