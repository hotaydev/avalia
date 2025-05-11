# Contributing to Avalia

Thank you for your interest! :heart: We would love for you to contribute to Avalia and help make it even better than it is today!

As a contributor, here's an overview of things to learn and ways to get involved:

- [Code of Conduct](#code-of-conduct)
- [How can I help?](#how-can-i-help)
  - [Code Contributions](#code-contributions)
- [Questions or Problems?](#have-a-question-or-problem)
- [Issues and Bugs](#found-a-bug)
- [Feature Requests](#missing-a-feature)
- [Reporting an Issue](#opening-an-issue)
- [Submitting a Pull Request](#submitting-a-pull-request-pr)

## Code of Conduct

Help us keep Avalia open and inclusive.
Please read and follow our [Code of Conduct][https://github.com/hotaydev/avalia/blob/main/.github/CODE_OF_CONDUCT.md].

## How can I help?

There are many ways to help. Here are some ways to contribute without coding:

- You can help others in our [GitHub Discussions page][https://github.com/hotaydev/avalia/discussions/categories/q-a].
- You can [contribute to the official documentation](https://github.com/hotaydev/avalia/tree/main/docs).
- You can verify bugs in the [issues tab][https://github.com/hotaydev/avalia/issues] and mention the steps to reproduce them. This helps the core team receive more reports so we can fix higher priority bugs.

For ways to help with code, read the next section.

### Code Contributions

For contributors who want to help with code, we have a list of [good first issues](https://github.com/hotaydev/avalia/labels/good%20first%20issue) to help you get started.
These are beginner-friendly issues that don't require advanced knowledge of the codebase. We encourage new contributors to start with these issues and gradually move on to more challenging tasks.

## Have a Question or Problem?

Please don't open issues for general support questions, as we want to keep the GitHub issues section for bug reports and feature requests.
Instead, we recommend using our [GitHub Discussions tab][https://github.com/hotaydev/avalia/discussions/categories/q-a] for support-related questions.

These channels are a much better place to ask questions because:

- There are more people willing to help there
- Questions and answers remain publicly available, so your question/answer may help someone else
- The channel's voting system ensures that the best answers are prominently visible.

To save your time and ours, we will systematically close all issues that are general support requests and redirect people to the forum.

If you want to discuss your issue in real-time, you can contact [@TaylorHo][https://github.com/TaylorHo].

## Found a Bug?

If you find a bug, you can help us by [opening an issue](#opening-an-issue) in our [GitHub Repository][https://github.com/hotaydev/avalia].
Even better, you can [submit a Pull Request](#submitting-a-pull-request-pr) with a fix.

## Missing a Feature?

You can _request_ a new feature by [submitting an issue](#opening-an-issue) right here on GitHub.
If you would like to _implement_ a new feature, please open an issue and describe your proposal so it can be discussed.
It's always beneficial to engage in discussions about a feature before starting its development. This proactive approach helps identify if the feature might be controversial or not have widespread utility.

## Opening an Issue

Before opening an Issue, please search the [issues tab][https://github.com/hotaydev/avalia/issues]. An issue for your situation may already exist, and the discussion may inform you about readily available alternative solutions.

To submit an issue, [fill out the issue using a template][https://github.com/hotaydev/avalia/issues/new]. Please only log one issue at a time and don't list multiple bugs in the same issue.

## Submitting a Pull Request (PR)

Your PR should be opened **from your branch, from your fork, directly to the main branch**. We manage versions by publishing a release and a tag here on GitHub.

Before working on your pull request, please check the following:

1. Search [GitHub][https://github.com/hotaydev/avalia/pulls] for related PRs that might affect your submission.

2. Make sure there is an issue that describes the problem you're fixing or the behavior and design of the feature you'd like to add.

3. Please sign our [Contributor License Agreement (CLA)](#sign-the-cla). We cannot accept code without a signed CLA.

After doing this, you're ready to work on your PR! To create a PR, fork this repository and work on it. Once you include some code in your fork, you can open a PR to the Avalia repository.

For more information, you can follow this [GitHub guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork).
For more GitHub PR guides, see [these guides](https://docs.github.com/en/pull-requests).

### PR Guidelines

When submitting a Pull Request (PR) or waiting for subsequent review, follow these guidelines:

1. The PR should be ready for review. If work is pending or in development, consider keeping the changes in your fork, waiting to open the PR, or open a [draft PR](https://github.blog/2019-02-14-introducing-draft-pull-requests/).

2. The PR passes tests and lint checks (we use [Biome](https://biomejs.dev/)).

3. The PR has no merge conflicts.

4. Commits and Pull Request titles should use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) prefixes/types. The commit message and PR title should have the same format, for example, `<prefix>: description ...`. The most used prefixes are:
   - `fix` or `bugfix` - Bug fixes.
   - `feat` or `feature` - New features.
   - `chore` - Miscellaneous changes that are not feat or fix. We usually avoid using this category.
   - `enhance` - Improvements to existing features.
   - `test` - Changes only to tests.
   - `ci` - Changes to the CI/CD system or flow.
   - `build` - Changes to the build system.
   - `docs` - Changes to documentation. Documentation is in the `/docs` folder
   - `style` - Changes to code styles and patterns, or project visual styles.
   - `refactor` - Related to some code refactoring, aiming for readability or simplicity improvements.
   - `perf` or `performance` - Specific to code or application performance.

> If your PR introduces a significant change, add a `!` at the end of the commit, for example, `<prefix>!: description ...`

5. We appreciate if the PR has "allow maintainer edits" enabled. This helps us support your contribution.

### Additional PR Links

- To run avalia locally, just clone this repository, run `npm install`, and run `npm run dev` to start the project. Remember to fill in the environment variables file, `.env.local`.
  - To run the documentation, go to the `/docs` folder and run `npm run dev` there.

### Sign the CLA

Please sign our Contributor License Agreement (CLA) before submitting pull requests. For any code changes to be accepted, the CLA must be signed. We promise it's a quick process!

We have a CLA only to be able to use community contributions commercially, aiming to license avalia for companies and large teams. This way, we can financially support the project's development.

[You can view and sign our CLA here][https://cla-assistant.io/hotaydev/avalia].

If you have more than one GitHub account or multiple email addresses associated with a single GitHub account, you must sign the CLA using the primary email address of the GitHub account used to author commits and submit pull requests.

The following documents may help you resolve issues with GitHub accounts and multiple email addresses:

- <https://help.github.com/articles/setting-your-commit-email-address-in-git/>
- <https://stackoverflow.com/questions/37245303/what-does-usera-committed-with-userb-13-days-ago-on-github-mean>
- <https://help.github.com/articles/about-commit-email-addresses/>
- <https://help.github.com/articles/blocking-command-line-pushes-that-expose-your-personal-email-address/>

## Thank You

Your contributions to open source, big or small, make projects like this possible. Thank you for taking the time to contribute.
