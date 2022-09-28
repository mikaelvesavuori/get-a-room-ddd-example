import test from 'ava';

import { ReserveSlotUseCase } from '../../../src/application/usecases/ReserveSlotUseCase';
import { setupDependencies } from '../../../src/infrastructure/utils/setupDependencies';

import metadataConfig from '../../../testdata/metadataConfig.json';
import { correctSlots } from '../../../testdata/TestDatabase';

import { setEnv, cleanEnv } from '../../../testUtils';

setEnv();
const dependencies = setupDependencies(metadataConfig as any, true, correctSlots);

test.beforeEach(() => setEnv());
test.afterEach(() => cleanEnv());

/**
 * POSITIVE TESTS
 */

test.serial('It should reserve a slot', async (t) => {
  process.env.SECURITY_API_ENDPOINT_GENERATE =
    'https://q5tfpxckuk.execute-api.eu-north-1.amazonaws.com/shared/generateCode';
  const expected = 'RESERVED';
  const slotId = '0128c8d4-cb2f-460d-8f49-c5587ebbf83a';

  const slot = correctSlots.filter((slot: any) => slot.slotId === slotId)[0];

  const response = await ReserveSlotUseCase(dependencies, { ...slot });
  t.is(response.code.length, 8);

  const slots = await dependencies.repository.loadSlots();
  const updatedSlot = slots.filter((slot: any) => slot.slotId === slotId)[0];
  const { slotStatus } = updatedSlot;

  t.is(slotStatus, expected);
});

/**
 * NEGATIVE TESTS
 */

test.serial(
  'It should throw a ReservationConditionsNotMetError if attempting to reserve a slot with non-OPEN status',
  async (t) => {
    const expected = '8613678f-2bbe-4fdd-93b8-97f65674c94f';

    const slot = correctSlots.filter((slot: any) => slot.slotId === expected)[0];

    const error = await t.throwsAsync(async () => {
      await ReserveSlotUseCase(dependencies, slot);
    });

    t.is(error?.name, 'ReservationConditionsNotMetError');
  }
);
