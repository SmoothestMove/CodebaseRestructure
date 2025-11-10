import { ItemStatus } from '@/types';

/**
 * A map of item statuses to their display labels.
 * @type {Record<ItemStatus, string>}
 */
export const MOVING_STATUS_LABELS: Record<ItemStatus, string> = {
  [ItemStatus.PREPARED]: 'Prepared',
  [ItemStatus.PACKED]: 'Packed',
  [ItemStatus.LOADED]: 'Loaded',
  [ItemStatus.UNLOADED]: 'Unloaded',
  [ItemStatus.DELIVERED]: 'Delivered',
  [ItemStatus.UNPACKED]: 'Unpacked',
  [ItemStatus.UNKNOWN]: 'Status Unknown',
};

/**
 * Gets the display label for an item status.
 * @param {ItemStatus} status - The item status.
 * @returns {string} The display label.
 */
export const getItemStatusDisplayLabel = (status: ItemStatus): string => {
  return MOVING_STATUS_LABELS[status] || MOVING_STATUS_LABELS[ItemStatus.UNKNOWN];
};

/**
 * Gets a list of item status options for a select input.
 * @returns {{value: ItemStatus, label: string}[]} A list of options.
 */
export const getItemStatusOptionsForSelect = () => {
    return (Object.keys(ItemStatus) as Array<keyof typeof ItemStatus>)
        .filter(key => ItemStatus[key] !== ItemStatus.UNKNOWN) // Exclude UNKNOWN from select options typically
        .map(key => ({
            value: ItemStatus[key] as ItemStatus,
            label: MOVING_STATUS_LABELS[ItemStatus[key] as ItemStatus]
        }));
};