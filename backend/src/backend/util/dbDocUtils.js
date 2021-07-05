/**
 * @module dbDocUtils
 *
 * @description
 * helpers to handle persistant mongodb dependent_refs
 *
 * @author Hans-Peter Görg
 **/
const {ObjectId} = require('mongodb');


/**
 * This function should be used when deleting a member to ensure that tasks do not
 * reference members that don't exist anymore
 *
 * @param db {object} - the database
 * @param id {object} - the mongodb id of the deleted or intended to delete member
 * @returns {Promise<void>}
 */
async function deleteReferencesToMember(db, id) {
    await db.collection('sprint').updateMany({"tasks": {"assignedto": {"member_ref": id}}},
        {$pull: {"team": {"member_ref": id}}, $inc: {version: 1}});
}

/**
 * When deleting a userstory the references of epics, releases and sprints to this userstory
 * have to be deleted too. This can be done with this function
 *
 * @param db {object} - the database
 * @param id {ObjectId} - the mongodb id of the userstory
 * @returns {Promise<void>}
 */
async function deleteReferencesToUserstory(db, id) {
    await db.collection('epic').updateMany({userstories: {"userstory_ref": id}},
        {$pull: {"userstories": {"userstory_ref": id}}, $inc: {version: 1}});
    await db.collection('release').updateMany({userstories: {"userstory_ref": id}},
        {$pull: {"userstories": {"userstory_ref": id}}, $inc: {version: 1}});
    await db.collection('sprint').updateMany({userstories: {"userstory_ref": id}},
        {$pull: {"userstories": {"userstory_ref": id}}, $inc: {version: 1}});
}

exports.deleteReferencesToMember = deleteReferencesToMember;
exports.deleteReferencesToUserstory = deleteReferencesToUserstory;
