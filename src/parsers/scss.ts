import { parseContent, Node, Code } from '../parseContent';

const SYNTAX = 'scss';

type TokensResult = {
  declaration: string;
  value: string;
  presenter: string;
};

export const scssParser = (styles: string): TokensResult[] => {
  if (!styles) {
    return [];
  }

  const parsed = parseContent(styles, SYNTAX);
  const nodes = parsed.content as Node[];
  const tokenGroups = getOnlyTokensGroup(nodes);

  const result: TokensResult[] = tokenGroups
    .map((group) => {
      return getTokensListByGroup(group, nodes);
    })
    .flat()
    .map(createTokenResultFromNode);

  return result;
};

export const getOnlyTokensGroup = (nodes: Node[]): Node[] =>
  nodes.filter(isTokenGroup);

const getTokensListByGroup = (group: Node, nodes: Node[]) => {
  const groupStart = group.start as Code;
  const filteredContent = getOnlyDeclarationNodes(nodes);
  const groupedTokens = filteredContent.filter((declarationNode) => {
    const start = declarationNode.start as Code;

    return start.line >= groupStart.line;
  });

  return groupedTokens;
};

const createTokenResultFromNode = (node: Node): TokensResult => {
  const propertyNode = node.first('property');
  const variableNode = propertyNode.first('variable');
  const variableIdentNode = variableNode.first('ident');
  const valueNode = node.first('value');

  return {
    declaration: variableIdentNode.toString(),
    value: valueNode.toString(),
    presenter: '',
  };
};

const isTokenGroup = (node: Node) =>
  !Array.isArray(node.content) &&
  node.is('multilineComment') &&
  node.content.indexOf('@tokens') > -1;

export const getOnlyDeclarationNodes = (nodes: Node[]): Node[] =>
  nodes.filter((node) => node.is('declaration'));
