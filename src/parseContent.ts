import { parse } from 'gonzales-pe';

type Syntax = 'less' | 'scss' | 'css';

export type Node = {
  type: string;
  content: string | Node[];
  syntax?: Syntax;
  start: number;
  end: number;
  first: (type?) => Node;
  is: (type: string) => boolean;
};

export const parseContent = (content: string, syntax: Syntax): Node => {
  return parse(content, { syntax });
};
