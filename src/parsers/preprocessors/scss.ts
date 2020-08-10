import { TokensResult } from './tokenResult';
import { parser } from './parser';

const SYNTAX = 'scss';

export const scssParser = (styles: string): TokensResult[] => {
  return parser(styles, SYNTAX);
};
