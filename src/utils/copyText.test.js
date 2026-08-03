import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyText } from './copyText';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('copyText', () => {
  it('uses the Clipboard API when it is available', async () => {
    const writeText = vi.fn().mockResolvedValue();
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    await copyText('verified trip');

    expect(writeText).toHaveBeenCalledWith('verified trip');
  });

  it('falls back to a selected textarea when the Clipboard API is blocked', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('blocked'));
    const execCommand = vi.fn().mockReturnValue(true);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    document.execCommand = execCommand;

    await copyText('verified evidence');

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(document.querySelector('textarea')).toBeNull();
  });
});
