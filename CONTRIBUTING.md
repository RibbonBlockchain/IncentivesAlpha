# Contributing to RibbonBlockchain

Hey there, potential contributor!

Thanks for your interest in this project. Every contribution is welcome and appreciated. We're super excited to help you to get started 😎

> **Note:** If you still have questions after reading through this guide, [open an issue](https://github.com/RibbonBlockchain/IncentivesAlpha/issues).

## Getting Started

First off, here are a few important notes:

- **Read the [Code of Conduct](/CODE_OF_CONDUCT.md).** For most, this will be common sense. But please take a couple minutes to understand your responsibilities as a member of the RibbonBlockchain community and how you are expected to treat others.
- **[Yarn](https://yarnpkg.com/en/) is the npm client used in this project.** Please do not use `npm` or you will encounter issues.
- **This is a monorepo.** This means several public and private packages are contained within this single repository. Do your best to isolate your code changes to a single subpackage for each commit.
- **Packages use fixed-versioning.** When packages are published, their version numbers are synchronized. Perhaps we could switch over to independent versioning at some point, but this approach was simpler for getting started.
- **Version numbers and changelogs are scripted.** Conveniently, there's no need to manually update any changelogs or package versions manually. This is all managed under-the-hood by commitizen when maintainers create a new release.
- **Always be rebasing.** We tend to prefer a nice linear trail of commits in our Git history. Merge commits throw that off and make us 😰😰😰. To minimize conflicts, please `git remote add upstream https://github.com/RibbonBlockchain/IncentivesAlpha.git` so you can `git fetch upstream && git rebase upstream/master` often. And if your fork is far behind HEAD, consider deleting it and re-forking or using [`git rebase --onto`](https://stackoverflow.com/a/29916361).
- **There are a couple fancy pre-commit hooks:**.
  - **Style linting.** This gets handled by prettier. So you don't have to count the number of spaces or tabs your are using when you code, etc.
  - **Commit message formatting.** We use the conventional commit format. Because it can be annoying to type out manually, you can simply run `yarn cz` whenever you are ready to commit your staged files.

### How You Can Help

RibbonBlockchain contributions will generally fall into one of the following categories:

#### 📖 Updating documentation

This could be as simple as adding some extra notes to a README.md file, or as complex as creating some new `package.json` scripts to generate docs. Either way, we'd really really love your help with this 💖. Look for [open documentation issues](https://github.com/RibbonBlockchain/IncentivesAlpha/issues?q=is%3Aissue+is%3Aopen+label%3A%22%F0%9F%93%96+documentation%22), create your own, or just submit a PR with the updates you want to see.

#### 💬 Getting involved in issues

Many issues are open discussions. Feel free to add your own concerns, ideas, and workarounds. If you don't see what you're looking for, you can always open a new issue. Check out some of the [open discussions](https://github.com/RibbonBlockchain/IncentivesAlpha/issues?q=is%3Aissue+is%3Aopen+label%3A%22%F0%9F%92%AC+Discussion%22) and [good first issues](https://github.com/RibbonBlockchain/IncentivesAlpha/issues?q=is%3Aissue+is%3Aopen+label%3A%22%F0%9F%98%8B+good+first+issue%22).

#### 🐛 Fixing bugs, 🕶️ adding feature/enhancements, or 👌 improving code quality

If you're into this whole coding thing, maybe try fixing a [bug](https://github.com/RibbonBlockchain/IncentivesAlpha/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22), tackling an [enhancement](https://github.com/RibbonBlockchain/IncentivesAlpha/issues?q=is%3Aissue+is%3Aopen+label%3A%22%E2%9E%95+enhancement%22), or taking on a [feature request](https://github.com/RibbonBlockchain/IncentivesAlpha/labels/%F0%9F%95%B6%20feature).

> Note: Bonus points if you can delete code instead of adding it! 👾

> Note: These changes generally affect multiple packages, so you'll probably want to be familiar with each project's layout and conventions. Because of this additional cognitive load, you may not want to begin here for you first contribution.

## FAQ

### How is a contribution reviewed and accepted?

- **If you are opening an issue...**

  - Fill out all required sections for your issue type. Issues that are not filled out properly will be flagged as `invalid` and will be closed if not updated.
  - _Keep your issue simple, clear, and to-the-point_. Most issues do not require many paragraphs of text. In fact, if you write too much, it's difficult to understand what you are actually trying to communicate. **Consider [starting a discussion](https://github.com/RibbonBlockchain/IncentivesAlpha/issues/new?template=Custom.md) if you're not clear on something or want feedback from the community.**

- **If you are submitting a pull request...**
  - Write tests to increase code coverage
  - Tag the issue(s) your PR is closing or relating to
  - Make sure your PR is up-to-date with `upstream/master` (rebase please 🙏)
  - Wait for a maintainer to review your PR
  - Push additional commits to your PR branch to fix any issues noted in review.
  - Wait for a maintainer to merge your PR

Code reviews happen each week, so a PR that follows these guidelines will probably get merged quickly if there aren't any major problems with the implementation (we try to watch out for code duplication/complexity). CoacoaPods has [some really useful tips](https://github.com/CocoaPods/CocoaPods/wiki/Communication-&-Design-Rules#design-rules) when it comes to coding. I highly recommend taking a look 🤓.

### When is it appropriate to follow up?

You can expect a response from a maintainer within 7 days. If you haven’t heard anything by then, feel free to ping the thread.

### How much time is spent on this project?

Currently, there is a single full-time maintainer dedicated to this project and all of its public/private packages.

### What types of contributions are accepted?

All of the types outlined in [How You Can Help](#how-you-can-help).

### What happens if my suggestion or PR is not accepted?

While it's unlikely, sometimes there's no acceptable way to implement a suggestion or merge a PR. If that happens, maintainer will still...

- Thank you for your contribution.
- Explain why it doesn’t fit into the scope of the project and offer clear suggestions for improvement, if possible.
- Link to relevant documentation, if it exists.
- Close the issue/request.

But do not despair! In many cases, this can still be a great opportunity to follow-up with an improved suggestion or pull request. Worst case, this repo is open source, so forking is always an option 😎.

## Useful Tools

Although not required, you may want to download/install some or all of the following tools, before jumping into development:

- [MetaMask](https://metamask.io/) - This extension manages Ethereum accounts and transactions in your browser. It's useful if you want to submit ETH transactions or switch between RPC providers.
