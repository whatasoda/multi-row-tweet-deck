import { initRemoteInfrastructure } from './background/remoteInfrastructure';
import { dispatchInstalledEvent } from './background/dispatchInstalledEvent';
import { migrateLegacyProfile } from './background/migrateLegacyProfile';
import '../../shared/browser';

initRemoteInfrastructure();
dispatchInstalledEvent();
migrateLegacyProfile();
