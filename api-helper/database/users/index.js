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
    .findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    )
    .then((user) => user || null);
}



export async function findUsers(db, search, page = 0, limit = 10) {
  const pageSize = parseInt(limit, 10);
  const pageNumber = parseInt(page, 10);

  // Create the search condition for reusability
  const searchCondition = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const res = await db
    .collection("users")
    .aggregate([
      {
        $facet: {
          users: [
            { $match: searchCondition },
            { $sort: { _id: -1 } }, // Sorting by descending order of _id
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize }, // Limiting the number of documents returned
            // Lookup to get projects count
            {
              $lookup: {
                from: "projects", // Name of the projects collection
                localField: "_id", // Field in users collection
                foreignField: "creatorId", // Field in projects collection that references user
                as: "projects", // Name of the new array field to hold matching projects
              },
            },
            // Lookup to get roles and their names
            {
              $lookup: {
                from: "roles", // Name of the roles collection
                localField: "_id", // Field in users collection
                foreignField: "userId", // Field in roles collection that references user
                as: "roles", // Name of the new array field to hold matching roles
              },
            },
            {
              $addFields: {
                projectCount: { $size: "$projects" }, // Counting the number of projects
                roleCount: { $size: "$roles" }, // Counting the number of roles
                /* roleNames: {
                  $map: {
                    input: "$roles", // Array of roles
                    as: "role", // Alias for each role
                    in: "$$role.name", // Extracting the name of each role
                  },
                }, */
              },
            },
            {
              $project: {
                projects: 0, // Optionally exclude the projects array from the output
                roles: 0, // Optionally exclude the roles array from the output
              },
            },
          ],
          total: [
            { $match: searchCondition },
            { $count: "total" }, // Counting the total number of documents
          ],
        },
      },
    ])
    .toArray();

  // Handle case when total count exists but no users are returned
  const users = res[0].users || []; // Ensure an empty array if no users found
  const total = res[0].total[0]?.total ?? 0; // Default total to 0 if not found

  return { users, total };
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
