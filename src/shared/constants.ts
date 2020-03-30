declare const InstallTrigger: any;
export const isFirefox = typeof InstallTrigger !== 'undefined';

export const HEADER_HEIGHT = {
  default: 50,
  medium: 40,
  small: 30,
};

export const MIN_COLUMN_WIDTH = 100;
export const MIN_DRAWER_WIDTH = 220;
export const MAX_GAP_SIZE = 50;

export const MAX_PROFILE_COUNT = 30;

export const ROOT_CLASS_NAME = 'multi-row';
export const ROOT_SELECTOR = 'html.multi-row body.multi-row';
export const EXTENSION_ID = process.env.EXTENSION_ID!;

export const WEB_EVENT = (<T extends string>(inputs: readonly T[]): Record<T, string> => {
  return inputs.reduce<Record<string, string>>((acc, key) => {
    acc[key] = `${EXTENSION_ID}:${key}`;
    return acc;
  }, {});
})(['installed'] as const);
