import { useUIStore } from '../uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      viewMode: 'cards',
      sidebarCollapsed: false,
      commandPaletteOpen: false,
    });
  });

  it('should initialize with cards viewMode', () => {
    expect(useUIStore.getState().viewMode).toBe('cards');
  });

  it('should update viewMode', () => {
    useUIStore.getState().setViewMode('table');
    expect(useUIStore.getState().viewMode).toBe('table');

    useUIStore.getState().setViewMode('cards');
    expect(useUIStore.getState().viewMode).toBe('cards');
  });

  it('should toggle and set sidebarCollapsed', () => {
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);

    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);

    useUIStore.getState().setSidebarCollapsed(false);
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
  });

  it('should toggle and set commandPaletteOpen', () => {
    expect(useUIStore.getState().commandPaletteOpen).toBe(false);

    useUIStore.getState().toggleCommandPalette();
    expect(useUIStore.getState().commandPaletteOpen).toBe(true);

    useUIStore.getState().setCommandPaletteOpen(false);
    expect(useUIStore.getState().commandPaletteOpen).toBe(false);
  });
});
