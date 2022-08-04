import { ObjectId } from 'mongodb';
import { removeEmptyFields } from '../util.js';
import { connectToDB } from '../db.js';

const movies = connectToDB();

export async function addRelease(req, res) {
  const doc = removeEmptyFields(req);
  if (!doc.releases) doc.releases = [];
  doc.releases.push({
    label: req.query.label,
    notes: req.query.releaseNotes,
    format: req.query.format,
    uuid: req.query.uuid,
  });
  const response = await movies.replaceOne(
    { _id: ObjectId(req.query._id) },
    doc,
  );
  if (response.acknowledged) res.status(200).send(doc.releases);
  else
    res.status(400).json({
      message: 'Error adding record to database',
    });
}

export async function deleteRelease(req, res) {
  const doc = removeEmptyFields(req);
  let tempReleases = [...doc.releases];
  tempReleases.splice(req.query.index, 1);
  doc.releases = tempReleases;
  const response = await movies.replaceOne(
    { _id: ObjectId(req.query._id) },
    doc,
  );
  if (response.acknowledged) res.status(200).send(doc.releases);
  else
    res.status(400).json({
      message: 'Error editing record in database',
    });
}

export async function getAllReleases(req, res) {
  let resultArr = [];
  const results = await movies.find({});
  await results.forEach((result) => {
    result.releases.forEach((release) => {
      resultArr.push({ title: result.title, id: result._id, release });
    });
  });
  res.status(200).send(resultArr.sort((a, b) => (a.title > b.title ? 1 : -1)));
}

export async function deleteReleaseFromAll(req, res) {
  const doc = await movies.findOne({ _id: ObjectId(req.params.movieId) });
  let tempReleases = [...doc.releases];
  const index = tempReleases.findIndex(
    (element) => element.uuid === req.params.releaseId,
  );
  tempReleases.splice(index, 1);
  doc.releases = tempReleases;
  const response = await movies.replaceOne(
    { _id: ObjectId(req.params.movieId) },
    doc,
  );
  if (response.acknowledged)
    res.status(200).json({ message: 'Release succesfully deleted' });
  else
    res.status(400).json({
      message: 'Error editing record in database',
    });
}
