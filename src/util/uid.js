/**
 * @fileoverview UID generator, from Blockly.
 */

/**
 * Legal characters for the unique ID.
 * Should be all on a US keyboard.  No XML special characters or control codes.
 * Removed $ due to issue 251.
 * @private
 */
const soup_ = '!#%()*+,-./:;=?@[]^_`{|}~' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generate a unique ID, from Blockly.  This should be globally unique.
 * 87 characters ^ 20 length > 128 bits (better than a UUID).
 * @return {string} A globally unique ID string.
 */

var previousUids = {};

const uid = function () {
    const length = 20;
    const soupLength = soup_.length;
    const id = [];
    for (let i = 0; i < length; i++) {
        id[i] = soup_.charAt(Math.random() * soupLength);
    }
	//Gvbvdxx:
	//Not sure if this would hang or not, but this should prevent uids from being the same as previous ones.
	//It would probally take forever for this to hang and cause issues.
	//Not sure if this makes it memory efficent though.
	var uidOutput = id.join('');
	if (previousUids[uidOutput]) {
		return uid();
	} else {
		previousUids[uidOutput] = true;
	}
    return uidOutput;
};

module.exports = uid;
