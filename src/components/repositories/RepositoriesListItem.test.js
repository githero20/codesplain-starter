import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import RepositoriesListItem from "./RepositoriesListItem";

// You can also mock components
// jest.mock("../tree/FileIcon", () => {
//   // This mocks the content of FileIcon.js
//   return () => {
//     return "File Icon Component";
//   };
// });

const renderComponent = () => {
  const repo = {
    full_name: "facebook/react",
    language: "JavaScript",
    description: "A JS library",
    owner: {
      login: "facebook",
    },
    name: "react",
    html_url: "https://github.com/facebook/react",
  };
  //   some external libraries need to be rendered specially when used in test environments, e.g. Link from React Router
  //   using MemoryRouter instead of BrowserRouter for testing
  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repo} />
    </MemoryRouter>
  );

  // useful if we want to get the content of the repo later
  return { repo };
};

// React Testing Library uses 'act' in the background
// But whenever we're not using RTL, we must use 'act' to wrap all state changes

test("shows a link to the repos github homepage", async () => {
  // can import the render and then call it inside the test
  const { repo } = renderComponent();

  // Preferred Solution
  await screen.findByRole("img", {
    name: "JavaScript",
  });

  // getting a link by role === link, but with an accessible name of github repository.
  // accessible name = aria-label
  const link = screen.getByRole("link", {
    name: /github repository/i,
  });
  // screen.debug();

  expect(link).toHaveAttribute("href", repo.html_url);

  // last solution is to use an act with pause
  // await act(() => {
  //   pause();
  // });

  // // simulates a pause
  // screen.debug();
  // pause();
  // screen.debug();
});

test("shows a fileicon with the appropriate icon", async () => {
  renderComponent();

  const icon = await screen.findByRole("img", { name: "JavaScript" });

  expect(icon).toHaveClass("js-icon");
});

test("shows a link to the code editor page", async () => {
  const { repo } = renderComponent();

  // await screen.findByRole("img", { name: "JavaScript" });

  const link = await screen.findByRole("link", {
    name: new RegExp(repo.owner.login),
  });

  expect(link).toHaveAttribute("href", `/repositories/${repo.full_name}`);
});

// add a 0.1s pause
const pause = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
};
