# TODO

## Version 1.0.0

- [x] Use Github's API to create issues
- [x] Scrape the documentation site for pages
- [x] Make a generic way to write requirements with YAML
- [x] Validate YAML requirements file
- [x] Add tests for requirements validator
- [x] Split out markdown renderer
- [x] Figure out a good way to exclude certain issues from being created
- [ ] Make a better Github CRUD
  - [x] Keeps running until done while issues limit is in place
  - [x] Create issues
  - [x] Delete issues based on filter
- [x] Tie the application together
- [x] Make a tool with an executable that others can run
- [x] Document how to use this tool

### Possible

- [ ] Make a way of getting stats on issues opened and closed
- [ ] Make the CLI more configurable and easier to use
  - [ ] Select test config file to use
- [ ] Add autocomplete
- [ ] Allow for tags at the top level at the requirements directory
- [ ] Make the steps plugable to support new types
- [ ] Make an easier way to make a meta issue
- [ ] Make Github issue upload more efficient

## Future versions

- [ ] Host a web server for visualizing
- [ ] Support other database formats, such as MongoDB or PostGres
- [ ] Make a user interface that makes it easier to generate requirements
- [ ] Make a visual interface for adding dimensions to requirements
