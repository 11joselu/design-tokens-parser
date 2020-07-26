import parse = require('comment-parser/parser.js');

export type Tag = {
  /**
   * The tag's kind, eg `param` or `return`.
   */
  tag: string;
  /**
   * The name of this tag, ie the first word after the tag. Empty string if no name was specified.
   */
  name: string;
};

export interface Comment {
  tags: Tag[];
  line: number;
  description: string;
  source: string;
}

export const parseComment = (comment: string): Comment[] => {
  return parse(comment);
};

export const isTokensComment = (comment: Tag): boolean =>
  comment.tag === 'tokens';
