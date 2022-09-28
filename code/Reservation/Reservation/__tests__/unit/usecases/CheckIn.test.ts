import test from 'ava';

import { CheckInUseCase } from '../../../src/application/usecases/CheckInUseCase';

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

test.serial.only('It should check in to a slot', async (t) => {
  const expected = 'CHECKED_IN';
  const slotId = 'ddeed6c2-1697-4735-bfc1-c8d82e8e9f7d';
  await CheckInUseCase(dependencies, slotId);

  const slots = await dependencies.repository.loadSlots();
  const updatedSlot = slots.filter((slot: any) => slot.slotId === slotId)[0];

  const { slotStatus } = updatedSlot;

  t.is(slotStatus, expected);
});

/**
 * NEGATIVE TESTS
 */

test.serial(
  'It should throw a CheckInConditionsNotMetError if attempting to check into a slot with non-RESERVED status',
  async (t) => {
    const error = await t.throwsAsync(async () => {
      await CheckInUseCase(dependencies, '769ea854-4fd5-4cf6-bdee-5728090633e0');
    });

    t.is(error?.name, 'CheckInConditionsNotMetError');
  }
);
