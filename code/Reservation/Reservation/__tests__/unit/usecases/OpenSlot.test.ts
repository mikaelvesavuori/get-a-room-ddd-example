import test from 'ava';

import { OpenSlotUseCase } from '../../../src/application/usecases/OpenSlotUseCase';

import { setupDependencies } from '../../../src/infrastructure/utils/setupDependencies';

import metadataConfig from '../../../testdata/metadataConfig.json';

import { setEnv, cleanEnv } from '../../../testUtils';

setEnv();
const dependencies = setupDependencies(metadataConfig as any, true);

test.beforeEach(() => setEnv());
test.afterEach(() => cleanEnv());

/**
 * POSITIVE TESTS
 */

test.serial('It should set a slot as open', async (t) => {
  const expected = 'OPEN';
  const slotId = '8613678f-2bbe-4fdd-93b8-97f65674c94f';
  await OpenSlotUseCase(dependencies, slotId);

  const slots = await dependencies.repository.loadSlots();
  const updatedSlot = slots.filter((slot: any) => slot.slotId === slotId)[0];

  const { slotStatus } = updatedSlot;

  t.is(slotStatus, expected);
});
