import { getRankingsBoard } from "./src/rankingsData";

const rankings = getRankingsBoard({ mode: "balanced", region: "All", scope: "field" });
const top10 = rankings.slice(0, 10);

console.log("Top 10 Rankings:");
top10.forEach((city, index) => {
  console.log(`${index + 1}. ${city.name} (Score: ${city.scores.balanced}, Delta: ${city.delta}, Community: ${city.scores.community}, GlobalRank: ${city.globalRank})`);
});

const bangkok = rankings.find(c => c.id === "bangkok");
if (bangkok) {
    const bIndex = rankings.indexOf(bangkok);
    console.log(`\nBangkok is at rank: ${bIndex + 1}`);
}
