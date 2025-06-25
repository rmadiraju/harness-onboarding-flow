import { releaseComponentPlugin } from './plugin';

describe('release-component', () => {
  it('should export plugin', () => {
    expect(releaseComponentPlugin).toBeDefined();
  });
});
