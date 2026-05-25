import fs from 'fs';
import { geoOrthographic, geoPath } from 'd3-geo';

const world = JSON.parse(fs.readFileSync('scripts/world.geojson', 'utf8'));

const projection = geoOrthographic()
  .scale(196)
  .translate([200, 200])
  .rotate([-12, -22, 0])
  .clipAngle(90);

const pathGen = geoPath(projection);

const paths = world.features
  .map((f) => pathGen(f) || '')
  .filter(Boolean);

const out = `/** Orthographic land paths — Europe/Africa centered, viewBox 0 0 400 400 */
export const GLOBE_LAND_PATHS: string[] = ${JSON.stringify(paths, null, 2)};
`;

fs.writeFileSync('lib/globeLandPaths.ts', out);
console.log(`Wrote ${paths.length} land paths`);
