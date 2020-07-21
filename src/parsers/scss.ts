import { parseContent, Node, Code } from '../parseContent';

const SYNTAX = 'scss';

type TokensResult = {
  declaration: string;
  value: string;
  presenter: string;
  presenterName: string;
};

export const scssParser = (styles: string): TokensResult[] => {
  if (!styles) {
    return [];
  }

  const parsed = parseContent(styles, SYNTAX);
  const nodes = parsed.content as Node[];
  const tokenGroups = getOnlyTokensGroup(nodes);

  const items = tokenGroups
    .map((group, index) => {
      const groupStart = group.start as Code;
      // const nextTokenGroup = tokenGroups[index];
      const filteredContent = getOnlyDeclarationNodes(nodes);
      const groupedTokens = filteredContent.filter((declarationNode) => {
        const start = declarationNode.start as Code;

        return start.line >= groupStart.line;
      });

      return groupedTokens;
    })
    .flat();

  const result: TokensResult[] = items.map((node) => {
    const propertyNode = node.first('property');
    const variableNode = propertyNode.first('variable');
    const variableIdentNode = variableNode.first('ident');
    const valueNode = node.first('value');
    const valueIdentNode = valueNode.first('ident');

    return {
      declaration: variableIdentNode.content as string,
      value: valueIdentNode.content as string,
      presenter: 'X',
      presenterName: 'xxxx',
    };
  });

  return result;
};

export const getOnlyDeclarationNodes = (nodes: Node[]): Node[] =>
  nodes.filter((node) => node.is('declaration'));

export const getOnlyTokensGroup = (nodes: Node[]): Node[] =>
  nodes.filter(isTokenGroup);

const isTokenGroup = (node: Node) =>
  !Array.isArray(node.content) &&
  node.is('multilineComment') &&
  node.content.indexOf('@tokens') > -1;
