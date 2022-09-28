import test from 'ava';

import { CheckOutUseCase } from '../../../src/application/usecases/CheckOutUseCase';

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

test.serial('It should check out of a slot', async (t) => {
  const expected = 'OPEN';
  const slotId = '8613678f-2bbe-4fdd-93b8-97f65674c94f';
  await CheckOutUseCase(dependencies, slotId);

  const slots = await dependencies.repository.loadSlots();
  const updatedSlot = slots.filter((slot: any) => slot.slotId === slotId)[0];

  const { slotStatus } = updatedSlot;

  t.is(slotStatus, expected);
});

/**
 * NEGATIVE TESTS
 */

test.serial(
  'It should throw a CheckOutConditionsNotMetError if attempting to cancel a slot with non-CHECKED_IN status',
  async (t) => {
    const error = await t.throwsAsync(async () => {
      await CheckOutUseCase(dependencies, '769ea854-4fd5-4cf6-bdee-5728090633e0');
    });

    t.is(error?.name, 'CheckOutConditionsNotMetError');
  }
);
