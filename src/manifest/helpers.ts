import { Permissions } from './interface';

const Permissions = (permissions: Permissions[] | string[]): string[] => permissions;

const MSG = (name: string): string => `__MSG_${name}__`;

export { MSG, Permissions };
