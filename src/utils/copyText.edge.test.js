import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyText } from './copyText';

afterEach(() => {
  vi.unstubAllGlobals();
  delete document.execCommand;
  document.body.innerHTML = '';
});

describe('copyText failure cleanup', () => {
  it('rejects a failed fallback copy and always removes its temporary textarea', async () => {
    vi.stubGlobal('navigator', {});
    document.execCommand = vi.fn().mockReturnValue(false);

    await expect(copyText('uncopied evidence')).rejects.toThrow('Copy command was rejected');

    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(document.querySelector('textarea')).toBeNull();
  });
});
