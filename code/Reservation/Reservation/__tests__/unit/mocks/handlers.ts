import { PathParams, rest, RestRequest } from 'msw';

//import mockFiles from './responses/mockFiles.json';

const SECURITY_API_ENDPOINT_GENERATE =
  'https://q5tfpxckuk.execute-api.eu-north-1.amazonaws.com/shared/generateCode';

const MsgSetMswInterceptedDataFromApi = (url: string) =>
  `[MSW] - Mocking intercepted fetch request data from API: ${url}`;

const logInterceptedRequest = (req: RestRequest<any, PathParams>) =>
  console.log(MsgSetMswInterceptedDataFromApi(req.url.href));

export const handlers = [
  rest.post(`${SECURITY_API_ENDPOINT_GENERATE}`, (req, res, ctx) => {
    logInterceptedRequest(req);
    return res(ctx.status(200), ctx.text('1234'));
  }),
  rest.post(`${SECURITY_API_ENDPOINT_GENERATE}-fail`, (req, res, ctx) => {
    logInterceptedRequest(req);
    return res(ctx.status(400), ctx.json({}));
  })
];
