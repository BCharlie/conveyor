const conveyorSlot = {
  contents: ' ', // A,B,P
  usedThisCycle: false,
};

// conveyor belt is length plus 2 first and last slot are special
// slots for spawning new items and counting finished items

module.exports = class ConveyorBelt {
  constructor(length) {
    this.conveyorLength = length;
    this.items = [' ', 'A', 'B'];
    this.belt = Array.from({ length: length + 2 }, () => ({ ...conveyorSlot }));
    this.metrics = { created: {}, leftOver: { P: 0 }, taken: {} };
    this.items.forEach((e) => {
      this.metrics.created[e] = 0;
      this.metrics.leftOver[e] = 0;
      this.metrics.taken[e] = 0;
    });
  }

  async spawn() {
    const item = this.items[Math.floor(Math.random() * this.items.length)];
    this.belt[0].contents = item;
    this.metrics.created[item]++;
    // console.log("spawn " + item)
    return true;
  }

  getBelt() {
    return this.belt.slice(1, -1);
  }

  resetUsed() {
    this.belt.forEach((e) => {
      e.usedThisCycle = false;
    });
  }

  async moveForward() {
    for (let i = this.belt.length - 2; i >= 0; i--) {
      this.belt[i + 1].contents = this.belt[i].contents;
    }
    const last = this.belt[this.belt.length - 1].contents;

    this.metrics.leftOver[last]++;
    this.belt[0].contents = ' ';
    this.resetUsed();
    return true;
  }

  isEmpty(i) {
    return this.belt[i + 1].contents === ' ';
  }

  slotContents(i) {
    return this.belt[i + 1].contents;
  }

  setContents(i, item) {
    this.belt[i + 1].usedThisCycle = true;
    this.metrics.taken[this.belt[i].contents]++;
    this.belt[i + 1].contents = item;
  }

  setUsed(i) {
    this.belt[i + 1].usedThisCycle = true;
  }

  isUnused(i) {
    return this.belt[i + 1].usedThisCycle === false;
  }
};
