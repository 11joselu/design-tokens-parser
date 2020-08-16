import { parseContent, Node, Code, Syntax } from '../parseContent';
import { parseComment, isTokensComment } from '../commentParser';
import { TokensResult } from './tokenResult';

export const parser = (styles: string, syntax: Syntax): TokensResult[] => {
  const foundDeclarationWithValues: Record<string, string> = {};

  if (!styles) {
    return [];
  }

  const parsed = parseContent(styles, syntax);
  const nodes = parsed.content as Node[];
  const tokenGroups = getOnlyTokensGroup(nodes);

  return tokenGroups
    .map((group, index, list) => {
      return getTokensListByGroup(group, nodes, list[index + 1]);
    })
    .flat()
    .map((value) => {
      return createTokenResultFromNode(value, foundDeclarationWithValues);
    });
};

export const getOnlyTokensGroup = (nodes: Node[]): Node[] =>
  nodes.filter(isTokenGroup);

const getTokensListByGroup = (group: Node, nodes: Node[], nextGroup?: Node) => {
  const groupStart = group.start as Code;
  const [tokenTag] = getComentTokenTag(group.toString());
  const filteredContent = getOnlyDeclarationNodes(nodes);

  return filteredContent
    .filter((declarationNode) => {
      const start = declarationNode.start as Code;
      const nextGroupCode = nextGroup?.start as Code;
      const isBelowToken = start.line >= groupStart.line;

      return nextGroupCode
        ? isBelowToken && nextGroupCode.line > start.line
        : isBelowToken;
    })
    .map((node) => {
      node.token = tokenTag?.name;

      return node;
    });
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

const getOnlyDeclarationNodes = (nodes: Node[]): Node[] =>
  nodes.filter((node) => node.is('declaration'));

const createTokenResultFromNode = (
  node: Node,
  foundDeclarationWithValues: Record<string, string> = {}
): TokensResult => {
  const propertyNode = node.first('property');
  const variableNode = propertyNode.first('variable');
  const variableDeclaration = variableNode.toString();
  const valueNode = node.first('value');
  const value = removeBeginDeclaration(valueNode.toString());

  foundDeclarationWithValues[
    removeBeginDeclaration(variableDeclaration)
  ] = value;

  const tokenResult: TokensResult = {
    declaration: variableDeclaration,
    value: value,
    token: node?.token,
  };

  if (valueNode.first('variable')) {
    tokenResult.value = foundDeclarationWithValues[value];
    tokenResult.reference = valueNode.toString();
  }

  return tokenResult;
};

const removeBeginDeclaration = (valueNode: string) =>
  valueNode.replace(/\$|@/, '');
