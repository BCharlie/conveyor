const Worker = require('./Worker');

const worker = new Worker(4)

test('build takes 4 steps', () => {
  worker.leftHand = 'A'
  worker.rightHand = 'B'
  worker.cycle() //picked up both start building
  expect(worker.building).toBe(1);
  expect(worker.leftHand).toBe('A');
  expect(worker.rightHand).toBe('B');
  worker.cycle() //Slot 1
  expect(worker.building).toBe(2);
  expect(worker.leftHand).toBe('A');
  expect(worker.rightHand).toBe('B');
  worker.cycle() //Slot 2
  expect(worker.building).toBe(3);
  expect(worker.leftHand).toBe('A');
  expect(worker.rightHand).toBe('B');
  worker.cycle() //Slot 3
  expect(worker.building).toBe(4);
  expect(worker.leftHand).toBe('A');
  expect(worker.rightHand).toBe('B');
  worker.cycle() //Slot 4 build finished worker holds product
  expect(worker.building).toBe(0);
  expect(worker.leftHand).toBe('P');
  expect(worker.rightHand).toBe(' ');

});