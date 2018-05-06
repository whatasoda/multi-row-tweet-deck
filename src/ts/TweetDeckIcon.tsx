import * as React from 'react'
import cc from './util/composeClassName'
export type SFC<T> = (props: DetailedHTMLProps<T>) => JSX.Element

interface TweetDeckIcon {
  (
    shape       : TweetDeckIconType,
    ...options  : TweetDeckIconsOption[]
  ): SFC<HTMLSpanElement>

  isType      (target?: string): target is TweetDeckIconType
  isColor     (target?: string): target is TweetDeckIconColor
  isSize      (target?: string): target is TweetDeckIconSize
  isPosition  (target?: string): target is TweetDeckIconPosition
}

function TDIcon (
  shape       : TweetDeckIconType,
  ...options  : TweetDeckIconsOption[]
): SFC<HTMLSpanElement> {
  const classNames = ['icon', `icon-${shape}`]
  for (const option of options) {
    classNames.push(`icon-${option}`)
  }

  const className = classNames.join(' ')

  if (!SFCs[className]) {
    SFCs[className] = (props: DetailedHTMLProps<HTMLSpanElement>) => (
      <i {...props} className={cc(className, props)}></i>
    )
  }

  return SFCs[className]
}
export default TDIcon as TweetDeckIcon

function defineMethod<T extends keyof TweetDeckIcon> (
  name: T,
  fn: TweetDeckIcon[T]
): void {
  Reflect.defineProperty(TDIcon, name, {
    configurable: true,
    enumerable: false,
    value: fn,
    writable: true
  });
};

defineMethod('isType', function (
    target?: string
  ): target is TweetDeckIconType {
    return TDIconType.includes(target as TweetDeckIconType)
  }
)

defineMethod('isColor', function (
    target?: string
  ): target is TweetDeckIconColor {
    return TDIconColor.includes(target as TweetDeckIconColor)
  }
)

defineMethod('isSize', function (
    target?: string
  ): target is TweetDeckIconSize {
    return TDIconSize.includes(target as TweetDeckIconSize)
  }
)

defineMethod('isPosition', function (
    target?: string
  ): target is TweetDeckIconPosition {
    return TDIconPosition.includes(target as TweetDeckIconPosition)
  }
)

const SFCs: StringMap<SFC<HTMLSpanElement>> = {}

export type TweetDeckIconType =
  'toggle-on' | 'toggle-off' | 'twitter-bird' | 'mention' | 'following' |
  'message' | 'home' | 'hashtag' | 'reply' | 'favorite' | 'retweet' |
  'retweet-filled' | 'drafts' | 'search' | 'trash' | 'close' | 'arrow-r' |
  'arrow-l' | 'protected' | 'list' | 'list-filled' | 'camera' | 'more' |
  'settings' | 'notifications' | 'user-dd' | 'activity' | 'trending' |
  'minus' | 'plus' | 'geo' | 'check' | 'schedule' | 'dot' | 'user' |
  'user-filled' | 'content' | 'arrow-d' | 'arrow-u' | 'share' | 'info' |
  'verified' | 'translator' | 'blocked' | 'circle-error' | 'constrain' |
  'play-video' | 'empty' | 'clear-input' | 'compose' | 'mark-read' |
  'arrow-r-double' | 'arrow-l-double' | 'follow' | 'image' | 'popout' |
  'move' | 'compose-grid' | 'compose-minigrid' | 'compose-list' | 'edit' |
  'clear-timeline' | 'sliders' | 'custom-timeline' | 'compose-dm' | 'bg-dot' |
  'user-add-account' | 'user-team-mgr' | 'user-switch' | 'conversation' |
  'dataminr' | 'link' | 'flash' | 'pointer-u' | 'pointer-d' | 'analytics' |
  'heart' | 'calendar' | 'attachment' | 'play' | 'pause' | 'bookmark' |
  'play-badge' | 'gif-badge' | 'poll' | 'lightning' | 'heart-filled' |
  'speaker' | 'sound' | 'sound-off'
export type TweetDeckIconColor =
  'favorite-color' | 'follow-color' | 'list-color' | 'image-color' |
  'mention-color' | 'unread-color' | 'remove-color' | 'submit-color' |
  'retweet-color' | 'twitter-blue-color'
export type TweetDeckIconSize =
  'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' |
  'small-context' | 'dropdown-context' | 'match-context'
export type TweetDeckIconPosition =
  'tt' | 'tb' | 'bot' | 'middle' | 'small-valigned' | 'base-valigned' |
  'center-16' | 'center-24'
export type TweetDeckIconsOption =
  TweetDeckIconColor | TweetDeckIconSize | TweetDeckIconPosition


// これは他のclassとの組み合わせでつかうので、今回は使わないことにする。
// 'verified-bg' |'retweet-toggle' | 'favorite-toggle' | 'with-bg-round'

const TDIconType: TweetDeckIconType[] = [
  'toggle-on' , 'toggle-off' , 'twitter-bird' , 'mention' , 'following' ,
  'message' , 'home' , 'hashtag' , 'reply' , 'favorite' , 'retweet' ,
  'retweet-filled' , 'drafts' , 'search' , 'trash' , 'close' , 'arrow-r' ,
  'arrow-l' , 'protected' , 'list' , 'list-filled' , 'camera' , 'more' ,
  'settings' , 'notifications' , 'user-dd' , 'activity' , 'trending' ,
  'minus' , 'plus' , 'geo' , 'check' , 'schedule' , 'dot' , 'user' ,
  'user-filled' , 'content' , 'arrow-d' , 'arrow-u' , 'share' , 'info' ,
  'verified' , 'translator' , 'blocked' , 'circle-error' , 'constrain' ,
  'play-video' , 'empty' , 'clear-input' , 'compose' , 'mark-read' ,
  'arrow-r-double' , 'arrow-l-double' , 'follow' , 'image' , 'popout' ,
  'move' , 'compose-grid' , 'compose-minigrid' , 'compose-list' , 'edit' ,
  'clear-timeline' , 'sliders' , 'custom-timeline' , 'compose-dm' , 'bg-dot' ,
  'user-add-account' , 'user-team-mgr' , 'user-switch' , 'conversation' ,
  'dataminr' , 'link' , 'flash' , 'pointer-u' , 'pointer-d' , 'analytics' ,
  'heart' , 'calendar' , 'attachment' , 'play' , 'pause' , 'bookmark' ,
  'play-badge' , 'gif-badge' , 'poll' , 'lightning' , 'heart-filled' ,
  'speaker' , 'sound' , 'sound-off'
]
const TDIconColor : TweetDeckIconColor[] = [
  'favorite-color' , 'follow-color' , 'list-color' , 'image-color' ,
  'mention-color' , 'unread-color' , 'remove-color' , 'submit-color' ,
  'retweet-color' , 'twitter-blue-color'
]
const TDIconSize : TweetDeckIconSize[] = [
  'xsmall' , 'small' , 'medium' , 'large' , 'xlarge' ,
  'small-context' , 'dropdown-context' , 'match-context'
]
const TDIconPosition : TweetDeckIconPosition[] = [
  'tt' , 'tb' , 'bot' , 'middle' , 'small-valigned' , 'base-valigned' ,
  'center-16' , 'center-24'
]
