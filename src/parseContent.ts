import { parse } from 'gonzales-pe';

type Syntax = 'less' | 'scss' | 'css';

export type NodeType =
  | 'declaration'
  | 'property'
  | 'propertyDelimiter'
  | 'space'
  | 'value'
  | 'variable'
  | 'ident'
  | 'multilineComment';

export type Code = {
  line: number;
  column: number;
};

export type Node = {
  type: NodeType;
  content: string | Node[];
  syntax?: Syntax;
  start: number | Code;
  end: number | Code;
  first: (type?: NodeType) => Node;
  is: (type: NodeType) => boolean;
};

export const parseContent = (content: string, syntax: Syntax): Node => {
  return parse(content, { syntax });
};
