import { fetchReview, fetchGreatMovie } from 'eberts-api';

export async function getReview(req, res) {
  let result = await fetchReview(req.params.title, req.params.year);
  if (result.error) {
    result = await fetchGreatMovie(req.params.title, req.params.year);
    if (result.error) res.status(404).send(result.error);
  } else {
    res.status(200).send(result);
  }
}
