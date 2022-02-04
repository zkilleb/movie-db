export function removeEmptyFields(req) {
  let doc = {};
  req.query.title !== '' && (doc.title = req.query.title);
  req.query.format !== '' && (doc.format = req.query.format);
  req.query.color !== '' && (doc.color = req.query.color);
  req.query.length !== '' && (doc.length = req.query.length);
  req.query.year !== '' && (doc.year = req.query.year);
  req.query.language !== '' && (doc.language = req.query.language);
  req.query.director !== '' && (doc.director = req.query.director);
  req.query.label !== '' && (doc.label = req.query.label);
  req.query.actors &&
    req.query.actors.length !== 0 &&
    (doc.actors = req.query.actors);
  req.query.notes !== '' && (doc.notes = req.query.notes);
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
