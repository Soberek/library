import { useUIStore } from '../uiStore';

describe('uiStore', () => {
  it('should initialize with cards viewMode', () => {
    expect(useUIStore.getState().viewMode).toBe('cards');
  });

  it('should update viewMode', () => {
    useUIStore.getState().setViewMode('table');
    expect(useUIStore.getState().viewMode).toBe('table');

    useUIStore.getState().setViewMode('cards');
    expect(useUIStore.getState().viewMode).toBe('cards');
  });
});
