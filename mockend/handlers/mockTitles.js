import { TITLES } from '../data/titles.js';
import { REVIEWS } from '../data/reviews.js';

export function mockTitles() {
  return TITLES;
}

export function mockTitle(title) {
  return TITLES.filter((a) =>
    a.title.toLowerCase().includes(title.toLowerCase()),
  );
}

export function mockDirector(name) {
  return TITLES.filter((a) => {
    a.director.toLowerCase().includes(name.toLowerCase());
  });
}

export function mockActor(name) {
  let results = [];
  TITLES.forEach((title) => {
    for (let actor of title.actors) {
      if (actor.toLowerCase().includes(name.toLowerCase())) {
        results.push(title);
        break;
      }
    }
  });
  return results;
}

export function mockTitleId(id) {
  return TITLES.filter((a) => {
    return a._id === id;
  })[0];
}

export function mockRandom() {
  return TITLES[Math.floor(Math.random() * TITLES.length)];
}

export function mockAddTitle(req) {
  let alreadyExists = false;
  TITLES.forEach((title) => {
    if (
      title.title.toLowerCase() === req.query.title.toLowerCase() &&
      title.director.toLowerCase() === req.query.director.toLowerCase() &&
      title.year === req.query.year
    ) {
      alreadyExists = true;
    }
  });
  if (!alreadyExists) return req.query;
}

export function mockAllReleases() {
  let resultArr = [];
  TITLES.forEach((result) => {
    result.releases.forEach((release) => {
      resultArr.push({ title: result.title, id: result._id, release });
    });
  });
  return resultArr;
}

export function mockReview() {
  return REVIEWS;
}
