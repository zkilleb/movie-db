const objects = {
  header: "[data-cy=Header]",
  titleField: "[data-cy=TitleField]",
  runtimeField: "[data-cy=RuntimeField]",
  releaseYearField: "[data-cy=ReleaseYearField]",
  languageField: "[data-cy=LanguageField]",
  directorField: "[data-cy=DirectorField]",
  labelField: "[data-cy=LabelField]",
  notesField: "[data-cy=NotesField]",
  addActorField: "[data-cy=AddActorField]",
  addActorButton: "[data-cy=AddActorButton]",
  addActorRow: "[data-cy=AddActorRow]",
  submitButton: "[data-cy=SubmitButton]",
  searchTextField: "[data-cy=SearchTextField]",
  searchButton: "[data-cy=SearchFieldButton]",
  posterImage: "[data-cy=PosterImage]",
  searchResultPage: "[data-cy=SearchResultPage]",
  searchResult: "[data-cy=SearchResult]",
  detailPoster: "[data-cy=DetailPoster]",
  detailContainer: "[data-cy=DetailContainer]",
  recommendations: "[data-cy=Recommendations]",
  recommendedFilm: "[data-cy=RecommendedFilm]",
  editIcon: "[data-cy=EditIcon]",
  deleteIcon: "[data-cy=DeleteIcon]",
  confirmDelete: "[data-cy=ConfirmDelete]",
  detailAlert: "[data-cy=DetailAlert]",
  review: "[data-cy=Review]",
};

