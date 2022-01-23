# jest-mock-internal-method 🐐

Repo for researching mocking functionality in jest.

<p align="center">
<table>
<tbody>
<td align="center">
<img width="2000" height="0"><br>
<b>Checkout the README on the <a href="https://github.com/karlosos/jest-mock-internal-function">main branch</a> of the repo.</b>
<img width="2000" height="0">
</td>
</tbody>
</table>
</p>

## Problem

Mocking the function that is used by the tested component. In this case is function from `src/demo/utils.js` named `getData` which is used by `WelcomeMessage` component which is rendered inside `App`. While testing `App` we want to be able to mock that `getData` function.

## Scripts

- `npm start` - to start the project
- `npm test` - to run test watcher
