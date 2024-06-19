const ProductionLine = require('./ProductionLine');

const productionLine = new ProductionLine({conveyorLength:2, workersCount:2, totalBuildCycles:4});

// In each unit of time, the belt moves forwards one position, and there is time for a worker on 
// one side of each slot to either take an item from the slot or replace an item onto the belt.

test('test create A and Pickp A top', async () => {
    productionLine.conveyorBelt.belt[0].contents = 'A'
    await productionLine.cycle(true);
    expect(productionLine.conveyorBelt.belt[0].contents).toBe(' ');
    expect(productionLine.conveyorBelt.belt[1].contents).toBe(' ');
    expect(productionLine.workersTop[0].leftHand).toBe('A');
    expect(productionLine.workersBottom[0].leftHand).toBe(' ');

    await productionLine.cycle(true);
    expect(productionLine.conveyorBelt.belt[0].contents).toBe(' ');
    expect(productionLine.conveyorBelt.belt[1].contents).toBe(' ');
    expect(productionLine.workersTop[0].leftHand).toBe('A');
    expect(productionLine.workersBottom[0].leftHand).toBe(' ');

});

test('test create A and pickup A bottom', async () => {
    productionLine.conveyorBelt.belt[0].contents = 'A'
    await productionLine.cycle(true);
    expect(productionLine.conveyorBelt.belt[0].contents).toBe(' ');
    expect(productionLine.conveyorBelt.belt[1].contents).toBe(' ');
    expect(productionLine.workersTop[0].leftHand).toBe('A');
    expect(productionLine.workersBottom[0].leftHand).toBe('A');
    await productionLine.cycle(true);
    expect(productionLine.conveyorBelt.belt[0].contents).toBe(' ');
    expect(productionLine.conveyorBelt.belt[1].contents).toBe(' ');
    expect(productionLine.conveyorBelt.belt[2].contents).toBe(' ');
    expect(productionLine.workersTop[0].leftHand).toBe('A');
    expect(productionLine.workersBottom[0].leftHand).toBe('A');

});

test('test create A and ignore A row 1', async () => {
    productionLine.conveyorBelt.belt[0].contents = 'A'
    await productionLine.cycle(true);
    expect(productionLine.conveyorBelt.belt[0].contents).toBe(' ');
    expect(productionLine.conveyorBelt.belt[1].contents).toBe('A');
    expect(productionLine.workersTop[0].leftHand).toBe('A');
    expect(productionLine.workersBottom[0].leftHand).toBe('A');
    await productionLine.cycle(true);
    expect(productionLine.conveyorBelt.belt[0].contents).toBe(' ');
    expect(productionLine.conveyorBelt.belt[1].contents).toBe(' ');
    expect(productionLine.conveyorBelt.belt[2].contents).toBe(' ');
    expect(productionLine.workersTop[1].leftHand).toBe('A');
    expect(productionLine.workersBottom[1].leftHand).toBe(' ');
});

test('test create A and ignore A row 2', async () => {
    productionLine.conveyorBelt.belt[0].contents = 'A'
    await productionLine.cycle(true);
    expect(productionLine.conveyorBelt.belt[0].contents).toBe(' ');
    expect(productionLine.conveyorBelt.belt[1].contents).toBe('A');
    expect(productionLine.workersTop[0].leftHand).toBe('A');
    expect(productionLine.workersBottom[0].leftHand).toBe('A');
    await productionLine.cycle(true);
    expect(productionLine.conveyorBelt.belt[0].contents).toBe(' ');
    expect(productionLine.conveyorBelt.belt[1].contents).toBe(' ');
    expect(productionLine.conveyorBelt.belt[2].contents).toBe(' ');
    expect(productionLine.workersTop[1].leftHand).toBe('A');
    expect(productionLine.workersBottom[1].leftHand).toBe('A');
});

