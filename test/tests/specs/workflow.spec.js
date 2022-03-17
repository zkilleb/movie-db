import { objects } from '../../pageObjects';
import {
  verifyAddRelease,
  verifyAddSecondRelease,
  verifyAllMoviesPage,
  verifyDeleteRelease,
  verifyDuplicateCanNotBeAdded,
  verifyEditMovie,
  verifyHomeLoads,
  verifyMovieDetail,
  verifyMovieIsAdded,
  verifyRandomTitle,
  verifyRouteNotFound,
  verifyStatPage,
} from '../common';

describe('Test Application Workflow', () => {
  before(() => {
    cy.visit('/');
  });

  verifyHomeLoads();
  verifyRandomTitle();
  verifyMovieIsAdded();
  verifyDuplicateCanNotBeAdded();
  verifyAllMoviesPage();
  verifyStatPage();

  it('Search Added Movie By Director', () => {
    cy.get(objects.searchType).click();
    cy.findByRole('option', {
      name: /director/i,
    }).click();
    cy.get(objects.searchTextField).type('Francis Ford Coppola');
    cy.get(objects.searchButton).click();
    cy.url().should('include', '/search');
    cy.get(objects.posterImage)
      .should('have.attr', 'alt')
      .then((alt) => {
        expect(alt).to.equal('The Godfather poster');
      });
    cy.get(objects.searchResultPage).should(
      'contain',
      'Results for Francis Ford Coppola: 1',
    );
    cy.get(objects.searchResult).eq(0).should('contain', 'The Godfather');
    cy.get(objects.searchResult).eq(0).should('contain', '1972');
    cy.get(objects.searchResult)
      .eq(0)
      .should('contain', 'Directed By: Francis Ford Coppola');
    cy.get(objects.searchResult).eq(0).should('contain', 'Language: English');
    cy.get(objects.searchResult).eq(0).should('contain', 'Runtime: 175 mins.');
    cy.get(objects.searchResult).eq(0).should('contain', 'Actors: Al Pacino');
  });

  it('Search Added Movie By Title', () => {
    cy.get(objects.searchType).click();
    cy.findByRole('option', {
      name: /title/i,
    }).click();
    cy.get(objects.searchTextField).type('Th');
    cy.get(objects.searchButton).click();
    cy.get(objects.detailAlert).should(
      'contain',
      'Search must be at least 3 charactes long',
    );
    cy.get(`${objects.searchTextField} >>`).clear();
    cy.get(objects.searchTextField).type('The Godfather');
    cy.get(objects.searchButton).click();
    cy.url().should('include', '/search');
    cy.get(objects.posterImage)
      .should('have.attr', 'alt')
      .then((alt) => {
        expect(alt).to.equal('The Godfather poster');
      });
    cy.get(objects.searchResultPage).should(
      'contain',
      'Results for The Godfather: 1',
    );
    cy.get(objects.searchResult).eq(0).should('contain', 'The Godfather');
    cy.get(objects.searchResult).eq(0).should('contain', '1972');
    cy.get(objects.searchResult)
      .eq(0)
      .should('contain', 'Directed By: Francis Ford Coppola');
    cy.get(objects.searchResult).eq(0).should('contain', 'Language: English');
    cy.get(objects.searchResult).eq(0).should('contain', 'Runtime: 175 mins.');
    cy.get(objects.searchResult).eq(0).should('contain', 'Actors: Al Pacino');
  });

  verifyMovieDetail();
  verifyEditMovie();
  verifyAddRelease();
  verifyAddSecondRelease();
  verifyDeleteRelease();

  it('Delete Movie', () => {
    cy.wait(3000);
    cy.get(objects.searchTextField).type('The Godfather');
    cy.get(objects.searchButton).click();
    cy.get(objects.searchResult).eq(0).dblclick();
    cy.get(objects.deleteIcon).click();
    cy.get(objects.confirmDelete).click();
    cy.wait(3000);
    cy.get(objects.recentSearches).should(
      'contain',
      'director: Francis Ford Coppola',
    );
    cy.get(objects.recentSearches).should('contain', 'title: The Godfather');
    cy.get(objects.searchTextField).type('The Godfather');
    cy.get(objects.searchButton).click();
    cy.get(objects.searchResultPage).should(
      'contain',
      'Results for The Godfather: 0',
    );
    cy.get(objects.addMovieButton).should('be.visible');
    cy.get(objects.viewAllButton).should('be.visible');
  });

  verifyRouteNotFound();
});
