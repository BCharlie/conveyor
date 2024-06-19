/* eslint-disable no-await-in-loop */
const ProductionLine = require('./ProductionLine');

const productionLine = new ProductionLine({conveyorLength:3, workersCount:3, totalBuildCycles:4, draw:false});

async function main() {
  let totals = '';
  let cycle = 0;
  do {
    totals = await productionLine.cycle();
    cycle++;
  } while (cycle < 100);
  console.log(`${totals}`)
}

main();
