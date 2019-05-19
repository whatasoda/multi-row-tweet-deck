export interface Manifest {
  manifest_version: 1 | 2;
  name: string;
  short_name?: string;
  version: string;
  default_locale: Locale;
  description?: string;
  icons?: Record<'16' | '48' | '128', string> & Partial<Record<'32', string>>;
  browser_action?: {
    default_icon?: Partial<Record<'16' | '24' | '32', string>>;
    default_title?: string;
    default_popup?: string;
  };
  page_action?: {
    default_icon?: Partial<Record<'16' | '24' | '32', string>>;
    default_title?: string;
    default_popup?: string;
  };
  author?: string;
  background?: {
    scripts?: string[];
    persistent?: boolean;
  };
  content_scripts: ContentScript[];
  key?: string;
  minimum_chrome_version: string;
  oauth2?: OAuth2;
  permissions?: string[];
  web_accessible_resources?: string[];
}

export type Locale =
  | 'ar'
  | 'am'
  | 'bg'
  | 'bn'
  | 'ca'
  | 'cs'
  | 'da'
  | 'de'
  | 'el'
  | 'en'
  | 'en_GB'
  | 'en_US'
  | 'es'
  | 'es_419'
  | 'et'
  | 'fa'
  | 'fi'
  | 'fil'
  | 'fr'
  | 'gu'
  | 'he'
  | 'hi'
  | 'hr'
  | 'hu'
  | 'id'
  | 'it'
  | 'ja'
  | 'kn'
  | 'ko'
  | 'lt'
  | 'lv'
  | 'ml'
  | 'mr'
  | 'ms'
  | 'nl'
  | 'no'
  | 'pl'
  | 'pt_BR'
  | 'pt_PT'
  | 'ro'
  | 'ru'
  | 'sk'
  | 'sl'
  | 'sr'
  | 'sv'
  | 'sw'
  | 'ta'
  | 'te'
  | 'th'
  | 'tr'
  | 'uk'
  | 'vi'
  | 'zh_CN'
  | 'zh_TW';

export type IconSize = '16' | '24' | '32' | '48' | '128';
export interface ContentScript {
  matches: string[];
  css?: string[];
  js?: string[];

  exclude_matches?: string[];
  include_globs?: string[];
  exclude_globs?: string[];

  run_at?: 'document_idle' | 'document_start' | 'document_end';

  all_frames?: boolean;
}

export type Permissions =
  | 'activeTab'
  | 'alarms'
  | 'background'
  | 'bookmarks'
  | 'browsingData'
  | 'certificateProvider'
  | 'clipboardRead'
  | 'clipboardWrite'
  | 'contentSettings'
  | 'contextMenus'
  | 'cookies'
  | 'debugger'
  | 'declarativeContent'
  | 'declarativeNetRequest'
  | 'declarativeWebRequest'
  | 'desktopCapture'
  | 'displaySource'
  | 'dns'
  | 'documentScan'
  | 'downloads'
  | 'enterprise.deviceAttributes'
  | 'enterprise.platformKeys'
  | 'experimental'
  | 'fileBrowserHandler'
  | 'fileSystemProvider'
  | 'fontSettings'
  | 'gcm'
  | 'geolocation'
  | 'history'
  | 'identity'
  | 'idle'
  | 'idltest'
  | 'management'
  | 'nativeMessaging'
  | 'networking.config'
  | 'notifications'
  | 'pageCapture'
  | 'platformKeys'
  | 'power'
  | 'printerProvider'
  | 'privacy'
  | 'processes'
  | 'proxy'
  | 'sessions'
  | 'signedInDevices'
  | 'storage'
  | 'system.cpu'
  | 'system.display'
  | 'system.memory'
  | 'system.storage'
  | 'tabCapture'
  | 'tabs'
  | 'topSites'
  | 'tts'
  | 'ttsEngine'
  | 'unlimitedStorage'
  | 'vpnProvider'
  | 'wallpaper'
  | 'webNavigation'
  | 'webRequest'
  | 'webRequestBlocking';

interface OAuth2 {
  client_id: string;
  scopes: string[];
}

export type ManifestMessage = Record<string, ManifestMessageObject>;
type ManifestMessageObject = {
  message: string;
  description: string;
  placeholders?: Record<string, Record<'content' | 'example', string>>;
};
