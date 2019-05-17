declare module 'warning' {
  export default warning;

  function warning(condition: any, format?: string, ...extra: any[]): void;
}
