import * as React from 'react'
import cc from './util/composeClassName'
export type SFC<T> = (props: DetailedHTMLProps<T>) => JSX.Element

export default function TDIcon (
  shape       : TDIcons,
  ...options  : TDIconsOption[]
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

const SFCs: StringMap<SFC<HTMLSpanElement>> = {}

export type TDIcons =
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
export type TDIconsColor =
  'favorite-color' | 'follow-color' | 'list-color' | 'image-color' |
  'mention-color' | 'unread-color' | 'remove-color' | 'submit-color' |
  'retweet-color' | 'twitter-blue-color'
export type TDIconsSize =
  'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' |
  'small-context' | 'dropdown-context' | 'match-context'
export type TDIconsPosition =
  'tt' | 'tb' | 'bot' | 'middle' | 'small-valigned' | 'base-valigned' |
  'center-16' | 'center-24'
export type TDIconsOption = TDIconsColor | TDIconsSize | TDIconsPosition


// これは他のclassとの組み合わせでつかうので、今回は使わないことにする。
// 'verified-bg' |'retweet-toggle' | 'favorite-toggle' | 'with-bg-round'
