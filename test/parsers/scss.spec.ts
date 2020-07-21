import { scssParser } from '../../src/parsers/scss';

describe('scssParser', () => {
  it('given empty string return an empty object ', () => {
    const parsedContent = scssParser('');

    expect(parsedContent).toMatchObject({});
  });

  it('generate styles tokens correctly', () => {
    const parsedContent = scssParser('$myVar: red');

    expect(parsedContent.value).toBe('red');
    expect(parsedContent.declaration).toBe('myVar');
  });
});
