import useStyleModule from './useStyleModule';

const NativeEnvironments = {
  drawerWidth: 400,
  columnHeaderHeight: 50,
};

const Detected = {
  drawerWidth: false,
};

const initNativeEnvironment = (appContent: HTMLElement) => {
  let drawerObserver: null | MutationObserver = null;

  const detectDrawer = () => {
    const width = parseFloat(appContent.style.marginRight || '');

    if (!isNaN(width) && width > 0) {
      NativeEnvironments.drawerWidth = width;
      Detected.drawerWidth = true;

      if (drawerObserver) {
        drawerObserver.disconnect();
      }

      if (useStyleModule.forceUpdate) {
        useStyleModule.forceUpdate();
      }
    }
  };

  detectDrawer();

  if (!Detected.drawerWidth) {
    drawerObserver = new MutationObserver(detectDrawer);
    drawerObserver.observe(appContent, { attributes: true });
  }
};

export { initNativeEnvironment };

export default NativeEnvironments;
