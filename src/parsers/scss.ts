import { parseContent, Node } from '../parseContent';

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
  const content = parsed.content as Node[];
  const filteredContent = getOnlyDeclarationNodes(content);

  const result: TokensResult[] = filteredContent.map((node) => {
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

export const getOnlyDeclarationNodes = (content: Node[]): Node[] =>
  content.filter((node) => node.is('declaration'));
