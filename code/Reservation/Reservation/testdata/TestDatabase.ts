export const slots: any = [
  {
    slotId: 'ddeed6c2-1697-4735-bfc1-c8d82e8e9f7d',
    hostName: '',
    timeSlot: {
      startTime: '2022-05-19T08:00:00.000Z',
      endTime: '2022-05-19T09:00:00.000Z'
    },
    slotStatus: 'RESERVED',
    createdAt: '2022-05-19T17:02:42.803Z',
    updatedAt: '2022-05-19T17:02:42.803Z'
  },
  {
    slotId: '8613678f-2bbe-4fdd-93b8-97f65674c94f',
    hostName: 'Somebody',
    timeSlot: {
      startTime: '2022-05-19T09:00:00.000Z',
      endTime: '2022-05-19T10:00:00.000Z'
    },
    slotStatus: 'CHECKED_IN',
    createdAt: '2022-05-19T17:02:42.803Z',
    updatedAt: '2022-05-19T17:02:42.803Z'
  },
  {
    slotId: '0128c8d4-cb2f-460d-8f49-c5587ebbf83a',
    hostName: 'Somebody',
    timeSlot: {
      startTime: '2100-05-19T10:00:00.000Z',
      endTime: '2100-05-19T11:00:00.000Z'
    },
    slotStatus: 'OPEN',
    createdAt: '2022-05-19T17:02:42.803Z',
    updatedAt: '2022-05-19T17:02:42.803Z'
  },
  {
    slotId: 'a9029f54-60b5-4f0a-82d4-3557670adde3',
    hostName: '',
    timeSlot: {
      startTime: '2022-05-19T11:00:00.000Z',
      endTime: '2022-05-19T12:00:00.000Z'
    },
    slotStatus: 'OPEN',
    createdAt: '2022-05-19T17:02:42.803Z',
    updatedAt: '2022-05-19T17:02:42.803Z'
  },
  {
    slotId: '2e960b33-741a-43f4-8841-088a392a7624',
    hostName: '',
    timeSlot: {
      startTime: '2022-05-19T12:00:00.000Z',
      endTime: '2022-05-19T13:00:00.000Z'
    },
    slotStatus: 'OPEN',
    createdAt: '2022-05-19T17:02:42.803Z',
    updatedAt: '2022-05-19T17:02:42.803Z'
  },
  {
    slotId: '9306a880-9f5d-4259-82ba-55d8f30e5e21',
    hostName: '',
    timeSlot: {
      startTime: '2022-05-19T13:00:00.000Z',
      endTime: '2022-05-19T14:00:00.000Z'
    },
    slotStatus: 'OPEN',
    createdAt: '2022-05-19T17:02:42.803Z',
    updatedAt: '2022-05-19T17:02:42.803Z'
  },
  {
    slotId: '69c1e21f-62ba-434f-8258-703e0e0570da',
    hostName: '',
    timeSlot: {
      startTime: '2022-05-19T14:00:00.000Z',
      endTime: '2022-05-19T15:00:00.000Z'
    },
    slotStatus: 'OPEN',
    createdAt: '2022-05-19T17:02:42.803Z',
    updatedAt: '2022-05-19T17:02:42.803Z'
  },
  {
    slotId: '643e80d5-7f98-41c6-9c75-f1337dcadf1c',
    hostName: '',
    timeSlot: {
      startTime: '2022-05-19T15:00:00.000Z',
      endTime: '2022-05-19T16:00:00.000Z'
    },
    slotStatus: 'OPEN',
    createdAt: '2022-05-19T17:02:42.803Z',
    updatedAt: '2022-05-19T17:02:42.803Z'
  },
  {
    slotId: '0488e7ac-7cac-4973-8ab6-eae5eb207c1c',
    hostName: '',
    timeSlot: {
      startTime: '2022-05-19T16:00:00.000Z',
      endTime: '2022-05-19T17:00:00.000Z'
    },
    slotStatus: 'OPEN',
    createdAt: '2022-05-19T17:02:42.803Z',
    updatedAt: '2022-05-19T17:02:42.803Z'
  },
  {
    slotId: '769ea854-4fd5-4cf6-bdee-5728090633e0',
    hostName: '',
    timeSlot: {
      startTime: '2022-05-19T17:00:00.000Z',
      endTime: '2022-05-19T18:00:00.000Z'
    },
    slotStatus: 'OPEN',
    createdAt: '2022-05-19T17:02:42.803Z',
    updatedAt: '2022-05-19T17:02:42.803Z'
  },
  /**
   * FAILING TESTS BELOW
   */
  {
    slotId: 'slotMissingTime',
    hostName: '',
    slotStatus: 'OPEN',
    createdAt: '2022-05-19T17:02:42.803Z',
    updatedAt: '2022-05-19T17:02:42.803Z'
  },
  {
    slotId: 'slotMissingTimeStart',
    hostName: '',
    timeSlot: {
      endTime: '2022-05-19T18:00:00.000Z'
    },
    slotStatus: 'OPEN',
    createdAt: '2022-05-19T17:02:42.803Z',
    updatedAt: '2022-05-19T17:02:42.803Z'
  },
  {
    slotId: 'slotMissingTimeEnd',
    hostName: '',
    timeSlot: {
      startTime: '2022-05-19T17:00:00.000Z'
    },
    slotStatus: 'OPEN',
    createdAt: '2022-05-19T17:02:42.803Z',
    updatedAt: '2022-05-19T17:02:42.803Z'
  },
  {
    slotId: 'slotMissingStatus',
    hostName: '',
    timeSlot: {
      startTime: '2022-05-19T17:00:00.000Z',
      endTime: '2022-05-19T18:00:00.000Z'
    },
    createdAt: '2022-05-19T17:02:42.803Z',
    updatedAt: '2022-05-19T17:02:42.803Z'
  },
  {
    slotId: 'slotMissingCreatedAt',
    hostName: '',
    timeSlot: {
      startTime: '2022-05-19T17:00:00.000Z',
      endTime: '2022-05-19T18:00:00.000Z'
    },
    slotStatus: 'OPEN',
    updatedAt: '2022-05-19T17:02:42.803Z'
  },
  {
    slotId: 'slotMissingUpdatedAt',
    hostName: '',
    timeSlot: {
      startTime: '2022-05-19T17:00:00.000Z',
      endTime: '2022-05-19T18:00:00.000Z'
    },
    slotStatus: 'OPEN',
    createdAt: '2022-05-19T17:02:42.803Z'
  }
];

export const correctSlots = slots.filter(
  (slot: any) =>
    slot.slotId &&
    slot.timeSlot &&
    slot.timeSlot.startTime &&
    slot.timeSlot.endTime &&
    slot.slotStatus &&
    slot.createdAt &&
    slot.updatedAt
);
