import { FirstCharUppercasePipe } from './first-char-uppercase.pipe';

describe('FirstCharUppercasePipe', () => {
  it('create an instance', () => {
    const pipe = new FirstCharUppercasePipe();
    expect(pipe).toBeTruthy();
  });
});