describe("Test Application Workflow", () => {
  it("Verifies the Home Page Loads", () => {
    cy.visit("/");
    cy.get(objects.header).should("exist");
  });

  it("Add Movie", () => {
    cy.get(`${objects.header} > :nth-child(2)`).click();
    cy.url().should("include", "/add");
    cy.get(objects.titleField).type("The Godfather");
    cy.get(`${objects.titleField} >>`).should("have.value", "The Godfather");
    cy.get(objects.runtimeField).type("175");
    cy.get(`${objects.runtimeField} >>`).should("have.value", "175");
    cy.get(objects.releaseYearField).type("1972");
    cy.get(`${objects.releaseYearField} >>`).should("have.value", "1972");
    cy.get(objects.languageField).type("English");
    cy.get(`${objects.languageField} >>`).should("have.value", "English");
    cy.get(objects.directorField).type("Francis Ford Coppola");
    cy.get(`${objects.directorField} >>`).should(
      "have.value",
      "Francis Ford Coppola"
    );
    cy.get(objects.labelField).type("Paramount");
    cy.get(`${objects.labelField} >>`).should("have.value", "Paramount");
    cy.get(objects.notesField).type("Part of The Godfather Trilogy release");
    cy.get(`${objects.notesField} >>`).should(
      "have.value",
      "Part of The Godfather Trilogy release"
    );
    cy.get(objects.addActorField).type("Al Pacino");
    cy.get(objects.addActorButton).click();
    cy.get(objects.addActorRow).eq(0).should("contain", "Al Pacino");
    cy.get(objects.submitButton).click();
    cy.wait(3000);
  });

  it("Verify Duplicate Cannot Be Added", () => {
    cy.get(`${objects.header} > :nth-child(2)`).click();
    cy.url().should("include", "/add");
    cy.get(objects.titleField).type("The Godfather");
    cy.get(`${objects.titleField} >>`).should("have.value", "The Godfather");
    cy.get(objects.runtimeField).type("175");
    cy.get(`${objects.runtimeField} >>`).should("have.value", "175");
    cy.get(objects.releaseYearField).type("1972");
    cy.get(`${objects.releaseYearField} >>`).should("have.value", "1972");
    cy.get(objects.languageField).type("English");
    cy.get(`${objects.languageField} >>`).should("have.value", "English");
    cy.get(objects.directorField).type("Francis Ford Coppola");
    cy.get(`${objects.directorField} >>`).should(
      "have.value",
      "Francis Ford Coppola"
    );
    cy.get(objects.labelField).type("Paramount");
    cy.get(`${objects.labelField} >>`).should("have.value", "Paramount");
    cy.get(objects.notesField).type("Part of The Godfather Trilogy release");
    cy.get(`${objects.notesField} >>`).should(
      "have.value",
      "Part of The Godfather Trilogy release"
    );
    cy.get(objects.addActorField).type("Al Pacino");
    cy.get(objects.addActorButton).click();
    cy.get(objects.addActorRow).eq(0).should("contain", "Al Pacino");
    cy.intercept("PUT", "**/add**", {}).as("addMovie");
    cy.get(objects.submitButton).click();
    cy.get(objects.detailAlert).should("contain", "Record already exists");
    cy.wait(3000);
  });

  it("Search Added Movie", () => {
    cy.get(objects.searchTextField).type("Th");
    cy.get(objects.searchButton).click();
    cy.get(objects.detailAlert).should(
      "contain",
      "Search must be at least 3 charactes long"
    );
    cy.get(`${objects.searchTextField} >>`).clear();
    cy.get(objects.searchTextField).type("The Godfather");
    cy.get(objects.searchButton).click();
    cy.url().should("include", "/search");
    cy.get(objects.posterImage)
      .should("have.attr", "alt")
      .then((alt) => {
        expect(alt).to.equal("The Godfather poster");
      });
    cy.get(objects.searchResultPage).should(
      "contain",
      "Results for The Godfather: 1"
    );
    cy.get(objects.searchResult).eq(0).should("contain", "The Godfather");
    cy.get(objects.searchResult).eq(0).should("contain", "1972");
    cy.get(objects.searchResult)
      .eq(0)
      .should("contain", "Directed By: Francis Ford Coppola");
    cy.get(objects.searchResult).eq(0).should("contain", "Language: English");
    cy.get(objects.searchResult).eq(0).should("contain", "Runtime: 175 mins.");
    cy.get(objects.searchResult).eq(0).should("contain", "Actors: Al Pacino");
  });

  it("View Movie Detail", () => {
    cy.get(objects.searchResult).eq(0).dblclick();
    cy.url().should("include", "/detail");
    cy.get(objects.detailPoster)
      .should("have.attr", "alt")
      .then((alt) => {
        expect(alt).to.equal("The Godfather poster");
      });
    cy.get(objects.detailContainer).should("contain", "The Godfather");
    cy.get(objects.detailContainer).should("contain", "1972");
    cy.get(objects.detailContainer).should(
      "contain",
      "Directed By: Francis Ford Coppola"
    );
    cy.get(objects.detailContainer).should("contain", "Language: English");
    cy.get(objects.detailContainer).should("contain", "Runtime: 175 mins.");
    cy.get(objects.detailContainer).should("contain", "Starring: Al Pacino");
    cy.get(objects.detailContainer).should("contain", "Label: Paramount");
    cy.get(objects.detailContainer).should(
      "contain",
      "Notes: Part of The Godfather Trilogy release"
    );
    cy.get(objects.review).should("contain", "Review By Roger Ebert:");
    cy.get(objects.recommendations).should("contain", "Similar Films:");
    cy.get(objects.recommendedFilm).eq(0).should("exist");
    cy.get(objects.recommendedFilm).eq(1).should("exist");
    cy.get(objects.recommendedFilm).eq(2).should("exist");
    cy.get(objects.recommendedFilm).eq(3).should("exist");
    cy.get(objects.recommendedFilm).eq(4).should("exist");
  });

  it("Edit Movie", () => {
    cy.get(objects.editIcon).click();
    cy.url().should("include", "/edit");
    cy.get(`${objects.titleField} >>`).should("have.value", "The Godfather");
    cy.get(`${objects.runtimeField} >>`).should("have.value", "175");
    cy.get(`${objects.releaseYearField} >>`).should("have.value", "1972");
    cy.get(`${objects.languageField} >>`).should("have.value", "English");
    cy.get(`${objects.directorField} >>`).should(
      "have.value",
      "Francis Ford Coppola"
    );
    cy.get(`${objects.labelField} >>`).should("have.value", "Paramount");
    cy.get(`${objects.notesField} >>`).should(
      "have.value",
      "Part of The Godfather Trilogy release"
    );
    cy.get(objects.addActorRow).eq(0).should("contain", "Al Pacino");
    cy.get(objects.addActorField).type("Marlon Brando");
    cy.get(objects.addActorButton).click();
    cy.get(objects.addActorRow).eq(0).should("contain", "Al Pacino");
    cy.get(objects.addActorRow).eq(1).should("contain", "Marlon Brando");
    cy.get(objects.submitButton).click();
    cy.wait(3000);
    cy.url().should("include", "/detail");
    cy.get(objects.detailPoster)
      .should("have.attr", "alt")
      .then((alt) => {
        expect(alt).to.equal("The Godfather poster");
      });
    cy.get(objects.detailContainer).should("contain", "The Godfather");
    cy.get(objects.detailContainer).should("contain", "1972");
    cy.get(objects.detailContainer).should(
      "contain",
      "Directed By: Francis Ford Coppola"
    );
    cy.get(objects.detailContainer).should("contain", "Language: English");
    cy.get(objects.detailContainer).should("contain", "Runtime: 175 mins.");
    cy.get(objects.detailContainer).should(
      "contain",
      "Starring: Al Pacino, Marlon Brando"
    );
    cy.get(objects.detailContainer).should("contain", "Label: Paramount");
    cy.get(objects.detailContainer).should(
      "contain",
      "Notes: Part of The Godfather Trilogy release"
    );
    cy.get(objects.recommendations).should("contain", "Similar Films:");
    cy.get(objects.recommendedFilm).eq(0).should("exist");
    cy.get(objects.recommendedFilm).eq(1).should("exist");
    cy.get(objects.recommendedFilm).eq(2).should("exist");
    cy.get(objects.recommendedFilm).eq(3).should("exist");
    cy.get(objects.recommendedFilm).eq(4).should("exist");
  });

  it("Delete Movie", () => {
    cy.wait(3000);
    cy.get(objects.searchTextField).type("The Godfather");
    cy.get(objects.searchButton).click();
    cy.get(objects.searchResult).eq(0).dblclick();
    cy.get(objects.deleteIcon).click();
    cy.get(objects.confirmDelete).click();
    cy.wait(3000);
    cy.get(objects.searchTextField).type("The Godfather");
    cy.get(objects.searchButton).click();
    cy.get(objects.searchResultPage).should(
      "contain",
      "Results for The Godfather: 0"
    );
    cy.get(objects.searchResultPage).should("contain", "Add Movie");
  });
});
