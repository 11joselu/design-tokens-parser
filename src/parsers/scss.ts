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
    const valueIdentNode =
      valueNode.first('ident') ||
      valueNode.first('function') ||
      valueNode.first('color') ||
      valueNode.first('dimension');

    let nodeContent = valueIdentNode.content as string;

    if (valueIdentNode.is('function')) {
      nodeContent = getFunctionValues(valueIdentNode);
    }

    return {
      declaration: variableIdentNode.content as string,
      value: nodeContent,
      presenter: '',
      presenterName: '',
    };
  });

  return result;
};

export const getOnlyTokensGroup = (nodes: Node[]): Node[] =>
  nodes.filter(isTokenGroup);

const isTokenGroup = (node: Node) =>
  !Array.isArray(node.content) &&
  node.is('multilineComment') &&
  node.content.indexOf('@tokens') > -1;

export const getOnlyDeclarationNodes = (nodes: Node[]): Node[] =>
  nodes.filter((node) => node.is('declaration'));

const getFunctionValues = (node: Node): string => {
  const ident = node.first('ident');
  const argumentsContent = node.first('arguments').content as Node[];
  let nodeContent = ident.content as string;
  nodeContent += `(${argumentsContent.map((node) => node.content).join('')})`;

  return nodeContent;
};
