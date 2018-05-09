const { version } = require('../package.json')

export default (): Manifest => ({
  name  : 'Multi Row TweetDeck',
  author: 'whatasoda',
  icons : {
    16    : 'icons/icon-16.png',
    48    : 'icons/icon-48.png',
    128   : 'icons/icon-128.png'
  },
  version: version,
  default_locale: 'ja',
  description: message('description'),
  manifest_version: 2,
  content_scripts: [
    {
      matches: ['https://tweetdeck.twitter.com/*'],
      js: ['content.js']
    }
  ],
  permissions: [
    'storage'
  ]
})

const message = (name: string): string => `__MSG_${name}__`


export interface Manifest {

    manifest_version  : 1 | 2
    name              : string
    short_name?       : string
    version           : string

    default_locale  : Locale
    description?    : string
    icons?          : Icons<'16' | '48' | '128', '32'>

    browser_action?: {
      default_icon: Icons<never,'16' | '24' | '32'>
      default_title: string
      default_popup: string
    }
    // page_action?: {...}
    //


    // // Optional
    // action?: ...
    author?: string
    // automation?: ...
    // background?: {
    //   // Recommended
    //   persistent?: false
    // }
    // background_page?: ...
    // chrome_settings_overrides?: {...}
    // chrome_ui_overrides?: {
    //   bookmarks_ui?: {
    //     remove_bookmark_shortcut?: true
    //     remove_button?: true
    //   }
    // }
    // chrome_url_overrides: {...}
    // commands: {...}
    // content_capabilities: ...
    content_scripts: ContentScript[]
    // content_security_policy: "policyString"
    // converted_from_user_script: ...
    // current_locale: ...
    // declarative_net_request: ...
    // devtools_page: "devtools.html"
    // event_rules: [{...}]
    // externally_connectable: {
    //   matches: ["*://*.example.com/*"]
    // }
    // file_browser_handlers: [...]
    // file_system_provider_capabilities: {
    //   configurable: true
    //   multiple_mounts: true
    //   source: "network"
    // }
    // homepage_url: "http://path/to/homepage"
    // import: [{"id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}]
    // incognito: "spanning split or not_allowed"
    // input_components: ...
    // key: "publicKey"
    // minimum_chrome_version: "versionString"
    // nacl_modules: [...]
    // oauth2: ...
    // offline_enabled: true
    // omnibox: {
    //   keyword: "aString"
    // }
    // optional_permissions: ["tabs"]
    // options_page: "options.html"
    // options_ui: {
    //   chrome_style: true
    //   page: "options.html"
    // }
    permissions?: Permissions[]
    // platforms: ...
    // requirements: {...}
    // sandbox: [...]
    // signature: ...
    // spellcheck: ...
    // storage: {
    //   managed_schema: "schema.json"
    // }
    // system_indicator: ...
    // tts_engine: {...}
    // update_url: "http://path/to/updateInfo.xml"
    // version_name: "aString"
    // web_accessible_resources: [...]

}

export type Locale =
  "ar" | "am" | "bg" | "bn" | "ca" | "cs" | "da" | "de" | "el" | "en" |
  "en_GB" | "en_US" | "es" | "es_419" | "et" | "fa" | "fi" | "fil" | "fr" |
  "gu" | "he" | "hi" | "hr" | "hu" | "id" | "it" | "ja" | "kn" | "ko" | "lt" |
  "lv" | "ml" | "mr" | "ms" | "nl" | "no" | "pl" | "pt_BR" | "pt_PT" | "ro" |
  "ru" | "sk" | "sl" | "sr" | "sv" | "sw" | "ta" | "te" | "th" | "tr" | "uk" |
  "vi" | "zh_CN" | "zh_TW"

export type IconSize = '16' | '24' | '32' | '48' | '128'
export type Icons<R extends IconSize = never, O extends IconSize = never> = {
  [S in R]: string
} & {
  [S in O]?: string
}


export interface ContentScript {
  matches : string[]
  css?    : string[]
  js?     : string[]

  exclude_matches?  : string[]
  include_globs?    : string[]
  exclude_globs?    : string[]

  run_at?: 'document_idle' | 'document_start' | 'document_end'

  all_frames?: boolean
}

export type Permissions =
  'activeTab' | 'alarms' | 'background' | 'bookmarks' | 'browsingData' |
  'certificateProvider' | 'clipboardRead' | 'clipboardWrite' |
  'contentSettings' | 'contextMenus' | 'cookies' | 'debugger' |
  'declarativeContent' | 'declarativeNetRequest' | 'declarativeWebRequest' |
  'desktopCapture' | 'displaySource' | 'dns' | 'documentScan' | 'downloads' |
  'enterprise.deviceAttributes' | 'enterprise.platformKeys' | 'experimental' |
  'fileBrowserHandler' | 'fileSystemProvider' | 'fontSettings' | 'gcm' |
  'geolocation' | 'history' | 'identity' | 'idle' | 'idltest' | 'management' |
  'nativeMessaging' | 'networking.config' | 'notifications' | 'pageCapture' |
  'platformKeys' | 'power' | 'printerProvider' | 'privacy' | 'processes' |
  'proxy' | 'sessions' | 'signedInDevices' | 'storage' | 'system.cpu' |
  'system.display' | 'system.memory' | 'system.storage' | 'tabCapture' |
  'tabs' | 'topSites' | 'tts' | 'ttsEngine' | 'unlimitedStorage' |
  'vpnProvider' | 'wallpaper' | 'webNavigation' | 'webRequest' |
  'webRequestBlocking'
