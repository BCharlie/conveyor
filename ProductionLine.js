const ConveyorBelt = require('./ConveyorBelt');
const Worker = require('./Worker');


// sleep and clear lines little hacky functions for showing a display
function sleep(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function clearLines(n) {
  for (let i = 0; i < n; i++) {
    // first clear the current line, then clear the previous line
    const y = i === 0 ? null : -1;
    process.stdout.moveCursor(0, y);
    process.stdout.clearLine(1);
  }
  process.stdout.cursorTo(0);
}

module.exports = class ProductionLine {
  constructor(options) {
    this.conveyorBelt = new ConveyorBelt(options.conveyorLength);
    this.workersTop = Array.from({ length: options.workersCount }, () => (new Worker(options.totalBuildCycles)));
    this.workersBottom = Array.from({ length: options.workersCount }, () => (new Worker(options.totalBuildCycles)));
    this.metrics = { P: 0 };
    this.items = [' ', 'A', 'B'];
    this.animate = options.draw;
    this.totalBuildCycles = options.totalBuildCycles;
    this.items.forEach((e) => {
      this.metrics[e] = 0;
    });
  }

  async iterateWorkers(workers) {
    for (let i = 0; i < workers.length; i++) {
      const worker = workers[i];
      const slotContents = this.conveyorBelt.slotContents(i);
      worker.cycle();
      switch (true) {
        case (worker.leftHand === 'P') && this.conveyorBelt.isEmpty(i) && this.conveyorBelt.isUnused(i):
          this.conveyorBelt.setContents(i, 'P');
          worker.putBack();
          // console.log("finished can't put back")
          break;
        case (this.conveyorBelt.isEmpty(i)):
          // console.log("Used this cycle")
          break;
        case worker.canPickup('leftHand', slotContents):
          worker.pickup('leftHand', slotContents);
          this.conveyorBelt.setContents(i, ' ');
          // console.log("case pickup left")
          break;
        case worker.canPickup('rightHand', slotContents):
          worker.pickup('rightHand', slotContents);
          this.conveyorBelt.setContents(i, ' ');
          // console.log("case pickup right")
          break;
        default:
          // console.log("BREAK")
          break;
      }
    }
    return true;
  }

  validate() {
    const valid = this.items.slice();
    valid.push('P');
    const totals = {};
    valid.forEach((e) => {
      totals[e] = 0;
    });

    this.workersTop.forEach((e) => {
      if (e.leftHand !== '') totals[e.leftHand]++;
      if (e.rightHand !== '') totals[e.rightHand]++;
    });

    this.workersBottom.forEach((e) => {
      if (e.leftHand !== '') totals[e.leftHand]++;
      if (e.rightHand !== '') totals[e.rightHand]++;
    });

    this.conveyorBelt.getBelt().forEach((e) => {
      totals[e.contents]++;
    });

    this.items.forEach((e) => {
      const created = this.conveyorBelt.metrics.created[e];
      // eslint-disable-next-line max-len
      const total = totals[e] + this.conveyorBelt.metrics.leftOver[e] + this.conveyorBelt.metrics.leftOver.P + totals.P;
      // console.log(`${e} created ${created} total ${total}`)
      if (e !== ' ') {
        if (created !== total) {
        //   console.log(this.conveyorBelt.metrics);
        //   console.log(this.conveyorBelt.belt);
        //   console.log(this.workersTop);
          throw ('Audit Failed');
        }
      }
    });
    // console.log(totals)
    // this.conveyorBelt.metrics
  }

  totals() {
    let source = 'Source:\n';
    let wasted = 'Wasted:\n';
    let created = 'Created:\n';
    this.items.forEach((e) => {
        source = `${source}${e}:${this.conveyorBelt.metrics.created[e]}\n`;
        if (e !== ' ') wasted = `${wasted}${e}:${this.conveyorBelt.metrics.leftOver[e]}\n`;
      });
      created = `${created}P:${this.conveyorBelt.metrics.leftOver.P}\n`;
      return `${source}\n${wasted}\n${created}`
  }

  async draw() {
    let workersT = '';
    let workersB = '';
    let divide = '';
    let belt = '';
  

    this.workersTop.forEach((e) => {
      let left = '';
      let right = '';
      if (e.leftHand !== ' ') left = e.leftHand;
      if (e.rightHand !== ' ') right = e.rightHand;
      workersT = `${workersT}|${left}${e.building}${right}|-`;
      divide = `${divide}------`;
    });
    this.workersBottom.forEach((e) => {
      let left = ' ';
      let right = ' ';
      if (e.leftHand !== '') left = e.leftHand;
      if (e.rightHand !== '') right = e.rightHand;
      workersB = `${workersB}|${left}${e.building}${right}|-`;
    });
    this.conveyorBelt.getBelt().forEach((e) => {
      let item = e.contents;
    //   if (item === '') item = ' ';
      belt = `${belt}|${item}|---`;
    });
   const totals = this.totals()

    const text = `${workersT}\n${divide}\n${belt}\n${divide}\n${workersB}\nTotals:\n${totals}`;
    clearLines(text.split(/\n/).length);
    process.stdout.write(text);

    //  console.log(text)
    await sleep(500);
    return true;
  }

  async cycle(noSpawn) {
    if (!noSpawn) await this.conveyorBelt.spawn();
    await this.conveyorBelt.moveForward();
    await this.iterateWorkers(this.workersTop);
    await this.iterateWorkers(this.workersBottom);
    if (this.animate){
      if (!noSpawn) await this.draw();
    }
    if (!noSpawn) this.validate();
    return this.totals()
  }
};
