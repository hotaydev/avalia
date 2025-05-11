# Avalia Project Roadmap

Below is a list of features that will be included in each planned version of the "Avalia" system.

### Version 1.0 (Completed)

- **Evaluator:**

  - [x] Evaluator area accessible via direct link
  - [x] Evaluator area accessible via code
  - [x] Send access link and evaluator code via email and WhatsApp
  - [x] Block evaluation submissions outside the defined period

- **Administration:**

  - [x] Import Evaluators via Google Sheets
  - [x] Import Projects via Google Sheets
  - [x] Configure destination spreadsheet for grades
  - [x] Administrative area with passwordless login
  - [x] Configure access and links for control spreadsheets
  - [x] Google authentication for administrative area
  - [x] Invite administrators to the administrative area
  - [x] Configure maximum date for receiving evaluations
  - [x] Configure start date for receiving evaluations
  - [x] Ability to view how many evaluations were completed for each project

- **System:**

  - [x] Project listing with grades (classification/ranking)
  - [x] Assign a project to an evaluator
  - [x] Add favicon
  - [x] Define 404 page with link to /
  - [x] Add `robots.txt`
  - [x] Handle 429 errors (WAF Rate-Limit) by informing the user
  - [x] Publish documentation

### Version 2.0 (In Progress)

- **Evaluator:**

  - [ ] Evaluator registration page

- **Administration:**

  - [ ] Projects registration page
  - [ ] Configure evaluator form
  - [ ] Configure different rankings
  - [ ] Add more social login options
  - [ ] Ability to edit school/fair name (currently only possible in initial setup)
  - [ ] Improve CSS styles for mobile viewing (currently only works on desktop, only evaluator pages are optimized for mobile and desktop)
  - [ ] Export rankings as PDF
  - [ ] Option for different grading systems (e.g. 5 to 10 and 1 to 5)

- **System:**

  - [ ] Automatically create spreadsheets in connected Drive account
  - [ ] Use numeric IDs for projects, allowing reordering

### Version 3.0

- **System:**

  - [ ] Migrate `/src/pages` to Next.js `/src/app` pattern (using SSR)
  - [ ] Better componentization of page content
  - [ ] Improve project documentation and development guides for the community
  - [x] Implement donation methods for the project beyond GitHub Sponsors
  - [ ] Implement internationalization system
  - [ ] Move all texts to an easily translatable file (internationalization)

- **Evaluator:**

  - [ ] Export evaluator participation certificate

- **Administration:**

  - [ ] Settings for evaluator participation certificate
