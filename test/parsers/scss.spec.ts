import { scssParser, getOnlyDeclarationNodes } from '../../src/parsers/scss';
import { Node, NodeType } from '../../src/parseContent';

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
         * @presenter Color
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
       * @presenter Color
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
       * @presenter Color
       */
        $rgb: rgb(255, 255, 255);
        $rgba: rgba(255, 255, 255, 0.5);
    `;
      const expectedResult = [
        {
          declaration: 'rgb',
          value: 'rgb(255, 255, 255)',
          presenter: '',
          presenterName: '',
        },
        {
          declaration: 'rgba',
          value: 'rgba(255, 255, 255, 0.5)',
          presenter: '',
          presenterName: '',
        },
      ];

      const parsedContent = scssParser(styles);

      expect(parsedContent).toMatchObject(expectedResult);
    });
  });

  describe('getOnlyDeclarationNodes', () => {
    it('filter correctly array of nodes by his type', () => {
      const nodes = [
        createNode('declaration'),
        createNode('ident'),
        createNode('declaration'),
      ];

      const filteredNodes = getOnlyDeclarationNodes(nodes);

      expect(filteredNodes.length).toBe(2);
    });
  });
});

function createNode(type: NodeType): Node {
  return {
    type,
    content: '',
    start: -1,
    end: -1,
    first: (type?: NodeType) => createNode(type),
    is: function (validationType) {
      return this.type === validationType;
    },
  };
}
