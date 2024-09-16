import { ObjectId } from 'mongodb';

export async function findRoleById(db, roleId) {
    return db
        .collection('roles')
        .findOne({ _id: new ObjectId(roleId) })
        .then((role) => role || null);
}



export async function findRoleByUserIdAndProejectId(db, projectId, userId) {
    return db.collection('roles')
        .find({
            $and: [
                { "userId": new ObjectId(userId) },
                { "projectId": new ObjectId(projectId) },
            ]
        }).count();

}

export async function findRoles(db, page = 0, limit = 10) {
    return db
        .collection('roles')
        .aggregate([
            { $sort: { _id: -1 } },
            { $skip: page },
            { $limit: limit },
        ])
        .toArray();
}

export async function findRolesByProjectRoles(db, search, roleIds, page = 0, limit = 10) {
    
    const pageSize = parseInt(limit);
    const pageNumber = parseInt(page);

    const res = await db
        .collection('roles')
        .aggregate([
            {
                $facet: {
                    roles: [
                        {
                            $match: { _id: { $in: roleIds },
                            ...(search && { name: { $regex: search, $options: 'i' } })
                        },

                        },
                        { $sort: { _id: -1 } },
                        { $skip: (pageNumber - 1) * pageSize },
                        { $limit: pageSize },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'userId',
                                foreignField: '_id',
                                as: 'user',
                            },
                        },
                        { $unwind: '$user' },
                        { $project: { ['user.password']: 0 } },
                    ],
                    total: [
                        {
                            $match: { _id: { $in: roleIds },
                            ...(search && { name: { $regex: search, $options: 'i' } })
                        }
                        },
                        { $count: 'total' }
                    ]
                }
            },
        ])
        .toArray();



    return { roles: res[0].roles, total: res[0].total[0]?.total ?? 0 };

}

export async function deleteRolesByProjectRoles(db, roleIds) {



    await db
        .collection('roles')
        .aggregate([
            {
                $match: { _id: { $in: roleIds } },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: 'roles',
                    as: 'user',
                },
            },
            {
                $unwind: "$user"
            },
            {
                $group: {
                    _id: "$user._id",
                    studentIds: {
                        $push: "$courses.roles"
                    }
                }
            },
            {
                $addFields: {
                    "roles": {
                        $reduce: {
                            input: "$roles",
                            initialValue: [],
                            in: {
                                $setDifference: [
                                    "$$this",
                                    "$_id"
                                ]
                            }
                        }
                    }
                }
            },
            {
                $replaceRoot: { newRoot: { _id: "$_id", studentIds: "$studentIds" } }
            },
            {
                $out: "courses"
            }

        ]);

    return await db
        .collection('roles').deleteMany({ _id: { $in: roleIds } });

}


export async function findRolesByUserProjects(db, roleIds, page = 0, limit = 10) {

    const pageSize = parseInt(limit);
    const pageNumber = parseInt(page);

    const res = await db
        .collection('roles')
        .aggregate([
            {
                $facet: {
                    roles: [
                        {
                            $match: { _id: { $in: roleIds } },
                        },
                        { $sort: { _id: -1 } },
                        { $skip: (pageNumber - 1) * pageSize },
                        { $limit: pageSize },
                        {
                            $lookup: {
                                from: 'projects',
                                localField: 'projectId',
                                foreignField: '_id',
                                as: 'project',
                            },
                        },
                        { $unwind: '$project' },
                        {
                            $replaceRoot: { newRoot: '$project' }
                        }
                    ],
                    total: [
                        {
                            $match: { _id: { $in: roleIds } }
                        },
                        { $count: 'total' }
                    ]
                }
            },
        ])
        .toArray();




    return { projects: res[0].roles, total: res[0].total[0]?.total ?? 0 };

}

export async function updateRoleById(db, id, data) {
    return db
        .collection('roles')
        .findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: data },
            { returnDocument: 'after' }
        )
        .then(({ value }) => value);
}


export async function insertRole(
    db,
    { name,
        userId,
        projectId,
        permissions = [],
    }
) {
    const role = {
        permissions,
        name,
        userId,
        projectId,
    };

    const { insertedId } = await db
        .collection('roles')
        .insertOne(role);
    role._id = insertedId;
    return role;
}


export async function deleteRoleById(db, id) {

    return await db
        .collection('roles')
        .findOneAndDelete(
            { _id: new ObjectId(id) },
            { returnDocument: 'after' }
        )
        .then((role) => role);
}


