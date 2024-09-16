import argon2 from "argon2";

import { ObjectId } from "mongodb";
import normalizeEmail from "validator/lib/normalizeEmail";

export async function findUserWithEmailAndPassword(db, email, password) {
  email = normalizeEmail(email);
  const user = await db.collection("users").findOne({ email });
  if (user && (await argon2.verify(user.password, password))) {
    return { ...user, password: undefined }; // filtered out password
  }
  return null;
}


export async function findUserById(db, userId) {
  return db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

export async function findUsers(db, search, page = 0, limit = 10) {
  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);

  const res = await db
    .collection("users")
    .aggregate([
      {
        $facet: {
          users: [
            {
              $match: {
                ...(search && { name: { $regex: search, $options: 'i' } }) // Optional search filter
              },
            },
            { $sort: { _id: -1 } }, // Sorting by descending order of _id
            { $skip: pageNumber * pageSize }, // Skipping documents for pagination
            { $limit: pageSize } // Limiting the number of documents returned
          ],
          total: [
            {
              $match: {
                ...(search && { name: { $regex: search, $options: 'i' } }) // Matching the same search filter
              },
            },
            { $count: 'total' } // Counting the total number of documents
          ]
        }
      }
    ])
    .toArray();

  return { users: res[0].users, total: res[0].total[0]?.total ?? 0 };
}

export async function findUserByEmail(db, email) {
  return db
    .collection("users")
    .findOne({ email }, { projection: { password: 0, emailVerified: 0 } })
    .then((user) => user || null);
}

export async function updateUserById(db, id, data) {
  return db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: "after", projection: { password: 0 } }
    )
    .then(({ value }) => value);
}

export async function insertUser(
  db,
  { email, originalPassword, emailVerified = null, image = null, name }
) {
  const user = {
    emailVerified,
    image,
    email,
    name,
  };

  const password = originalPassword && (await argon2.hash(originalPassword));
  const { insertedId } = await db
    .collection("users")
    .insertOne({ ...user, password });
  user._id = insertedId;
  return user;
}

export async function updateRoleInUserById(db, id, roleId) {
  return db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $push: { roles: roleId } },
      { returnDocument: "after" }
    )
    .then((project) => project);
}

export async function deleteRoleInUserById(db, id, roleId) {
  return db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $pull: { roles: new ObjectId(roleId) } },
      { returnDocument: "after" }
    )
    .then((project) => project);
}

export async function getUserPassword(db, id) {
  return db
    .collection("users")
    .findOne({ _id: new ObjectId(id) })
    .then((user) => user?.password || null);
}

export async function updateUserPasswordByOldPassword(
  db,
  id,
  oldPassword,
  newPassword
) {
  const user = await db.collection("users").findOne(new ObjectId(id));
  if (!user) return false;
  const matched = await argon2.verify(user.password, oldPassword);
  if (!matched) return false;
  const password = await argon2.hash(newPassword);
  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: { password } });
  return true;
}

export async function UNSAFE_updateUserPassword(db, id, newPassword) {
  const password = await argon2.hash(newPassword);
  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { password, resetPassword: true } }
    );
  return true;
}

export async function findUsersByIds(db, page = 0, ids, limit = 10) {
  return db
    .collection("users")
    .aggregate([
      {
        $match: {
          ...(ids && { _id: { $nin: ids } }),
        },
      },
      { $sort: { _id: -1 } },
      { $skip: page },
      { $limit: limit },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "users",
          as: "creator",
        },
      },
      { $project: dbProjectionUsers("creator.") },
    ])
    .toArray();
}

export async function deleteUserById(db, userId) {
  return db
    .collection("users")
    .deleteOne({ _id: new ObjectId(userId) })
    .then((result) => result.deletedCount === 1);
}

export function dbProjectionUsers(prefix = "") {
  return {
    [`${prefix}password`]: 0,
    [`${prefix}email`]: 0,
    [`${prefix}emailVerified`]: 0,
  };
}
