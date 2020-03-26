import { initRemoteInfrastructure } from './background/remoteInfrastructure';
import { dispatchInstalledEvent } from './background/dispatchInstalledEvent';
import { migrateLegacyProfile } from './background/migrateLegacyProfile';

initRemoteInfrastructure();
dispatchInstalledEvent();
migrateLegacyProfile();
