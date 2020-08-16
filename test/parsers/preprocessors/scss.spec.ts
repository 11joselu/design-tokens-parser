import { scssParser } from '@src/parsers/preprocessors/scss';

describe('scssParser', () => {
  describe('styles parser', () => {
    it('given empty string return an empty object ', () => {
      const parsedContent = scssParser('');

      expect(parsedContent.length).toBe(0);
    });

    it('should not parse non commented tokens', () => {
      const styles = `
          $myVar: red;
          $mySecondVar: blue;
    `;

      const parsedContent = scssParser(styles);

      expect(parsedContent.length).toBe(0);
    });

    it('given multiline styles create a tokens results correctly', () => {
      const [parsedContent] = scssParser(`
        /**
         * @tokens Colors

         */
        $myVar: red;
      `);

      expect(parsedContent.value).toBe('red');
      expect(parsedContent.declaration).toBe('myVar');
    });

    it('given multiline styles with multiple variables declarations create a tokens results correctly', () => {
      const styles = `
      /**
       * @tokens Colors
       */
        $myVar: red;
        $mySecondVar: blue;
    `;

      const parsedContent = scssParser(styles);
      const [myVar, mySecondVar] = parsedContent;

      expect(parsedContent.length).toBe(2);
      expect(myVar.declaration).toBe('myVar');
      expect(myVar.value).toBe('red');
      expect(mySecondVar.declaration).toBe('mySecondVar');
      expect(mySecondVar.value).toBe('blue');
    });

    it('allow rgb and rgba values', () => {
      const styles = `
      /**
       * @tokens Colors
       */
        $rgb: rgb(255, 255, 255);
        $rgba: rgba(255, 255, 255, 0.5);
    `;
      const expectedResult = [
        {
          declaration: 'rgb',
          value: 'rgb(255, 255, 255)',
          token: 'Colors',
        },
        {
          declaration: 'rgba',
          value: 'rgba(255, 255, 255, 0.5)',
          token: 'Colors',
        },
      ];

      const parsedContent = scssParser(styles);

      expect(parsedContent).toMatchObject(expectedResult);
    });
  });

  it('allow box shadows values', () => {
    const styles = `
      /**
       * @tokens Colors
       */
        $boxshadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
        $boxshadowTwo: 0 0 0 10px hsl(0, 0%, 80%), 0 0 0 15px hsl(0, 0%, 90%);
    `;
    const expectedResult = [
      {
        declaration: 'boxshadow',
        token: 'Colors',
        value: '10px 10px 5px 0px rgba(0,0,0,0.75)',
      },
      {
        declaration: 'boxshadowTwo',
        token: 'Colors',
        value: '0 0 0 10px hsl(0, 0%, 80%), 0 0 0 15px hsl(0, 0%, 90%)',
      },
    ];

    const parsedContent = scssParser(styles);

    expect(parsedContent).toMatchObject(expectedResult);
  });

  describe('Tokens tokenss', () => {
    it('detect Color tokens', () => {
      const token = `
     /**
       * @tokens Colors
       */
        $color: #fff;
    `;
      const expectedResult = [
        {
          declaration: 'color',
          value: '#fff',
          token: 'Colors',
        },
      ];

      const parsedContent = scssParser(token);

      expect(parsedContent).toMatchObject(expectedResult);
    });

    it('detect tokens type by multiple tokens groups', () => {
      const token = `
     /**
       * @tokens Colors
       */
        $color: #fff;

      /**
       * @tokens Shadow
       */
        $shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
    `;
      const expectedResult = [
        {
          declaration: 'color',
          value: '#fff',
          token: 'Colors',
        },
        {
          declaration: 'shadow',
          value: '10px 10px 5px 0px rgba(0,0,0,0.75)',
          token: 'Shadow',
        },
      ];

      const parsedContent = scssParser(token);

      expect(parsedContent).toMatchObject(expectedResult);
    });

    it('omit not tokenize comments', () => {
      const token = `
     /**
       * This is a comment
       */
        $color: #fff;
    `;
      const expectedResult = [];

      const parsedContent = scssParser(token);

      expect(parsedContent).toMatchObject(expectedResult);
    });

    it('omit jsdoc comments block with @', () => {
      const token = `
     /**
       * @item
       * This is a comment
       */
        $color: #fff;
    `;
      const expectedResult = [];

      const parsedContent = scssParser(token);

      expect(parsedContent).toMatchObject(expectedResult);
    });
  });

  describe('variable references', () => {
    it('should get value from variable reference', () => {
      const token = `
     /**
       * @tokens Colors
       */
        $blue: cyan;
        $red: tomato;

        $primary: $blue;
        $secondary: $red;
    `;

      const expectedResult = [
        {
          declaration: 'blue',
          value: 'cyan',
          token: 'Colors',
        },
        {
          declaration: 'red',
          value: 'tomato',
          token: 'Colors',
        },
        {
          declaration: 'primary',
          value: 'cyan',
          token: 'Colors',
          reference: '$blue',
        },
        {
          declaration: 'secondary',
          value: 'tomato',
          token: 'Colors',
          reference: '$red',
        },
      ];

      const parsedContent = scssParser(token);

      expect(parsedContent).toMatchObject(expectedResult);
    });
  });
});
