import { MetadataConfigInput } from '../interfaces/Metadata';

/**
 * @description Metadata configuration for this service.
 */
export function metadataConfig(service: string): MetadataConfigInput {
  return {
    version: 1,
    lifecycleStage: 'production',
    owner: 'MyDemoTeam',
    hostPlatform: 'AWS',
    domain: 'Reservation',
    system: 'SlotReservation',
    service,
    team: 'MyDemoTeam',
    tags: ['backend', 'slotreservation', 'typescript'],
    dataSensitivity: 'sensitive',
    region: 'eu-north-1',
    jurisdiction: 'EU'
  };
}
