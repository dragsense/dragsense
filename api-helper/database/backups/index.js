import { ObjectId } from "mongodb";
import { dbProjectionUsers } from "../users";

export async function findBackupById(db, backupId) {
  return db
    .collection("backups")
    .findOne({ _id: new ObjectId(backupId) })
    .then((backup) => backup || null);
}

export async function findPublicThemeById(db, themeId) {
  return db
    .collection("backups")
    .findOne({ _id: new ObjectId(themeId), published: true })
    .then((theme) => theme || null);
}

export async function findBackupsBySearch(db, search, limit = 25) {
  const pageSize = parseInt(limit);

  const res = await db
    .collection("backups")
    .aggregate([
      { $match: { ...(search && { name: search }) } },
      { $sort: { _id: -1 } },
      { $limit: pageSize },
      { $project: { _id: 1, name: 1 } },
    ])
    .toArray();

  return { backups: res[0] };
}

export async function findBackupByIdWithUser(db, backupId) {
  const backups = await db
    .collection("backups")
    .aggregate([
      { $match: { _id: new ObjectId(backupId) } },
      { $limit: 1 },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "creator",
        },
      },
      { $unwind: "$creator" },
      { $project: dbProjectionUsers("creator.") },
    ])
    .toArray();
  if (!backups[0]) return null;
  return backups[0];
}

export async function findPublicThemeByIdWithProject(db, backupId) {
  const backups = await db
    .collection("backups")
    .aggregate([
      { $match: { _id: new ObjectId(backupId) } },
      { $limit: 1 },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "themeProject",
        },
      },
      { $unwind: "$themeProject" },
      { $project: {
        [`_id`]: 0,
        [`creatorId`]: 0,
        [`name`]: 0,
        [`desc`]: 0,
      } },
    ])
    .toArray();
  if (!backups[0]) return null;
  return backups[0];
}


export async function findBackupByUuid(db, uuid) {
  return db
    .collection("backups")
    .findOne({ uuid })
    .then((backup) => backup || null);
}

export async function findBackups(db, page = 0, limit = 10) {
  return db
    .collection("backups")
    .aggregate([{ $sort: { _id: -1 } }, { $skip: page }, { $limit: limit }])
    .toArray();
}

export async function findBackupByName(db, name, id) {
  return db
    .collection("backups")
    .findOne({ _id: { $ne: new ObjectId(id) }, name })
    .then((backup) => backup || null);
}

export async function updateBackupById(db, id, data) {
  return db
    .collection("backups")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: "after", projection: { password: 0 } }
    )
    .then(({ value }) => value);
}

export async function insertBackup(
  db,
  { name, projectId, preview, platform, desc, published = false, createdBy }
) {
  const backup = {
    name,
    preview,
    desc,
    published,
    projectId,
    createdBy,
    platform,
    createdAt: new Date(),
  };

  const { insertedId } = await db
    .collection("backups")
    .insertOne({ ...backup });
  backup._id = insertedId;
  backup.createdBy = undefined;
  return backup;
}

export async function findBackupsByProjectId(
  db,
  search,
  page = 0,
  projectId,
  limit = 10
) {
  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);

  const res = await db
    .collection("backups")
    .aggregate([
      {
        $facet: {
          backups: [
            {
              $match: {
                ...(projectId && { projectId: new ObjectId(projectId) }),
                ...(search && { name: { $regex: search, $options: "i" } }),
              },
            },
            { $sort: { _id: -1 } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
            {
              $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "creator",
              },
            },
            { $unwind: "$creator" },
            { $project: dbProjectionUsers("creator.") },
          ],
          total: [
            {
              $match: {
                ...(projectId && { projectId: new ObjectId(projectId) }),
                ...(search && { name: { $regex: search, $options: "i" } }),
              },
            },
            { $count: "total" },
          ],
        },
      },
    ])
    .toArray();

  return { backups: res[0].backups, total: res[0].total[0]?.total ?? 0 };
}

export async function findThemesByProjectThemes(
  db,
  search,
  themesIds,
  page = 0,
  limit = 10
) {
  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);

  const res = await db
    .collection("backups")
    .aggregate([
      {
        $facet: {
          themes: [
            {
              $match: {
                _id: { $in: themesIds },
                ...(search && { name: { $regex: search, $options: "i" } }),
              },
            },
            { $sort: { _id: -1 } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
            {
              $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "creator",
              },
            },
            { $unwind: "$creator" },
            { $project: dbProjectionUsers("creator.") },
          ],
          total: [
            {
              $match: {
                _id: { $in: themesIds },
                ...(search && { name: { $regex: search, $options: "i" } }),
              },
            },
            { $count: "total" },
          ],
        },
      },
    ])
    .toArray();

  return { themes: res[0].themes, total: res[0].total[0]?.total ?? 0 };
}

export async function findPublicThemes(db, search, platform,  page = 1, limit = 10) {
  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);

  const res = await db
    .collection("backups")
    .aggregate([
      {
        $facet: {
          themes: [
            {
              $match: {
                published: true,
                platform,
                ...(search && { name: { $regex: search, $options: "i" } }),
              },
            },
            { $sort: { _id: -1 } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
            {
              $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "creator",
              },
            },
            { $unwind: "$creator" },
            { $project: dbProjectionUsers("creator.") },
          ],
          total: [
            {
              $match: {
                published: true,
                ...(search && { name: { $regex: search, $options: "i" } }),
              },
            },
            { $count: "total" },
          ],
        },
      },
    ])
    .toArray();

  return { themes: res[0].themes, total: res[0].total[0]?.total ?? 0 };
}

export async function deleteBackupById(db, id) {
  return await db
    .collection("backups")
    .findOneAndDelete({ _id: new ObjectId(id) }, { returnDocument: "after" })
    .then((backup) => backup);
}
