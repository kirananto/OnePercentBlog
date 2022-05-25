---
title: 🏎 Make your Jest Tests upto 10x Faster 
date: "2022-05-25T22:12:03.284Z"
description: "Tips on how to make your jest tests drastically faster, hence improving the developer productivity."
---

![Jest image](./jest.png)

Imagine having to wait for 30 mins to finish the unit tests for a medium scale react project. A developer who wants to merge his code will have to now wait additional 30 mins for the build checks, which is entirely frustrating. To focus on the velocity, this is when we decided to take some actions to improve this.

Like what we all do, we started searching for different methods to improve the jest performance on google. This article lists down all the observations we had and the results. It may or may not work for your configuration, But I recommend going through this article and trying each method to see if it makes any difference.

A golden rule of all optimizations is to measure. Yes, measure what is there currently. This includes all measurements that we need to keep track of and is listed here.

- Time to run the entire suite.
- Top 10 slowest suites with their times.
- Overall Memory consumed.

## # 1 Making network calls inside the Tests

So when I started looking for what could be the reason for sluggish tests, one observation I got from the team was that it was flaky, and it might be making API calls inside the tests. This spiked my curiosity, and it was true. The test cases were making API calls and were waiting for their response which was one reason for slow tests.

The best unit tests are tests that give the same result every single time you run the test. If they rely on a network, then that is simply impossible to achieve.

The next step was to look for how to avoid this, and this is when we came across jest-offline. We started implementing this, but the next issue was that many test cases were making API calls, so we had to identify all of those and mock the calls manually, which took some time but was worth the effort.

`jest-offline` now enforces this rule so that if we don't mock any calls, it directly fails the test.

## #2 There could be more than just network calls.

Upon finding that network calls could be one issue, the next thing was that we were searching for similar problems. Luckily, we encountered one more issue, which improved our test run times.

Unit tests should be run independently and precise, but for us we were wrapping the test cases with Redux Provider, which was configured with persistReducer from `redux-persist`. The primary purpose of redux persist was to persist data across different tabs & sessions. Still, for UT, this is exactly the opposite, so removing this removed one IO operation from all the tests, which saved a lot of time.

**Things to look out for**

- Cleanup Unnecessary IO Operations, like LocalStorage etc.
- unMocked timers in the test case.
- Unnecessary wrappers for components
    - Sentry wrapper --> Not required for UT
    - Analytics wrapper --> Not required for UT.

## #3 Using MaxWorkers=50% to get the optimal performance.

Inspired by the article mentioned below, you can read more there.

https://dev.to/vantanev/make-your-jest-tests-up-to-20-faster-by-changing-a-single-setting-i36

## #4 Switch to yarn + Node V16 + Jest 28

Jest had a lot of performance improvements. Hence we upgraded to 28. That goes the same with NodeJS as well. This change sped up our performance significantly.


## #4 Fix slowest test cases

The first step of every optimization is to identify what is wrong, so identifying the slowest tests is also equally important. Maybe the slowest ten tests might be taking up more than 80% of the execution time. Who knows!

use `jest-slow-test-reporter` to identify the slowest tests, and then start working on improving their performance of that. Make sure most of your tests are around 100ms or below. The slowest ones could max 300ms. Anything more than that is a red flag.


## #5 Switch to swc/jest for incredible performance boost.

With the advent of `esbuild`, the front-end world has become more demanding of speed in the development environment. [swc](https://github.com/swc-project/swc) is an ultra-fast compiler written in rust. Why not use the same for Unit testing as well?

Switch to `@swc/jest`, and you can see an immediate improvement in performance. For more info, you can refer to https://miyauchi.dev/posts/speeding-up-jest/


## #6 Memory Leaks

Another culprint for slow and flaky tests is memory leaks, this is often ignored, so make an act to identify the tests causing memory leaks.

For more info on identifying the memory leaks for your tests you can refer to: https://chanind.github.io/javascript/2019/10/12/jest-tests-memory-leak.html


## #6 React testing library

Another place to look for performance hogs, is how you write the test cases. Usage of incorrect selectors is one of the main reasons for slow tests. Few of the issues could be.

- Use of `.type` everywhere. Use it only where it is required, otherwise fall back to `.paste` as it's much faster.
- You can refer to other common pitfalls from https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

Making sure you use the correct selectors and functionality improves the quality and performance of your unit tests.


## #7 Additional

Few of the additional tips that could be used to improve performance are listed below.


**findRelatedTests**

This instantly reduces the time taken to run tests because usage of this flag will make sure that you only run the tests that are related to the code changes that you've made. So instead of running 1000+ tests, you may now only run 20 test cases for the 20 files that you changed.

We could also use `--changedSince`, which runs tests related to the changes since the provided branch or commit hash.
```bash
jest --changedSince <commit-id>
```



**JSDOM change**

Changing the test environment from jsdom to something like LinkeDOM will improve the performance by at least 2X. But this is something that I wouldn't recommend as I have not used it in a professional capacity yet. I would suggest you give it a try and see how it works with your configuration.




# Impact

- Developers will only have to wait a fraction of the time they used to wait before to see the build checks on the PR, which improves the developer productivity and time management.
- The load on the CI will now drastically reduce, hence more savings.


Hope these steps help you reduce the time taken for running Unit tests drastically. Do leave a comment about the achievements if you were able to make drastic differences with these tips.