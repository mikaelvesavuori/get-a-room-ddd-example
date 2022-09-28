import test from 'ava';

import { CloseSlotsUseCase } from '../../../src/application/usecases/CloseSlotsUseCase';

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

test.serial('It should set all ended slots as closed', async (t) => {
  await CloseSlotsUseCase(dependencies);

  const slots = await dependencies.repository.loadSlots();
  // Just get the items that are actually expired/ended
  const filteredSetCloseSlots = slots.filter(
    (slot: any) => new Date(slot.timeSlot.endTime) < new Date()
  );
  // Now do the test on the set where all should be closed
  const result = filteredSetCloseSlots.every((slot: any) => slot.slotStatus === 'CLOSED');

  t.is(result, true);
});
