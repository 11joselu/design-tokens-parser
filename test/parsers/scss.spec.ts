import { scssParser, getOnlyDeclarationNodes } from '../../src/parsers/scss';
import { Node, NodeType } from '../../src/parseContent';

describe('scssParser', () => {
  it('given empty string return an empty object ', () => {
    const parsedContent = scssParser('');

    expect(parsedContent).toMatchObject({});
  });

  it('given inline styles create a tokens results correctly', () => {
    const parsedContent = scssParser('$myVar: red');

    expect(parsedContent.value).toBe('red');
    expect(parsedContent.declaration).toBe('myVar');
  });

  it('given multiline styles create a tokens results correctly', () => {
    const parsedContent = scssParser(`
    $myVar: red
    `);

    expect(parsedContent.value).toBe('red');
    expect(parsedContent.declaration).toBe('myVar');
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
