import useStyleModule from './useStyleModule';

const NativeEnvironments = {
  drawerWidth: 400,
  columnHeaderHeight: 50,
};

const initNativeEnvironment = (appContent: HTMLElement) => {
  const drawerObserver = new MutationObserver(() => {
    const width = parseFloat(appContent.style.marginRight || '');

    if (!isNaN(width) && width > 0) {
      drawerObserver.disconnect();
      NativeEnvironments.drawerWidth = width;
      if (useStyleModule.forceUpdate) {
        useStyleModule.forceUpdate();
      }
    }
  });

  drawerObserver.observe(appContent, { attributes: true });
};

export { initNativeEnvironment };

export default NativeEnvironments;
