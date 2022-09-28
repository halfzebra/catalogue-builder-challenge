import { canBuildFrom } from './collection-analysis';

describe('canBuildFrom', () => {
  it('returns true for collections that include required parts', () => {
    expect(
      canBuildFrom(
        new Map([['3001', new Map([['1', 2]])]]),
        new Map([['3001', new Map([['1', 2]])]]),
      ),
    ).toBe(true);
  });

  it('returns false for collections that include required parts', () => {
    expect(
      canBuildFrom(
        new Map([['3001', new Map([['3', 1]])]]),
        new Map([['3001', new Map([['1', 2]])]]),
      ),
    ).toBe(false);
  });
});
