import fetch, { Response } from 'node-fetch';

import { VerificationCodeService } from '../../interfaces/VerificationCodeService';

import { MissingSecurityApiEndpoint } from '../../errors/MissingSecurityApiEndpoint';
import { FailedGettingVerificationCodeError } from '../../errors/FailedGettingVerificationCodeError';

/**
 * @description Factory function to create a new instance of the `VerificationCodeService`.
 */
export function createVerificationCodeService(securityApiEndpoint: string) {
  return new OnlineVerificationCodeService(securityApiEndpoint);
}

/**
 * @description The `OnlineVerificationCodeService` calls an online service
 * to retrieve and passes back a verification code.
 */
class OnlineVerificationCodeService implements VerificationCodeService {
  private readonly securityApiEndpoint: string;

  constructor(securityApiEndpoint: string) {
    this.securityApiEndpoint = securityApiEndpoint;
    if (!securityApiEndpoint) throw new MissingSecurityApiEndpoint();
  }

  /**
   * @description Connect to Security API to generate code.
   */
  async getVerificationCode(slotId: string): Promise<string> {
    const verificationCode = await fetch(this.securityApiEndpoint, {
      body: JSON.stringify({
        slotId: slotId
      }),
      method: 'POST'
    }).then((res: Response) => {
      if (res?.status >= 200 && res?.status < 300) return res.json();
    });

    if (!verificationCode) throw new FailedGettingVerificationCodeError('Bad status received!');

    return verificationCode;
  }
}
