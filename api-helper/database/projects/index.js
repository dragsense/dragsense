import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from '..';

export async function findProjectById(db, id) {

  const projects = await db
    .collection('projects')
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },

      },
      {
        $lookup: {
          from: 'backups',
          let: { allbackups: "$backups" },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', { $ifNull: ['$$allbackups', []] }] } } },

          ],
          as: 'themes',
        },

      },
      { $unwind: '$creator' },
      { $project: {...dbProjectionUsers('creator.') } },
    ])
    .toArray();
  if (!projects[0]) return null;
  return projects[0];
}

export async function _findProjectById(db, id) {
  const projects = await db
    .collection('projects')
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },

      },
      { $unwind: '$creator' },
      { $project: {...dbProjectionUsers('creator.') } },
    ])
    .toArray();
  if (!projects[0]) return null;
  return projects[0];
}

export async function findProjectsBySearch(db, search, limit = 25) {

  const pageSize = parseInt(limit);


  const res = await db
    .collection('projects')
    .aggregate([

      { $match: {   ...(search && { name: search })} },
      { $sort: { _id: -1 } },
      { $limit: pageSize },
      { $project: { _id: 1, name: 1 } },

    ])
    .toArray();

  return { projects: res[0] };
}

export async function findProjects(db, page = 1, by, limit = 10) {


  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);

  const res = await db
    .collection('projects')
    .aggregate([
      {
        $facet: {
          projects: [
            {
              $match: {

                ...(by && { creatorId: new ObjectId(by) })
              }
            },
            { $sort: { _id: -1 } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
            {
              $lookup: {
                from: 'users',
                localField: 'creatorId',
                foreignField: '_id',
                as: 'creator',
              },
            },
            { $unwind: '$creator' },
            { $project: dbProjectionUsers('creator.') },
          ],
          total: [
            {
              $match: {

                ...(by && { creatorId: new ObjectId(by) })
              }
            },
            { $count: 'total' }
          ]
        }
      },


    ]).toArray();


  return { projects: res[0].projects, total: res[0].total[0]?.total ?? 0 };
}

export async function findSharedProjectsBySearch(db, search, by, limit = 25) {

  const pageSize = parseInt(limit);


  const res = await db
    .collection('projects')
    .aggregate([

      { $match: {   ...(search && { name: search }), users: { $in: [new ObjectId(by)]} }},
      { $sort: { _id: -1 } },
      { $limit: pageSize },
      { $project: { _id: 1, name: 1 } },

    ])
    .toArray();

  return { projects: res[0] };
}

export async function findSharedProjects(db, page = 1, by, limit = 10) {


  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);

  const res = await db
    .collection('projects')
    .aggregate([

      {
        $facet: {
          projects: [
            {
              $match: { users: { $in: [new ObjectId(by)] } }
            },
            { $sort: { _id: -1 } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
            {
              $lookup: {
                from: 'users',
                localField: 'creatorId',
                foreignField: '_id',
                as: 'creator',
              },
            },
            { $unwind: '$creator' },
            { $project: dbProjectionUsers('creator.') },
          ],
          total: [
            {
              $match: { users: { $in: [new ObjectId(by)] } }
            },
            { $count: 'total' }
          ]
        }
      },


    ]).toArray();



  return { projects: res[0].projects, total: res[0].total[0]?.total ?? 0 };

}




export async function insertProject(db, { name,
  url,
  desc,
  apikey,
  creatorId }) {
  const project = {
    name,
    url,
    desc,
    apikey,
    creatorId,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('projects').insertOne(project);
  project._id = insertedId;
  return project;
}

export async function updateProjectById(db, id, data) {
  return await db
    .collection('projects')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
    .then((project) => project);
}


export async function updateRoleInProjectById(db, id, roleId) {
  return db
    .collection('projects')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $push: { roles: roleId } },
      { returnDocument: 'after' }
    )
    .then((project) => project);
}



export async function updateBackupInProjectById(db, id, backupId) {
  return db
    .collection('projects')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $push: { backups: backupId } },
      { returnDocument: 'after' }
    )
    .then((project) => project);
}

export async function updateThemeInProjectById(db, id, themeId) {
  return db
    .collection('projects')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $push: { themes: themeId } },
      { returnDocument: 'after' }
    )
    .then((project) => project);
}

export async function deleteRoleInProjectById(db, id, roleId) {
  return db
    .collection('projects')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $pull: { roles: new ObjectId(roleId) } },
      { returnDocument: 'after' }
    )
    .then((project) => project);
}


export async function deleteBackupInProjectById(db, id, backupId) {
  return db
    .collection('projects')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $pull: { backups: backupId } },
      { returnDocument: 'after' }
    )
    .then((project) => project);
}

export async function deleteThemeInProjectById(db, id, themeId) {
  return db
    .collection('projects')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $pull: { themes: themeId } },
      { returnDocument: 'after' }
    )
    .then((project) => project);
}

export async function findProjectByName(db, name) {

  return db
    .collection('projects')
    .findOne({ name })
    .then((project) => project || null);
}





export async function deleteProjectById(db, id) {

  return await db
    .collection('projects')
    .findOneAndDelete(
      { _id: new ObjectId(id) },
      { returnDocument: 'after'}
    )
    .then((project) => project);
}



export function dbProjectionProject(prefix = '') {
  return {
    [`${prefix}name`]: 0,
    [`${prefix}url`]: 0,
    [`${prefix}port`]: 0,
    [`${prefix}mongouri`]: 0,
  };
}