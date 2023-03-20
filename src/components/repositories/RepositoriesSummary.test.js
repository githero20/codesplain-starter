import { screen, render } from "@testing-library/react";
import RepositoriesSummary from "./RepositoriesSummary";

test("displays the working language of the repo and other props", () => {
  const repo = {
    language: "TypeScript",
    stargazers_count: 21,
    open_issues: 12,
    forks: 0,
  };
  render(<RepositoriesSummary repository={repo} />);

  //   looping through an object so for ... in
  for (let key in repo) {
    let val = repo[key];

    // better than passing the exact text in it, more flexible
    const el = screen.getByText(new RegExp(val));

    expect(el).toBeInTheDocument();
  }

  //   const language = screen.getByText("TypeScript");

  //   expect(language).toBeInTheDocument();
});
