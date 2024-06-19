module.exports = class Worker {
  constructor(totalBuildCycles) {
    this.active = false;
    this.leftHand = ' '; // A,B,P
    this.rightHand = ' ';
    this.building = 0; // count for building product
    this.totalBuildCycles = totalBuildCycles;
  }

  isBuilding() {
    return (this.building < this.totalBuildCycles) && (this.building > 0);
  }

  cycle() {
    switch (true) {
      case (this.leftHand === 'P'):
        // product in hand no building to do
        break;
      case (this.building === this.totalBuildCycles):
        this.leftHand = 'P';
        this.rightHand = ' ';
        this.building = 0;
        break;
      case this.isBuilding():
        this.building++;
        break;
      case this.canBuild():
        this.building = 1;
        break;
      default:
        break;
    }
  }

  buildingCycle() {
    this.building++;
  }

  startBuilding() {
    this.building = 1;
  }

  pickup(hand, item) {
    switch (hand) {
      case 'leftHand':
        this.leftHand = item;
        break;
      case 'rightHand':
        this.rightHand = item;
        break;
      default:
        throw ('Unkown hand');
    }
  }

  putBack() {
    this.leftHand = ' ';
    // this.rightHand = ""
    // this.building = 0
  }

  canPickup(hand, item) {
    if (item === 'P') return false;
    switch (hand) {
      case 'leftHand':
        return ((this.leftHand === ' ') && (item !== this.rightHand));
      case 'rightHand':
        return ((this.rightHand === ' ') && (item !== this.leftHand));
      default:
        // console.log(hand)
        throw ('Unkown hand');
    }
  }

  canBuild() {
    if (this.leftHand === 'P') return false;
    return (this.leftHand !== ' ') && (this.rightHand !== ' ');
  }
};
