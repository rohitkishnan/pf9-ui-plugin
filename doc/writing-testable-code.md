# Writing Testable Code

This guide provides some general guidelines for writing testable code.

It basically comes down to removing complexity.

As a primer, watch:

[![Simplicity Matters](http://img.youtube.com/vi/rI8tNMsozo0/0.jpg)](https://youtu.be/rI8tNMsozo0?t=47s)

## General rules
1. Separate side effect code and purely functional code.
2. Functions should do one thing and one thing only.
3. Functions should be small
4. Favor composition over inheritance
5. Mock out the side effects.
6. Inject dependencies into function

## Separate side effects and purely functional code

Part of making code testable means you can eliminate possibilities and test just one thing at a time.

Code with side effects add complexity in the following ways:
1. I/O is non-deterministic.
2. I/O is slow.
3. External services (HTTP servers, databases) must be set up and configured for a test environment.

### Side effects add complexity

Consider the following code:

    function getTenants() {
       const unscopedToken = localStorage.getItem('unscopedToken')
       return fetch('/keystone/v3/auth/projects',
         {
           method: 'GET',
           headers: { 'x-auth-token': unscopedToken }
         }
       )
    }

What scenarios would we need to consider when testing that code?  Here are a few:
1. What happens if `localStorage` doesn't exist?  Node.js doesn't have `localStorage`.
2. What happens if `localStorage.getItem('unscopedToken')` doesn't have that value set?
3. What happens if the `fetch` call fails?  How do we differentiate it?

The primary concern of the function is whether it makes the correct http call, to the correct url, with the correct parameters.

How can we re-rewrite the function to concentrate on its main concern and eliminate the other concerns?

1. Mock out anything that involves getting the value from a non-deterministic system (I/O, database, filesystem, etc).  Perform the side effects somewhere else and pass in the value to the function itself.
2. Mock out functionality that has side effects that we are not concerned with.

Let's rewrite the code to eliminate the 2 side effects (`localStorage` and the `fetch` call).

    function getTenants(unscopedToken, fetch) {
      return fetch('/keystone/v3/auth/projects',
        {
          method: 'GET',
          headers: { 'x-auth-token': unscopedToken' }
        }
      )
    }
    const mockFetch = ...  // return the response
    getTenants('secretToken', mockFetch)

Now the only things we need to worry about are if the function uses the `unscopedToken` in the correct manner and does it call `fetch` with the correct parameters.

 `expect(mockFetch.mock.calls[0][0]).toEqual('/keystone/v3/auth/projects')`

 `expect(mockFetch.mock.calls[0][1].headers['x-auth-token']).toEqual(unscopedToken)`

> Note: We don't need to actually make an HTTP call, we just need to verify that `fetch` was called with the correct parameters.  We can safely assume that external APIs are working as they should be.

Also, since we have mocked out external I/O, I tests will run much faster.  We don't need to have an actual HTTP server somewhere that can respond to these requests.

## Other considerations

### Code with side effects is slow

Making actual HTTP calls is slow.  It involves network overhead.

### Code with side effects can not be tested in parallel

Integration tests are typically run against actual databases and actual servers.  This is proper—and indeed desired—for testing integrations, but they are completely unwarranted for unit tests.

What happens when you run multiple tests in parallel?  They will clobber each other.

What happens when the tests fail part way through the execution?  Database state can be in an invalid state that causes future tests to fail.  A cleanup state then needs to be added.

### Purely functional code can be tested as a unit test

Strive to separate the parts of code that involve side effects from the parts of code that can be purely functional.

This typically involves passing in the value instead of getting the value in the function itself.

So,

    function foo () {
      const value = getValueFromSideEffect()
    }

becomes

    function foo(value) { ... }

Now, all the possible things that can go wrong with side effects don't need to be considered inside the function.

Also, this function has moved from something that requires an integration test to something that can be tested in a unit test.

> Note: While it is true that `getValueFromSideEffect` can be mocked to be deterministic, this requires additional overhead when writing tests.  It's simpler if it is just passed in.
