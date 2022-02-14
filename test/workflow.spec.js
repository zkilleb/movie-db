const objects = {
  header: '[data-cy=Header]',
  titleField: '[data-cy=TitleField]',
  runtimeField: '[data-cy=RuntimeField]',
  releaseYearField: '[data-cy=ReleaseYearField]',
  languageField: '[data-cy=LanguageField]',
  directorField: '[data-cy=DirectorField]',
  studioField: '[data-cy=StudioField]',
  genreField: '[data-cy=GenreField]',
  notesField: '[data-cy=NotesField]',
  addActorField: '[data-cy=AddActorField]',
  addActorButton: '[data-cy=AddActorButton]',
  deleteActor: '[data-cy=DeleteActor]',
  addActorRow: '[data-cy=AddActorRow]',
  submitButton: '[data-cy=SubmitButton]',
  searchTextField: '[data-cy=SearchTextField]',
  searchButton: '[data-cy=SearchFieldButton]',
  posterImage: '[data-cy=PosterImage]',
  searchResultPage: '[data-cy=SearchResultPage]',
  searchResult: '[data-cy=SearchResult]',
  detailPoster: '[data-cy=DetailPoster]',
  detailContainer: '[data-cy=DetailContainer]',
  recommendations: '[data-cy=Recommendations]',
  recommendedFilm: '[data-cy=RecommendedFilm]',
  editIcon: '[data-cy=EditIcon]',
  deleteIcon: '[data-cy=DeleteIcon]',
  confirmDelete: '[data-cy=ConfirmDelete]',
  detailAlert: '[data-cy=DetailAlert]',
  review: '[data-cy=Review]',
  random: '[data-cy=Random]',
  searchType: '[data-cy=SearchType]',
  recentSearches: '[data-cy=RecentSearches]',
  addReleaseButton: '[data-cy=AddReleaseButton]',
  releaseDialog: '[data-cy=ReleaseDialog]',
  releaseLabel: '[data-cy=ReleaseLabel]',
  releaseNotes: '[data-cy=ReleaseNotes]',
  confirmAddRelease: '[data-cy=ConfirmAddReleaseButton]',
  deleteRelease: '[data-cy=DeleteRelease]',
  allMoviesHeaderRow: '[data-cy=AllMoviesHeaderRow]',
  allMoviesResultRow: '[data-cy=AllMoviesResultRow]',
  addMovieButton: '[data-cy=AddMovieButton]',
  viewAllButton: '[data-cy=ViewAllButton]',
  notFound: '[data-cy=NotFound]',
};

