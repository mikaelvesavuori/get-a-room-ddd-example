import test from 'ava';

import { createSlotLoaderService } from '../../../src/application/services/SlotLoaderService';

import { setupDependencies } from '../../../src/infrastructure/utils/setupDependencies';

import metadataConfig from '../../../testdata/metadataConfig.json';

const dependencies = setupDependencies(metadataConfig as any, true);

/**
 * NEGATIVE TESTS
 */

test.serial('It should throw a MissingSlotError if slot does not exist', async (t) => {
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const error = await t.throwsAsync(async () => await slotLoader.loadSlot('does-not-exist'));

  t.is(error?.name, 'MissingSlotError');
});
