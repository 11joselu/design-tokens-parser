import { parseContent, Node } from '../parseContent';

const SYNTAX = 'scss';

type TokensResult = {
  declaration: string;
  value: string;
  presenter: string;
  presenterName: string;
};

/**
 * Object
 *   variable: variable Declaration
 *   presenter: Component
 *   value: value of variable declaration
 *   @token Name
 */
export const scssParser = (
  styles: string
): TokensResult | Record<string, unknown> => {
  if (!styles) {
    return {};
  }

  const parsed = parseContent(styles, SYNTAX);
  const content = parsed.content as Node[];
  const filteredContent = content.filter((node) => node.is('declaration'));

  const result = filteredContent.map((node) => {
    const propertyNode = node.first('property');
    const variableNode = propertyNode.first('variable');
    const variableIdentNode = variableNode.first('ident');
    const valueNode = node.first('value');
    const valueIdentNode = valueNode.first('ident');

    return {
      declaration: variableIdentNode.content,
      value: valueIdentNode.content,
      presenter: 'X',
      presenterName: 'xxxx',
    };
  });

  return result[0];
};
