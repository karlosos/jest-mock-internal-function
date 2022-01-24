# jest-mock-internal-method 🐐

Repo for researching mocking functionality in jest.

## Problem

Mocking the function that is used by the tested component. In this case is function from `src/demo/utils.js` named `getData` which is used by `WelcomeMessage` component which is rendered inside `App`. While testing `App` we want to be able to mock that `getData` function.

Additionally I had a project that tests were failing suddently after upgrading `react-scripts`. More on this later.

## Solution

### Using `jest.spyOn` fails in CRA 4+ (`react-scripts` 4.X and later) because of `resetMocks` set to `true`

I was trying to recreate [sherwin waters solution](https://stackoverflow.com/a/66669162/3978701) using `jest.spyOn` but it was not working. Create React App changed on version 4.X default value of `resetMocks` to true [[source](https://github.com/facebook/create-react-app/blob/main/CHANGELOG-4.x.md#jest)]. 

To fix this you can redefine this value to `false`, e.g. in `package.json` file:

```
"jest": {
  "resetMocks": false
}
```

**Working example after changing `resetMocks` to `false`:**

```js
// ./demo/welcomeMessage.js
import { getData } from "./utils"

export const WelcomeMessage = ({name}) => {
    return getData(name)
}

// ./demo/utils.js
const getData = (name) => `Hello ${name}!`;

export { getData }

// ./App.js
import { WelcomeMessage } from "./demo/welcomeMessage";

function App() {
  return (
    <div className="App">
      <h1>My app</h1>
      <p>
        <WelcomeMessage name={'John'} />
      </p>
    </div>
  );
}

export default App;

// ./App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';
import * as utils from "./demo/utils";

jest.spyOn(utils, "getData").mockReturnValue("mocked message");  // this doesn't work as intended

describe('App', () => {
  test('renders header', () => {
    render(<App />);
    expect(screen.getByText(/My app/i)).toBeInTheDocument()
  });

  test('renders correct welcome message', () => {
    render(<App />)
    expect(screen.getByText(/mocked message/i)).toBeInTheDocument()
  });
})
```

Below I propose other solutions that don't require changing `jest` config.

### Solution using `jest.spyOn` in `beforeEach`

You can see this solution on [spy-on-before-each](https://github.com/karlosos/jest-mock-internal-function/blob/spy-on-before-each/src/App.test.js) branch. Moving the line:

```
jest.spyOn(utils, "getData").mockReturnValue("mocked message");
```

inside `beforeEach` in `describe` block solves the issue.

```jsx
import * as utils from "./demo/utils";

describe('App', () => {
  beforeEach(() => {
    jest.spyOn(utils, "getData").mockReturnValue("mocked message");
  })

  test('renders correct welcome message', () => {
    render(<App />)
    expect(screen.getByText(/mocked message/i)).toBeInTheDocument()
  });
})
```

Why `jest.spyOn` has to be in `beforeEach` block? Because `resetMocks` resets the module registry before running each individual test. That means you must use `jest.spyOn` inside `beforeEach` or inside `test`/`it` block. Otherwise the mock will not work as it will be cleared. [[documentation on `resetMocks`](https://jestjs.io/docs/configuration#resetmocks-boolean)]

### Solution using `jest.mock`

You can see this solution on [main branch](https://github.com/karlosos/jest-mock-internal-function/blob/main/src/App.test.js).

Instead of using `import * as ...` we can mock our module with `jest.mock`. Following test works fine:

```jsx
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./demo/utils', () => ({
    getData: () => 'mocked message'
}));

describe('App', () => {
  test('renders header', () => {
    render(<App />);
    expect(screen.getByText(/My app/i)).toBeInTheDocument()
  });

  test('renders correct welcome message', () => {
    render(<App />)
    expect(screen.getByText(/mocked message/i)).toBeInTheDocument()
  });
})
```

### Multiple mock implementations with `jest.doMock`

To mock the function with multiple implementations you can use `jest.doMock`. However, the it is required to import modules after mocking. More about `doMock` in [jest documentation](https://jestjs.io/docs/jest-object#jestdomockmodulename-factory-options). Solution based on [this repo by marr](https://github.com/marr/react-test-mock).

Altought it is doable I would suggest using `jest.spyOn`. Define them in `beforeEach` in `describe` blocks or set them directly in tests blocks.

```js
import { render, screen } from '@testing-library/react';

describe('App', () => {
  beforeEach(() => {
    jest.resetModules();
  })

  describe('mocked', () => {
    beforeEach(() => {
      jest.doMock('./demo/utils', () => ({
        getData: () => 'mocked message'
      }));
    })
    test('renders mocked welcome message', async () => {
      const App = (await import('./App')).default;

      render(<App />)
      expect(screen.getByText(/mocked message/i)).toBeInTheDocument()
    });
  })

  describe('another mocked', () => {
    beforeEach(() => {
      jest.doMock('./demo/utils', () => ({
        getData: () => 'another data'
      }));
    })
    test('renders another mocked welcome message', async () => {
      const App = (await import('./App')).default;

      render(<App />)
      expect(screen.getByText(/another data/i)).toBeInTheDocument()
    });
  })
})
```

## Scripts

- `npm start` - to start the project
- `npm test` - to run test watcher
