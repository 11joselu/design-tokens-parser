import { parseContent, Node } from '../parseContent';

const SYNTAX = 'scss';
type ParserResult = {
  type: string;
  presenter: string;
  value: string;
  tokenName: string;
};

/**
 * Object
 *   variable: variable Declaration
 *   presenter: Component
 *   value: value of variable declaration
 *   @token Name
 */
export const scssParser = (
  content: string
): ParserResult | Record<string, unknown> => {
  const parsed = parseContent(content, SYNTAX);

  return {};
};
