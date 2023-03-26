import { render, screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { MemoryRouter } from "react-router";
import HomeRoute from "./HomeRoute";
import { createServer } from "../test/server";

// API Testing
// Module Mocking, here we mocked like we're calling the endpoint
// but it doesn't actually reach the hook
// However, interactions between the hook and component are untested with this approach
// jest.mock("../hooks/useRepositories", () => {
//   return () => {
//     return {
//       data: [{ name: "react" }, { name: "bootstrap" }],
//     };
//   };
// });

// // Alternatively, we can mock the external api and it's response with a mock service worker (msw)
// rest.get("/api/repositories", (req, res, ctx) => {
//   return res(ctx.json([{ name: "react" }, { name: "bootstrap" }]));
// });

// Avoid the anti-pattern of defining all the handlers in one 'handler.js' file
// This will result in getting the same type of response when calling every faker
// It is not desirable
// There is a way to build a reusable handler function though, check createServer below

// const handlers = [
//   rest.get("/api/repositories", (req, res, ctx) => {
//     const language = req.url.searchParams.get("q").split("language:")[1];
//     // console.log(query);

//     return res(
//       ctx.json({
//         items: [
//           { id: 1, full_name: `${language}_one` },
//           { id: 2, full_name: `${language}_two` },
//         ],
//       })
//     );
//   }),
// ];

// const server = setupServer(...handlers);

// // runs before any test
// beforeAll(() => {
//   server.listen();
// });
// // runs after each test
// afterEach(() => {
//   server.resetHandlers();
// });
// // runs after all tests are executed
// afterAll(() => {
//   server.close();
// });

createServer([
  {
    path: "/api/repositories",
    res: (req) => {
      const language = req.url.searchParams.get("q").split("language:")[1];
      return {
        items: [
          { id: 1, full_name: `${language}_one` },
          { id: 2, full_name: `${language}_two` },
        ],
      };
    },
  },
]);

test("renders two repo links for each language", async () => {
  render(
    // memory router for the Link component in the Home Route
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );
  // await pause();
  // screen.debug();
  const languages = [
    "javascript",
    "typescript",
    "rust",
    "go",
    "python",
    "java",
  ];

  for (let language of languages) {
    // For each language, make sure we see two links
    const links = await screen.findAllByRole("link", {
      name: new RegExp(`${language}_`),
    });

    // Assert that the links exist and have the appropriate full_name
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent(`${language}_one`);
    expect(links[1]).toHaveTextContent(`${language}_two`);
    expect(links[0]).toHaveAttribute("href", `/repositories/${language}_one`);
    expect(links[1]).toHaveAttribute("href", `/repositories/${language}_two`);
  }

  // Loop over each language
  // For each language show only two links
  // Assert that the links have the appropriate full_name
});

// add a 0.1s pause
// const pause = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, 100);
//   });
// };
