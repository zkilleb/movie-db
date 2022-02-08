export function removeEmptyFields(req) {
  let doc = {};
  req.query.title !== '' && (doc.title = req.query.title);
  req.query.color !== '' && (doc.color = req.query.color);
  req.query.length !== '' && (doc.length = req.query.length);
  req.query.year !== '' && (doc.year = req.query.year);
  req.query.language !== '' && (doc.language = req.query.language);
  req.query.director !== '' && (doc.director = req.query.director);
  req.query.studio !== '' && (doc.studio = req.query.studio);
  req.query.actors &&
    req.query.actors.length !== 0 &&
    (doc.actors = req.query.actors);
  req.query.notes !== '' && (doc.notes = req.query.notes);
  let releases = [];
  if (req.query.releases && req.query.releases.length !== 0) {
    req.query.releases.forEach((release) => {
      releases.push(JSON.parse(release));
    });
  }
  doc.releases = releases;
  return doc;
}

export function generateTMDBParams(req, apiKey) {
  return {
    params: {
      api_key: apiKey,
      language: 'en-US',
      query: req.params.keyword,
      page: 1,
      include_adult: true,
    },
  };
}
