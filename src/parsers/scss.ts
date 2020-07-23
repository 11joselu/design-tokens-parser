import { parseContent, Node, Code } from '../parseContent';
import { parseComment, isTokensComment } from './commentParser';

const SYNTAX = 'scss';

type TokensResult = {
  declaration: string;
  value: string;
  token: string;
};

export const scssParser = (styles: string): TokensResult[] => {
  if (!styles) {
    return [];
  }

  const parsed = parseContent(styles, SYNTAX);
  const nodes = parsed.content as Node[];
  const tokenGroups = getOnlyTokensGroup(nodes);

  return tokenGroups
    .map((group) => {
      return getTokensListByGroup(group, nodes);
    })
    .flat()
    .map(createTokenResultFromNode);
};

export const getOnlyTokensGroup = (nodes: Node[]): Node[] =>
  nodes.filter(isTokenGroup);

const getTokensListByGroup = (group: Node, nodes: Node[]) => {
  const groupStart = group.start as Code;
  const [tokenTag] = getComentTokenTag(group.toString());
  const filteredContent = getOnlyDeclarationNodes(nodes);

  return filteredContent
    .filter((declarationNode) => {
      const start = declarationNode.start as Code;

      return start.line >= groupStart.line;
    })
    .map((node) => {
      node.token = tokenTag ? tokenTag.name : '';

      return node;
    });
};

const createTokenResultFromNode = (node: Node): TokensResult => {
  const propertyNode = node.first('property');
  const variableNode = propertyNode.first('variable');
  const variableIdentNode = variableNode.first('ident');
  const valueNode = node.first('value');

  return {
    declaration: variableIdentNode.toString(),
    value: valueNode.toString(),
    token: node.token || '',
  };
};

const isTokenGroup = (node: Node) =>
  !Array.isArray(node.content) &&
  node.is('multilineComment') &&
  node.content.indexOf('@tokens') > -1;

const getComentTokenTag = (groupContent: string) => {
  return parseComment(groupContent)
    .map(({ tags }) => {
      return tags.filter(isTokensComment).flat();
    })
    .flat();
};

export const getOnlyDeclarationNodes = (nodes: Node[]): Node[] =>
  nodes.filter((node) => node.is('declaration'));
