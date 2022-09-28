import test from 'ava';

import { UnattendSlotsUseCase } from '../../../src/application/usecases/UnattendSlotsUseCase';

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

test.serial('It should set a slot as unattended', async (t) => {
  const slotId = 'ddeed6c2-1697-4735-bfc1-c8d82e8e9f7d';

  const slotsStart = await dependencies.repository.loadSlots();
  const slotStart = slotsStart.filter((slot: any) => slot.slotId === slotId)[0];
  t.is(slotStart.slotStatus, 'RESERVED'); // Expect that the slot is RESERVED but ready to close

  await UnattendSlotsUseCase(dependencies);

  const slotsEndAfterUnattend = await dependencies.repository.loadSlots();
  const slotEnd = slotsEndAfterUnattend.filter((slot: any) => slot.slotId === slotId)[0];
  t.is(slotEnd.slotStatus, 'OPEN'); // Outdated reserved slot should now be have been reopened

  // All slots should now be valid states (open or checked in)
  const result = slotsEndAfterUnattend.every(
    (slot: any) => slot.slotStatus === 'OPEN' || slot.slotStatus === 'CHECKED_IN'
  );
  t.is(result, true);
});
