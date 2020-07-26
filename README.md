<h1 align="center">Welcome to Preprocessors Design Tokens Parser 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/11joselu" target="_blank">
    <img alt="Twitter: 11joselu" src="https://img.shields.io/twitter/follow/11joselu.svg?style=social" />
  </a>
</p>

Design tokens are design decisions, represented as data, that ensure systematically unified and cohesive product experiences

> This project born from [storybook-design-token](https://github.com/UX-and-I/storybook-design-token)

## Install

```sh
npm install --save design-tokens-parser
```

## Usage

Parse the content of your stylesheets in search of specific comment blocks. Only those that have been indicated as <code>@tokens</code> will be parsed.

The block must indicate using the <code>@tokens</code> <code>presenter</code> property. The **presenter** refers to the example to use in your design tokens.

```javascript
const { scssParser } = require('design-tokens-parser');

const fileContent = `
  /**
   * @tokens Colors
   */
  $myVar: red;
`;

const result = scssParser(fileContent);

// Output
/* [
    {
      declaration: 'myVar',
      value: 'red',
      token: 'Colors',
    },
  ];
*/
```

## Run tests

```sh
npm run test
```

## TODO

- Support LESS
- Support CSS
- Allow to use descriptio block
- Allow variable references as a value

## Author

👤 **Jose Cabrera <joselu11cabrera@gmail.com>**

- Twitter: [@11joselu](https://twitter.com/11joselu)
- Github: [@11joselu](https://github.com/11joselu)
- LinkedIn: [@Jose Cabrera](www.linkedin.com/in/jose-cabrera-8543b9b3)

## Show your support

Give a ⭐️ if this project helped you!
