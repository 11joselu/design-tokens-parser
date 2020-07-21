import { scssParser } from '../../src/parsers/scss';

describe('scssParser', () => {
  it('given empty string return an empty object ', () => {
    const parsedContent = scssParser('');

    expect(parsedContent).toMatchObject({});
  });
});
