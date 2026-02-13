import assert from 'assert';
import {
  GOOGLE_TAKEOUT_PHOTO_TAKEN_SOURCE,
  parseSidecarTakenAtIso,
} from '../utilities/canonSidecar';

function run() {
  const valid = parseSidecarTakenAtIso({
    takenAtIso: '2020-01-02T03:04:05.000Z',
    takenAtSource: GOOGLE_TAKEOUT_PHOTO_TAKEN_SOURCE,
  });
  assert.equal(valid, '2020-01-02T03:04:05.000Z');

  const offset = parseSidecarTakenAtIso({
    takenAtIso: '2020-01-02T03:04:05-07:00',
    takenAtSource: GOOGLE_TAKEOUT_PHOTO_TAKEN_SOURCE,
  });
  assert.equal(offset, '2020-01-02T10:04:05.000Z');

  const invalid = parseSidecarTakenAtIso({
    takenAtIso: 'not-a-date',
    takenAtSource: GOOGLE_TAKEOUT_PHOTO_TAKEN_SOURCE,
  });
  assert.equal(invalid, undefined);

  const missing = parseSidecarTakenAtIso(null);
  assert.equal(missing, undefined);

  console.log('testCanonSidecarTakenAt: OK');
}

run();
