import * as parser from 'comment-parser';

export type Comment = parser.Comment;
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

export const parseComment = (comment: string): Comment[] => {
  return parser(comment);
};

export const isTokensComment = (comment: Tag): boolean =>
  comment.tag === 'tokens';
