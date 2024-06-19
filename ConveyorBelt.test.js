const ConveyorBelt = require('./ConveyorBelt');

const conveyorBelt = new ConveyorBelt(3)

test('test move forwards', () => {
  conveyorBelt.belt[0].contents = 'A';
  conveyorBelt.moveForward()
  expect(conveyorBelt.belt[0].contents).toBe(' ');
  expect(conveyorBelt.belt[1].contents).toBe('A');
  expect(conveyorBelt.belt[2].contents).toBe(' ');
  conveyorBelt.moveForward()
  expect(conveyorBelt.belt[0].contents).toBe(' ');
  expect(conveyorBelt.belt[1].contents).toBe(' ');
  expect(conveyorBelt.belt[2].contents).toBe('A');
  conveyorBelt.moveForward()
  expect(conveyorBelt.belt[0].contents).toBe(' ');
  expect(conveyorBelt.belt[1].contents).toBe(' ');
  expect(conveyorBelt.belt[2].contents).toBe(' ');
});