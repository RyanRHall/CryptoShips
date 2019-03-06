const assert = require('assert');

const NAME_KEYS = [ "courseName", "schoolName", "studentName" ]

function verify({ contractData, verificationData }) {
  try {
    // Ensure names match
    let nameKey;
    for (var i = 0; i < NAME_KEYS.length; i++) {
      nameKey = NAME_KEYS[i];
      assert(contractData[nameKey] === verificationData[nameKey]);
    }
    // Ensure completion date in between start and end date
    let { completionDate } = verificationData;
    let { startedOn, daysToComplete } = contractData;
    [ completionDate, startedOn, daysToComplete ] = [ parseInt(completionDate), parseInt(startedOn), parseInt(daysToComplete) ];
    assert(startedOn <= completionDate);
    assert(startedOn + _daysToMilliseconds(daysToComplete) >= completionDate);
    return true;
  } catch {
    return false;
  }
}

function _daysToMilliseconds(nDays) {
  return nDays * 24 * 60 * 60 * 1000;
}



exports.verify = verify;
