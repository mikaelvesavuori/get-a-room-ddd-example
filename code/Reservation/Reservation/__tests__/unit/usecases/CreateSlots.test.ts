import test from 'ava';

import { CreateSlotsUseCase } from '../../../src/application/usecases/CreateSlotsUseCase';

import { setupDependencies } from '../../../src/infrastructure/utils/setupDependencies';

import metadataConfig from '../../../testdata/metadataConfig.json';

import { setEnv, cleanEnv } from '../../../testUtils';

setEnv();
const dependencies = setupDependencies(metadataConfig as any, true); // The underscore is to guard against namespace conflicts when running more tests

test.beforeEach(() => setEnv());
test.afterEach(() => cleanEnv());

/**
 * POSITIVE TESTS
 */

test.serial('It should create hourly slots for a daily reservation block', async (t) => {
  const slotsCount = 10;

  const currentTime = Date.now();
  const slotsStart = await dependencies.repository.loadSlots();

  await CreateSlotsUseCase(dependencies);

  const slotsEndAfterCreate = await dependencies.repository.loadSlots();
  const filteredSetCreateSlots = slotsEndAfterCreate.filter(
    (item: any) => new Date(item.createdAt) > new Date(currentTime)
  );
  const itemLengthIsCorrect = slotsEndAfterCreate.length === slotsStart.length + slotsCount;

  t.is(filteredSetCreateSlots.length, 10);
  t.is(itemLengthIsCorrect, true);
});