describe('Test Application Workflow', () => {
  before(() => {
    cy.visit('/');
  });

  it('Verifies the Home Page Loads', () => {
    cy.get(objects.header).should('exist');
  });

  it('Verify Random Title is Loaded', () => {
    cy.get(objects.random).click({ force: true });
    cy.url().should('include', '/detail');
    cy.get(objects.detailContainer).should('exist');
  });

  it('Add Movie', () => {
    cy.get(`${objects.header} > :nth-child(3)`).click();
    cy.url().should('include', '/add');
    cy.get(objects.titleField).type('The Godfather');
    cy.get(`${objects.titleField} >>`).should('have.value', 'The Godfather');
    cy.get(objects.runtimeField).type('175');
    cy.get(`${objects.runtimeField} >>`).should('have.value', '175');
    cy.get(objects.releaseYearField).type('1972');
    cy.get(`${objects.releaseYearField} >>`).should('have.value', '1972');
    cy.get(objects.languageField).type('English');
    cy.get(`${objects.languageField} >>`).should('have.value', 'English');
    cy.get(objects.directorField).type('Francis Ford Coppola');
    cy.get(`${objects.directorField} >>`).should(
      'have.value',
      'Francis Ford Coppola',
    );
    cy.get(objects.studioField).type('Paramount');
    cy.get(`${objects.studioField} >>`).should('have.value', 'Paramount');
    cy.get(objects.genreField).type('Gangster');
    cy.get(`${objects.genreField} >>`).should('have.value', 'Gangster');
    cy.get(objects.notesField).type('Part of The Godfather Trilogy release');
    cy.get(`${objects.notesField} >>`).should(
      'have.value',
      'Part of The Godfather Trilogy release',
    );
    cy.get(objects.addActorField).type('Alpha Cino');
    cy.get(objects.addActorButton).click();
    cy.get(`${objects.addActorRow} >>>`)
      .eq(0)
      .should('have.value', 'Alpha Cino');
    cy.get(objects.deleteActor).click();
    cy.get(objects.addActorField).type('Al Pacino');
    cy.get(objects.addActorButton).click();
    cy.get(`${objects.addActorRow} >>>`)
      .eq(0)
      .should('have.value', 'Al Pacino');
    cy.get(objects.submitButton).click();
    cy.wait(3000);
  });

  it('Verify Duplicate Cannot Be Added', () => {
    cy.get(`${objects.header} > :nth-child(3)`).click();
    cy.url().should('include', '/add');
    cy.get(objects.titleField).type('The Godfather');
    cy.get(objects.runtimeField).type('175');
    cy.get(objects.releaseYearField).type('1972');
    cy.get(objects.languageField).type('English');
    cy.get(objects.directorField).type('Francis Ford Coppola');
    cy.get(objects.studioField).type('Paramount');
    cy.get(objects.genreField).type('Gangster');
    cy.get(objects.notesField).type('Part of The Godfather Trilogy release');
    cy.get(objects.addActorField).type('Al Pacino');
    cy.get(objects.addActorButton).click();
    cy.intercept('PUT', '**/add**', {}).as('addMovie');
    cy.get(objects.submitButton).click();
    cy.get(objects.detailAlert).should('contain', 'Record already exists');
    cy.wait(3000);
  });

  it('Check All Movies Page', () => {
    cy.get(`${objects.header} > :nth-child(2)`).click();
    cy.url().should('include', '/all-movies');
    cy.get(objects.allMoviesHeaderRow).should('contain', 'Title');
    cy.get(objects.allMoviesHeaderRow).should('contain', 'Director');
    cy.get(objects.allMoviesHeaderRow).should('contain', 'Release Year');
    cy.get(objects.allMoviesHeaderRow).should('contain', 'Runtime');
    cy.get(objects.allMoviesHeaderRow).should('contain', 'Language');
    cy.get(objects.allMoviesHeaderRow).should('contain', 'Color');
    cy.get(objects.allMoviesHeaderRow).should('contain', 'Studio');
    cy.get(objects.allMoviesHeaderRow).should('contain', 'Notes');
    cy.get(objects.allMoviesHeaderRow).should('contain', 'Genre');
    cy.get(objects.allMoviesHeaderRow).should('contain', 'Actors');
    cy.get(objects.allMoviesResultRow).should('contain', 'The Godfather');
    cy.get(objects.allMoviesResultRow).should(
      'contain',
      'Francis Ford Coppola',
    );
    cy.get(objects.allMoviesResultRow).should('contain', '1972');
    cy.get(objects.allMoviesResultRow).should('contain', '175 mins.');
    cy.get(objects.allMoviesResultRow).should('contain', 'English');
    cy.get(objects.allMoviesResultRow).should('contain', 'true');
    cy.get(objects.allMoviesResultRow).should('contain', 'Paramount');
    cy.get(objects.allMoviesResultRow).should(
      'contain',
      'Part of The Godfather Trilogy release',
    );
    cy.get(objects.allMoviesResultRow).should('contain', 'Gangster');
    cy.get(objects.allMoviesResultRow).should('contain', 'Al Pacino');
  });

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

  it('View Movie Detail', () => {
    cy.get(objects.searchResult).eq(0).dblclick();
    cy.url().should('include', '/detail');
    cy.get(objects.detailPoster)
      .should('have.attr', 'alt')
      .then((alt) => {
        expect(alt).to.equal('The Godfather poster');
      });
    cy.get(objects.detailContainer).should('contain', 'The Godfather');
    cy.get(objects.detailContainer).should('contain', '1972');
    cy.get(objects.detailContainer).should(
      'contain',
      'Directed By: Francis Ford Coppola',
    );
    cy.get(objects.detailContainer).should('contain', 'Language: English');
    cy.get(objects.detailContainer).should('contain', 'Runtime: 175 mins.');
    cy.get(objects.detailContainer).should('contain', 'Starring: Al Pacino');
    cy.get(objects.detailContainer).should('contain', 'Studio: Paramount');
    cy.get(objects.detailContainer).should('contain', 'Gangster');
    cy.get(objects.detailContainer).should(
      'contain',
      'Notes: Part of The Godfather Trilogy release',
    );
    cy.get(objects.review).should('contain', 'Review By Roger Ebert:');
    cy.get(objects.recommendations).should('contain', 'Similar Films:');
    cy.get(objects.recommendedFilm).eq(0).should('exist');
    cy.get(objects.recommendedFilm).eq(1).should('exist');
    cy.get(objects.recommendedFilm).eq(2).should('exist');
    cy.get(objects.recommendedFilm).eq(3).should('exist');
    cy.get(objects.recommendedFilm).eq(4).should('exist');
  });

  it('Edit Movie', () => {
    cy.get(objects.editIcon).click();
    cy.url().should('include', '/edit');
    cy.get(`${objects.titleField} >>`).should('have.value', 'The Godfather');
    cy.get(`${objects.runtimeField} >>`).should('have.value', '175');
    cy.get(`${objects.releaseYearField} >>`).should('have.value', '1972');
    cy.get(`${objects.languageField} >>`).should('have.value', 'English');
    cy.get(`${objects.directorField} >>`).should(
      'have.value',
      'Francis Ford Coppola',
    );
    cy.get(`${objects.studioField} >>`).should('have.value', 'Paramount');
    cy.get(`${objects.genreField} >>`).should('have.value', 'Gangster');
    cy.get(`${objects.notesField} >>`).should(
      'have.value',
      'Part of The Godfather Trilogy release',
    );
    cy.get(`${objects.addActorRow} >>>`)
      .eq(0)
      .should('have.value', 'Al Pacino');
    cy.get(objects.addActorField).type('Marlon Brando');
    cy.get(objects.addActorButton).click();
    cy.get(`${objects.addActorRow} >>>`)
      .eq(0)
      .should('have.value', 'Al Pacino');
    cy.get(`${objects.addActorRow} >>>`)
      .eq(1)
      .should('have.value', 'Marlon Brando');
    cy.get(objects.submitButton).click();
    cy.wait(3000);
    cy.url().should('include', '/detail');
    cy.get(objects.detailPoster)
      .should('have.attr', 'alt')
      .then((alt) => {
        expect(alt).to.equal('The Godfather poster');
      });
    cy.get(objects.detailContainer).should('contain', 'The Godfather');
    cy.get(objects.detailContainer).should('contain', '1972');
    cy.get(objects.detailContainer).should(
      'contain',
      'Directed By: Francis Ford Coppola',
    );
    cy.get(objects.detailContainer).should('contain', 'Language: English');
    cy.get(objects.detailContainer).should('contain', 'Runtime: 175 mins.');
    cy.get(objects.detailContainer).should(
      'contain',
      'Starring: Al Pacino, Marlon Brando',
    );
    cy.get(objects.detailContainer).should('contain', 'Studio: Paramount');
    cy.get(objects.detailContainer).should('contain', 'Gangster');
    cy.get(objects.detailContainer).should(
      'contain',
      'Notes: Part of The Godfather Trilogy release',
    );
    cy.get(objects.recommendations).should('contain', 'Similar Films:');
    cy.get(objects.recommendedFilm).eq(0).should('exist');
    cy.get(objects.recommendedFilm).eq(1).should('exist');
    cy.get(objects.recommendedFilm).eq(2).should('exist');
    cy.get(objects.recommendedFilm).eq(3).should('exist');
    cy.get(objects.recommendedFilm).eq(4).should('exist');
  });

  it('Add Release to Movie', () => {
    cy.get(objects.addReleaseButton).click();
    cy.get(objects.releaseDialog).should(
      'contain',
      'Add a release for The Godfather',
    );
    cy.get(objects.releaseLabel).type('Paramount');
    cy.get(`${objects.releaseLabel} >>`).should('have.value', 'Paramount');
    cy.get(objects.releaseNotes).type('The Godfather Trilogy Boxset');
    cy.get(`${objects.releaseNotes} >>`).should(
      'have.value',
      'The Godfather Trilogy Boxset',
    );
    cy.get(objects.confirmAddRelease).click();
    cy.get(objects.detailContainer).should('contain', 'Paramount');
    cy.get(objects.detailContainer).should('contain', 'blu-ray');
    cy.get(objects.detailContainer).should(
      'contain',
      'The Godfather Trilogy Boxset',
    );
  });

  it('Add Second Release to Movie', () => {
    cy.get(objects.addReleaseButton).click();
    cy.get(objects.releaseLabel).type('Paramount');
    cy.get(objects.releaseNotes).type('The Godfather Re-Release');
    cy.get(objects.confirmAddRelease).click();
    cy.get(objects.detailContainer).should('contain', 'Paramount');
    cy.get(objects.detailContainer).should('contain', 'blu-ray');
    cy.get(objects.detailContainer).should(
      'contain',
      'The Godfather Trilogy Boxset',
    );
    cy.get(objects.detailContainer).should('contain', 'Paramount');
    cy.get(objects.detailContainer).should('contain', 'blu-ray');
    cy.get(objects.detailContainer).should(
      'contain',
      'The Godfather Re-Release',
    );
  });

  it('Delete Release', () => {
    cy.get(objects.deleteRelease).eq(0).click();
    cy.get(objects.confirmDelete).click();
    cy.get(objects.detailContainer).should(
      'not.contain',
      'The Godfather Trilogy Boxset',
    );
    cy.get(objects.detailContainer).should('contain', 'Paramount');
    cy.get(objects.detailContainer).should('contain', 'blu-ray');
    cy.get(objects.detailContainer).should(
      'contain',
      'The Godfather Re-Release',
    );
  });

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

  it('Route is Not Found', () => {
    cy.visit('/not-a-real-route');
    cy.get(objects.notFound).should('contain', 'Page Not Found');
    cy.get(objects.notFound).should('contain', 'Return Home');
  });
});
