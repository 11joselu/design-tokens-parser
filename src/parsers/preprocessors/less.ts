import { TokensResult } from './tokenResult';
import { parser } from './parser';

const SYNTAX = 'less';

export const lessParser = (styles: string): TokensResult[] => {
  return parser(styles, SYNTAX);
};
