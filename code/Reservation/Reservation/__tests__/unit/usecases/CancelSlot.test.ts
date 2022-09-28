import test from 'ava';

import { CancelSlotUseCase } from '../../../src/application/usecases/CancelSlotUseCase';

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

test.serial('It should cancel a slot', async (t) => {
  const expected = 'OPEN';
  const slotId = 'ddeed6c2-1697-4735-bfc1-c8d82e8e9f7d';
  await CancelSlotUseCase(dependencies, slotId);

  const slots = await dependencies.repository.loadSlots();
  const updatedSlot = slots.filter((slot: any) => slot.slotId === slotId)[0];
  const { slotStatus } = updatedSlot;

  t.is(slotStatus, expected);
});

/**
 * NEGATIVE TESTS
 */

test.serial(
  'It should throw a CancellationConditionsNotMetError if attempting to cancel a slot with non-RESERVED status',
  async (t) => {
    const error = await t.throwsAsync(async () => {
      await CancelSlotUseCase(dependencies, '769ea854-4fd5-4cf6-bdee-5728090633e0');
    });

    t.is(error?.name, 'CancellationConditionsNotMetError');
  }
);
