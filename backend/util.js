export function removeEmptyFields(req) {
  let doc = {};
  let releases = [];
  Object.keys(req.query).forEach((key) => {
    if (key !== '_id') {
      if (key === 'releases' && req.query[key].length !== 0) {
        req.query[key].forEach((release) => {
          releases.push(JSON.parse(release));
        });
      } else if (
        key === 'actors' &&
        req.query[key] &&
        req.query[key].length !== 0
      ) {
        doc[key] = req.query[key];
      } else req.query[key] !== '' && (doc[key] = req.query[key]);
    }
  });
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
