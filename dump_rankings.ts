
import { globalRankings } from './src/rankingsData';

console.log('Rank | ID | Name | Balanced | Delta | CoreEligible');
console.log('--------------------------------------------------');
globalRankings.slice(0, 20).forEach((city) => {
  console.log(`${String(city.globalRank).padStart(2, '0')} | ${city.id.padEnd(10)} | ${city.name.padEnd(15)} | ${city.scores.balanced} | ${city.delta} | ${city.coreBoardEligible}`);
});
