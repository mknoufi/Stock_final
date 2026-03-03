import { copyToClipboard, getFromClipboard } from '../clipboard';
import * as Clipboard from 'expo-clipboard';
import { Platform } from 'react-native';

// Mock expo-clipboard
jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
  getStringAsync: jest.fn(),
}));

describe('clipboard utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('copyToClipboard', () => {
    it('copies text to clipboard successfully', async () => {
      (Clipboard.setStringAsync as jest.Mock).mockResolvedValue(true);
      const result = await copyToClipboard('test text');
      expect(Clipboard.setStringAsync).toHaveBeenCalledWith('test text');
      expect(result).toBe(true);
    });

    it('handles copy failure gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (Clipboard.setStringAsync as jest.Mock).mockRejectedValue(new Error('Copy failed'));

      const result = await copyToClipboard('test text');
      expect(Clipboard.setStringAsync).toHaveBeenCalledWith('test text');
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to copy to clipboard:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('handles showAlert parameter', async () => {
      (Clipboard.setStringAsync as jest.Mock).mockResolvedValue(true);
      // Testing with showAlert=false
      const result = await copyToClipboard('test text', false);
      expect(Clipboard.setStringAsync).toHaveBeenCalledWith('test text');
      expect(result).toBe(true);
    });
  });

  describe('getFromClipboard', () => {
    it('gets text from clipboard successfully', async () => {
      (Clipboard.getStringAsync as jest.Mock).mockResolvedValue('clipboard content');
      const result = await getFromClipboard();
      expect(Clipboard.getStringAsync).toHaveBeenCalled();
      expect(result).toBe('clipboard content');
    });

    it('returns null when clipboard is empty', async () => {
      (Clipboard.getStringAsync as jest.Mock).mockResolvedValue('');
      const result = await getFromClipboard();
      expect(result).toBe(null);
    });

    it('handles get failure gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (Clipboard.getStringAsync as jest.Mock).mockRejectedValue(new Error('Get failed'));

      const result = await getFromClipboard();
      expect(result).toBe(null);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to get from clipboard:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});
