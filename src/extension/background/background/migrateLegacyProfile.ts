import { v4 as uuid } from 'uuid';
import { createRepository } from '../../../shared/storage/repository';
import { getStorageInfrastructure } from '../../../shared/storage/infrastructure';

export const migrateLegacyProfile = async () => {
  const repository = createRepository(getStorageInfrastructure('auto'));
  await repository.remapProfiles();

  const legacyProfiles = await repository.getLegacyProfiles();
  if (!legacyProfiles) return;
  const legacySelectedIdx = await repository.getLegacySelectedProfileId();
  await repository.cleanLegacyProfiles();

  const promises = legacyProfiles.map(async (legacy, idx) => {
    const { cellGap, drawerWidth, headerType, name, columns, rows } = legacy;
    const id = uuid();
    const profile: MultiRowProfile = {
      id,
      displayName: name,
      drawer: { width: drawerWidth },
      header: { height: headerType },
      cells: { gap: cellGap, columnOrder: [], columns: {} },
    };

    const { cells } = profile;
    columns.forEach((width, idx) => {
      const columnId = uuid();
      const column: ColumnProfile = { id: columnId, rowOrder: [], rows: {}, width };
      rows[idx].forEach((height) => {
        const rowId = uuid();
        const row: RowProfile = { columnId, id: rowId, height };
        column.rows[rowId] = row;
        column.rowOrder.push(rowId);
      });

      cells.columns[columnId] = column;
      cells.columnOrder.push(columnId);
    });

    await repository.setProfile(profile);
    if (`${legacySelectedIdx}` === `${idx}`) {
      await repository.setSelectedProfileId(profile.id);
    }
  });
  await Promise.all(promises);
};
