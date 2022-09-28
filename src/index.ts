import {
  fetchSets,
  fetchSetData,
  fetchUserInfoByName,
  SetSummary,
} from './api';
import { canBuildFrom } from './collection-analysis';

async function main() {
  const userName = 'brickfan35';
  const sets = await fetchSets();

  const { collection } = await fetchUserInfoByName('brickfan35');

  const allSetsData = await Promise.all(
    sets.map(async (set: SetSummary) =>
      fetchSetData(set.id).then((data) => [
        data.name,
        canBuildFrom(collection, data.pieces),
      ]),
    ),
  );

  const buildableSets = allSetsData.filter(([, canBuild]) => canBuild);

  if (buildableSets.length === 0) {
    console.log(`${userName} can't build any sets`);
  }

  console.log(
    `${userName} can build ${buildableSets.length} sets: ${buildableSets
      .map(([name]) => name)
      .join(', ')}`,
  );
}

main().catch(console.log);
