import { parseContent, Node } from '../src/parseContent';

describe('parseContent', () => {
  it('returns a Node instance', () => {
    const parsedStyles = parseContent('', 'scss');
    expect(parsedStyles).toMatchObject({
      type: 'stylesheet',
      content: [],
      syntax: undefined,
      start: [0, 0],
      end: [0, 0],
    });
  });

  it("given 'scss' syntax parameter generate correct Node syntax attribute", () => {
    const parsedStyles = parseContent('$color: red;', 'scss');

    expect(parsedStyles.syntax).toBe('scss');
  });

  describe('Node length', () => {
    it('generate a correct content length from inline styles', () => {
      const parsedStyles = parseContent('$color: red;', 'scss');

      expect(parsedStyles.content.length).toBe(2);
    });

    it('generate a correct content length from multiple lines styles', () => {
      const parsedStyles = parseContent(
        `
      $color: red;
      `,
        'scss'
      );

      expect(parsedStyles.content.length).toBe(4);
    });

    it('generate a correct content length from multiple lines styles', () => {
      const parsedStyles = parseContent(
        `
      $color: red;
      $border: none;
      $fontSize: 16px;
      `,
        'scss'
      );

      const [spaceNode, declarationNode] = parsedStyles.content as Node[];

      expect(spaceNode.type).toBe('space');
      expect(declarationNode.type).toBe('declaration');
      expect(parsedStyles.content.length).toBe(10);
    });

    it('generate a correct content value from multiple lines styles', () => {
      const parsedStyles = parseContent(
        `
      $color: red;
      $border: none;
      $fontSize: 16px;
      `,
        'scss'
      );

      const declarationNode = parsedStyles.first('declaration');
      const valueNode = declarationNode.first('value');
      const valueNodecontent = valueNode.content as Node[];

      expect(valueNode.is('value')).toBe(true);
      expect(valueNodecontent[0].content).toBe('red');
    });
  });
});
