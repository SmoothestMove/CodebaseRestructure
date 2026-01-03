import { describe, it, expect } from 'vitest';
import {
  getItemStatusDisplayLabel,
  getItemStatusOptionsForSelect,
  MOVING_STATUS_LABELS,
} from '../statusUtils';
import { ItemStatus } from '@/types';

describe('statusUtils', () => {
  describe('getItemStatusDisplayLabel', () => {
    it('should return the correct label for a known status', () => {
      expect(getItemStatusDisplayLabel(ItemStatus.PACKED)).toBe('Packed');
      expect(getItemStatusDisplayLabel(ItemStatus.DELIVERED)).toBe('Delivered');
    });

    it('should return "Status Unknown" for UNKNOWN status', () => {
      expect(getItemStatusDisplayLabel(ItemStatus.UNKNOWN)).toBe('Status Unknown');
    });
  });

  describe('getItemStatusOptionsForSelect', () => {
    it('should return an array of options excluding UNKNOWN', () => {
      const options = getItemStatusOptionsForSelect();

      // Check that we have options
      expect(options.length).toBeGreaterThan(0);

      // Check structure
      expect(options[0]).toHaveProperty('value');
      expect(options[0]).toHaveProperty('label');

      // Ensure UNKNOWN is not present
      const unknownOption = options.find((opt) => opt.value === ItemStatus.UNKNOWN);
      expect(unknownOption).toBeUndefined();
    });

    it('should match the labels in MOVING_STATUS_LABELS', () => {
      const options = getItemStatusOptionsForSelect();
      options.forEach((option) => {
        expect(option.label).toBe(MOVING_STATUS_LABELS[option.value]);
      });
    });
  });
});
