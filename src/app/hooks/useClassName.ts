type ClassNameModule = Record<string, string>;
type InputArray = Array<string | undefined | false | null>;
type ClassNameType = string | undefined;
const empty: string[] = [];

/**
 * @name ClassNameModule
 * @description It gives hooks-like function. `hooks-like` means "outside of react lifecycle". You can use it within if statement.
 * @param cnm
 */
const ClassNameModule = (cnm: ClassNameModule) => {
  const memoStorage: Record<string, ClassNameType> = {};

  const useClassName = (moduleKeys: InputArray, raw: InputArray = empty): ClassNameType => {
    const memoKey = moduleKeys.join('') + (raw === empty) ? '' : raw.join();
    if (Object.prototype.hasOwnProperty.call(memoStorage, memoKey)) {
      return memoStorage[memoKey];
    }

    const names = moduleKeys.map((key) => key && cnm[key]);
    names.push(...raw);

    return (memoStorage[memoKey] = names.filter(Boolean).join(' ') || undefined);
  };

  return useClassName;
};

export default ClassNameModule;
