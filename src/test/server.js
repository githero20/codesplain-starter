import { setupServer } from "msw/node";
import { rest } from "msw";

export function createServer(handlerConfig) {
  const handlers = handlerConfig.map((config) => {
    return rest[config.method || "get"](config.path, (req, res, ctx) => {
      return res(ctx.json(config.res(req, res, ctx)));
    });
  });

  const server = setupServer(...handlers);

  // runs before any test
  beforeAll(() => {
    server.listen();
  });
  // runs after each test
  afterEach(() => {
    server.resetHandlers();
  });
  // runs after all tests are executed
  afterAll(() => {
    server.close();
  });
}
