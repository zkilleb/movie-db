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
  });

  it("Search Added Movie", () => {
    cy.get(objects.searchTextField).type("The Godfather");
    cy.get(objects.searchButton).click();
    cy.wait(1000);
    cy.url().should("include", "/search");
    cy.get(objects.posterImage).should('have.attr', 'alt').then((alt) => {
        expect(alt).to.equal("The Godfather poster");
    });
  });
});
