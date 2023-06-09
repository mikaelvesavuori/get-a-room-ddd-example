import { APIGatewayProxyResult, AuthResponse } from 'aws-lambda';

import fetch, { Response } from 'node-fetch';

import { AuthorizationHeaderError } from '../../errors/AuthorizationHeaderError';
import { InvalidVerificationCodeError } from '../../errors/InvalidVerificationCodeError';
import { MissingSecurityApiEndpoint } from '../../errors/MissingSecurityApiEndpoint';

const SECURITY_API_ENDPOINT_VERIFY = process.env.SECURITY_API_ENDPOINT_VERIFY || '';

/**
 * @description Authorizer that will check the `event.Authorization` header
 * for a slot ID (separated by a pound sign, or "hash tag") and a verification code
 * and validate it against the Security API.
 *
 * @example `Authorization: b827bb85-7665-4c32-bb3c-25bca5d3cc48#abc123` header.
 */
export async function handler(event: EventInput): Promise<AuthResponse> {
  try {
    // @ts-ignore
    if (event.httpMethod === 'OPTIONS') return handleCors();
    if (!SECURITY_API_ENDPOINT_VERIFY) throw new MissingSecurityApiEndpoint();

    const { slotId, verificationCode } = getValues(event);
    if (!slotId || !verificationCode) throw new AuthorizationHeaderError();

    // Verify code
    const isCodeValid = await validateCode(slotId, verificationCode);
    if (!isCodeValid) throw new InvalidVerificationCodeError();

    return generatePolicy(verificationCode, 'Allow', event.methodArn, '');
  } catch (error: any) {
    console.error(error.message);
    const { slotId } = getValues(event);
    const id = slotId ? slotId : 'UNKNOWN';
    return generatePolicy(id, 'Deny', event.methodArn, {});
  }
}

/**
 * @description Get required values
 */
function getValues(event: EventInput) {
  const header = event.headers['Authorization'] || '';
  const [slotId, verificationCode] = header.split('#');
  return {
    slotId,
    verificationCode
  };
}

/**
 * @description CORS handler.
 */
function handleCors() {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      Vary: 'Origin'
    },
    body: JSON.stringify('OK')
  } as APIGatewayProxyResult;
}

/**
 * @description Creates the IAM policy for the response.
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
 */
const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string,
  data: string | Record<string, any>
) => {
  return {
    principalId,
    context: {
      stringKey: JSON.stringify(data)
    },
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  };
};

/**
 * @description Validate a code.
 */
async function validateCode(slotId: string, verificationCode: string): Promise<boolean> {
  return await fetch(SECURITY_API_ENDPOINT_VERIFY, {
    body: JSON.stringify({
      slotId,
      code: verificationCode
    }),
    method: 'POST'
  })
    .then((response: Response) => response.json())
    .then((result: boolean) => {
      if (result === true) return true;
      return false;
    })
    .catch((error: any) => {
      console.error(error.message);
      return false;
    });
}

/**
 * @description Very basic approximation of the
 * required parts of the incoming event.
 */
type EventInput = {
  headers: Record<string, string>;
  httpMethod: 'GET' | 'POST' | 'PATCH' | 'OPTIONS';
  methodArn: string;
};
