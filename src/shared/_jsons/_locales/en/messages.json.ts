import path from 'path';
import { locales } from '../../../locales';
import { MAX_PROFILE_COUNT } from '../../../constants';

const message = locales.messages({
  description: 'MultiRow TweetDeck extends your TweetDeck layout with customizable rows.',
  about: `MultiRow TweetDeck extends your TweetDeck layout with customizable rows.

You can try customization of layouts on this page because this also serves as a setting page.

Even if you make your layout before installation, the configuration is loaded from the extension later.

So feel free to try it. Just switching to the setting mode by the buttons on the left.`,
  installationMessage: 'MultiRow TweetDeck supports GoogleChrome and Firefox. Click icons below to get!',
  contact: 'Give me your feedback! Japanese and (beginner) English available',
  dateRecentUse: 'sort by date recent use',
  dateCreated: 'sort by date created',
  dateUpdated: 'sort by date updated',
  profileListDescription: `Choose a profile to edit.

A profile marked ★ is reflected in your TweetDeck after reloading.`,
  confirmOnSwitchProfile: 'Are you sure if you discard unsaved changes for this profile?',
  confirmOnDeleteCurrentProfile: 'This operation cannot be undone. Do you really want to delete this profile?',
  alertOnCreateNewProfile: `You cannot save more than ${MAX_PROFILE_COUNT} profiles.`,
  confirmOnCreateNewProfile: 'Are you sure if you discard unsaved changes for this profile and create a new profile?',
  beforeUnload: 'Are you sure if leaving this page without saving current changes?',
});

module.exports = (): ValLoader => ({
  code: JSON.stringify(message),
  cacheable: true,
  contextDependencies: [
    path.resolve(__dirname, '../../../locales.ts'),
    path.resolve(__dirname, '../../../types/custom.d.ts'),
    path.resolve(__dirname, '../../../constants.ts'),
  ],
});
