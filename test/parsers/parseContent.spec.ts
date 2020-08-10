import { parseContent, Node } from '../../src/parsers/parseContent';

describe('parseContent', () => {
  describe('scss support', () => {
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

  describe('less support', () => {
    it('returns a Node instance', () => {
      const parsedStyles = parseContent('', 'less');
      expect(parsedStyles).toMatchObject({
        type: 'stylesheet',
        content: [],
        syntax: undefined,
        start: [0, 0],
        end: [0, 0],
      });
    });

    it("given 'less' syntax parameter generate correct Node syntax attribute", () => {
      const parsedStyles = parseContent('@color: red;', 'less');

      expect(parsedStyles.syntax).toBe('less');
    });

    describe('Node length', () => {
      it('generate a correct content length from inline styles', () => {
        const parsedStyles = parseContent('@color: red;', 'less');

        expect(parsedStyles.content.length).toBe(2);
      });

      it('generate a correct content length from multiple lines styles', () => {
        const parsedStyles = parseContent(
          `
          @color: red;
      `,
          'less'
        );

        expect(parsedStyles.content.length).toBe(4);
      });

      it('generate a correct content length from multiple lines styles', () => {
        const parsedStyles = parseContent(
          `
            @color: red;
            @border: none;
            @fontSize: 16px;
      `,
          'less'
        );

        const [spaceNode, declarationNode] = parsedStyles.content as Node[];

        expect(spaceNode.type).toBe('space');
        expect(declarationNode.type).toBe('declaration');
        expect(parsedStyles.content.length).toBe(10);
      });

      it('generate a correct content value from multiple lines styles', () => {
        const parsedStyles = parseContent(
          `
            @color: red;
            @border: none;
            @fontSize: 16px;
      `,
          'less'
        );

        const declarationNode = parsedStyles.first('declaration');
        const valueNode = declarationNode.first('value');
        const valueNodecontent = valueNode.content as Node[];

        expect(valueNode.is('value')).toBe(true);
        expect(valueNodecontent[0].content).toBe('red');
      });
    });
  });

  describe('css support', () => {
    it('returns a Node instance', () => {
      const parsedStyles = parseContent('', 'css');
      expect(parsedStyles).toMatchObject({
        type: 'stylesheet',
        content: [],
        syntax: undefined,
        start: [0, 0],
        end: [0, 0],
      });
    });

    it("given 'less' syntax parameter generate correct Node syntax attribute", () => {
      const parsedStyles = parseContent(
        `
        :root {
        --border: 8px;
        }
      `,
        'css'
      );

      expect(parsedStyles.syntax).toBe('css');
    });

    describe('Node length', () => {
      it('generate a correct content length from inline styles', () => {
        const parsedStyles = parseContent(':root {--border: 8px; }', 'css');

        expect(parsedStyles.content.length).toBe(1);
      });

      it('generate a correct content length from multiple lines styles', () => {
        const parsedStyles = parseContent(
          `
          :root {
            --color: red;
          }
      `,
          'css'
        );

        expect(parsedStyles.content.length).toBe(3);
      });

      it('generate a correct content length from multiple lines styles', () => {
        const parsedStyles = parseContent(
          `
          :root {
            --color: red;
          }
      `,
          'css'
        );

        const [spaceNode, ruleset] = parsedStyles.content as Node[];

        expect(spaceNode.type).toBe('space');
        expect(ruleset.type).toBe('ruleset');
        expect(parsedStyles.content.length).toBe(3);

        const block = ruleset.first('block');
        expect(block).not.toBeNull();

        const declaration = block.first('declaration');
        expect(declaration).not.toBeNull();
        expect(declaration.toString()).toBe('--color: red');

        const property = declaration.first('customProperty');
        expect(property.toString()).toBe('--color');

        const value = declaration.first('value');
        expect(value.toString()).toBe('red');
      });
    });
  });
});
