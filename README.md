# jest-mock-internal-method 🐐

Repo for researching mocking functionality in jest.

## Problem

Mocking the function that is used by the tested component. In this case is function from `src/demo/utils.js` named `getData` which is used by `WelcomeMessage` component which is rendered inside `App`. While testing `App` we want to be able to mock that `getData` function.

## Solution

### Using `jest.spyOn` fails in 2022

I was trying to recreate [sherwin waters solution](https://stackoverflow.com/a/66669162/3978701) using `jest.spyOn` but it was not working. i still don't know why `jest.spyOn` doesn't work correctly in that case.

**Not working example:**

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

### Solution: using `jest.mock`

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

### Multiple mock implementations - hacky way

To mock the function with multiple implementations you can use `jest.doMock`. However, the it is required to import modules after mocking. More about `doMock` in [jest documentation](https://jestjs.io/docs/jest-object#jestdomockmodulename-factory-options). Solution based on [this repo by marr](https://github.com/marr/react-test-mock).

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