test('test create A and ignore A increments wasted', async () => {
    productionLine.conveyorBelt.belt[0].contents = 'A';
    await productionLine.cycle(true);
    expect(productionLine.conveyorBelt.belt[0].contents).toBe(' ');
    expect(productionLine.conveyorBelt.belt[1].contents).toBe('A');
    expect(productionLine.workersTop[0].leftHand).toBe('A');
    expect(productionLine.workersBottom[0].leftHand).toBe('A');
    await productionLine.cycle(true);
    expect(productionLine.conveyorBelt.belt[0].contents).toBe(' ');
    expect(productionLine.conveyorBelt.belt[1].contents).toBe(' ');
    expect(productionLine.conveyorBelt.belt[2].contents).toBe('A');
    expect(productionLine.workersTop[1].leftHand).toBe('A');
    expect(productionLine.workersBottom[1].leftHand).toBe('A');
    await productionLine.cycle(true);
    productionLine.conveyorBelt.metrics.leftOver['A'] = 1
});


// The worker opposite can't touch the same belt slot while they do this. (So you can't have one worker picking something from a slot while their counterpart puts something down in the same place).
const productionLine1 = new ProductionLine({conveyorLength:2, workersCount:2, totalBuildCycles:4});

test('test can put back when finished', async () => {
    productionLine1.conveyorBelt.belt[0].contents = ' ';
    productionLine1.workersTop[0].leftHand = 'A';
    productionLine1.workersTop[0].rightHand = 'B';
    await productionLine1.cycle(true);
    expect(productionLine1.workersTop[0].building).toBe(1);
    await productionLine1.cycle(true);
    expect(productionLine1.workersTop[0].building).toBe(2);
    await productionLine1.cycle(true);
    expect(productionLine1.workersTop[0].building).toBe(3);
    await productionLine1.cycle(true);
    expect(productionLine1.workersTop[0].building).toBe(4);
    await productionLine1.cycle(true);
    expect(productionLine1.conveyorBelt.belt[1].contents).toBe('P');
});

const productionLine2 =new ProductionLine({conveyorLength:2, workersCount:2, totalBuildCycles:4});
// Once a worker has collected one of both types of component, they can begin assembling the finished product. 
// This takes an amount of time, so they will only be ready to place the assembled product back on the belt on the fourth subsequent slot. 

test('test can nott put back when slot is used', async () => {
    productionLine2.conveyorBelt.belt[0].contents = ' ';
    productionLine2.workersBottom[0].leftHand = 'A';
    productionLine2.workersBottom[0].rightHand = 'B';
    await productionLine2.cycle(true);
    expect(productionLine2.workersBottom[0].building).toBe(1);
    await productionLine2.cycle(true);
    expect(productionLine2.workersBottom[0].building).toBe(2);
    await productionLine2.cycle(true);
    expect(productionLine2.workersBottom[0].building).toBe(3);
    productionLine2.conveyorBelt.belt[0].contents = 'A' //Spawn an A to make the slot used
    await productionLine2.cycle(true);
    expect(productionLine2.workersBottom[0].building).toBe(4);
    expect(productionLine.workersTop[0].leftHand).toBe('A'); //top worker picked it up
    expect(productionLine2.conveyorBelt.belt[1].contents).toBe(' ');
    await productionLine2.cycle(true);
    expect(productionLine2.conveyorBelt.belt[1].contents).toBe('P');
});


// While they are assembling the product, they can't touch the conveyor belt. 

// Workers can only hold two items (component or product) at a time; one in each hand.
const productionLine3 = new ProductionLine({conveyorLength:2, workersCount:2, totalBuildCycles:4});
test('test can pickup with built product in hand', async () => {
    productionLine3.conveyorBelt.belt[0].contents = 'A'
    productionLine3.conveyorBelt.belt[1].contents = 'A'
    productionLine3.workersTop[0].leftHand = 'P'
    productionLine3.workersTop[0].rightHand = ' '
    productionLine3.workersBottom[0].leftHand = 'A'
    await productionLine3.cycle(true);
    expect(productionLine3.workersTop[0].leftHand).toBe('P');
    expect(productionLine3.workersTop[0].rightHand).toBe('A');
    expect(productionLine3.conveyorBelt.belt[1].contents).toBe(' ');
    await productionLine3.cycle(true);
    expect(productionLine3.workersTop[0].leftHand).toBe(' ');
    expect(productionLine3.conveyorBelt.belt[1].contents).toBe('P');
});