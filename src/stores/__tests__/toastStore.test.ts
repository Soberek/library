import { useToastStore, toast } from '../toastStore';

describe('toastStore', () => {
  beforeEach(() => {
    useToastStore.getState().clearToasts();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should add a success toast', () => {
    toast.success('Pomyślnie zapisano!');
    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe('Pomyślnie zapisano!');
    expect(toasts[0].severity).toBe('success');
  });

  it('should add an error toast', () => {
    toast.error('Wystąpił błąd');
    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe('Wystąpił błąd');
    expect(toasts[0].severity).toBe('error');
  });

  it('should auto-dismiss toast after duration', () => {
    toast.info('Wiadomość info', 1000);
    expect(useToastStore.getState().toasts).toHaveLength(1);

    jest.advanceTimersByTime(1000);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('should remove toast manually by id', () => {
    const id = toast.info('Do usunięcia');
    expect(useToastStore.getState().toasts).toHaveLength(1);

    toast.dismiss(id);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('should limit active toasts to max 4', () => {
    toast.info('Toast 1');
    toast.info('Toast 2');
    toast.info('Toast 3');
    toast.info('Toast 4');
    toast.info('Toast 5');

    const toasts = useToastStore.getState().toasts;
    expect(toasts.length).toBeLessThanOrEqual(4);
    expect(toasts[toasts.length - 1].message).toBe('Toast 5');
  });
});
