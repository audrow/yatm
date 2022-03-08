# RECORD

## 2022-03-08

So things have been refactored. Now it is about tieing things up and with the plugins.

Here are the plugins that I think that I should have:

- Generating Requirements
- Checks
  - Validation
  - Markup
    - Markdown
    - HTML
- Database CRUD
  - Should have markup format

There are also things that should be able to be overwritten, such as the following:

- The function for excluding/including requirements

How to proceed?

I think it would be best to go along with the way that I imagine using the application. That is

- [ ] Get the requirements generating correctly with the CLI and plugins
- [ ] Get the test-cases generating with the CLI
  - [ ] Add generation tag
- [ ] Add exclusion when generating the test cases - use path to YAML file
- [ ] Convert the test cases into markdown
- [ ] Create a way of deleting and uploading issues to Github
  - [ ] Avoid duplication
- [ ] (Maybe) Create a way of getting the issues on Github with simple stats - number with each label
- [ ] Write documentation on how to use this
- [ ] Do the first sheet of tests
- [ ] Do the second sheet of tests

## 2022-03-07

Alright, now I'm back from Austin. I should reorganize this project. I have read that it is better to organize by package, rather than by file type. I will split this into the following types:

- Requirements generators
  - Plugin: types of generators and their args
- Requirements schema validation
  - Plugin: requirements validation schema
- Test generators with exclusion
- Test markup
  - Plugin: markup types
- Test CRUD
  - Plugin: uploader type

The CLI:

- Generate requirements
  - Implicitly calls validation
  - Options
    - `requirements generate all|docs|files`
    - `generate requirements all|docs|files`
    - `generate requirements all|docs|files`
    - `make all requirements`
    - - `requirements make all`
- Generate test cases
  - Options
    - `make tasks --generation 1 --filter-file filter.yaml`
    - - `test-cases make ...`
- Markup test case
  - Options
    - `test-cases markup md|html`
- CRUD
  - Options
    - `test-cases db create|read|delete --type github`

In summary, the interface is as follows:

- `requirements`
  - `list-plugins`
  - `make <plugin|all>`
  - Possible
    - `clean`
- `test-cases`
  - `markup md|html --generation 1`
  - `db create|read|delete --type github --generation 1`
  - Possible
    - `clean --generation 1|undefined`
- `run --generate-plugins all --markup md --db github --generation 1`

## 2022-02-14

I am getting a little lost in organizing this application since it is many parts.
Here, I'll describe the full application so that I can better figure out what needs to be done.

1. Gather requirements
   - Input
     - Read from YAML files
     - Create YAML files from documentation site
   - Output
     - Requirements yaml files in a temporary directory
2. Requirements to test cases
   - Input
     - Read YAML files in a temporary directory
     - Some inclusion/exclusion behavior
   - Output
     - Test case objects
3. Test case creator
   - Input
     - Test case objects
   - Output
     - Test cases in various formats
       - Local markdown for preview
       - Github Issues

Some other thoughts:

- It would be great to add a generation to test cases generated - maybe this can be the time that they were generated.
- It would also be great if the markdown generated could be used to figure out what the original test case's data structure is so that I can read issues on Github, for example.
  - Alternatively, I could compare by title and content
- It will also be good view the status of an issue
- Should the dimensions be baked into the test cases? I tend to doubt it. I think that it would probably be good to have a list of dimensions and their possible values at the test case definition.

Open questions:

- What should the ID of test cases be?
- What should the output dir be?
  ```text
  output/
    requirements/
      timestamp1/
        req1.yaml
        req2.yaml
      timestamp2/
        req1.yaml
    testcases/
      timestamp2/
        yaml/
          tc1.yaml
        md/
          tc1.md
  ```
  - Alternatively I could use a generation number, which would make it easier to search Github for the user to find test cases.
- How should I handle inclusion/exclusion of test cases for various requirements files?
  - It could be a YAML file or data structure.
  - What is the goal?
    - Pick the dimensions (DDS, Install type, Platform) for specific requirements
      ```
      DDS => Documentation, Install
      ```
    - Pick the requirements for specific dimensions
      ```
      Document => DDS, Label
      ```
    - I think that I'll just do one of these.
  - What could be included?
    - Requirement name matches regex
      - Try 1
        ```yaml
        variation:
          - dds:
            - cyclone
            - fastdds
            - connext
          - platform:
            - jammy
            - windows
            - rhel
          - installType:
            - source
            - binary
        include:
          - matches:
            - title: *
        ```
      - Try 2
        ```yaml
        filter:
          - include: *
            permutations:
              - dds:
                  - cyclone
                  - fastdds
                  - connext
              - platform:
                  - jammy
                  - windows
              - installType:
                  - source
          - exclude:
              title: install
            permutations:
              - dds:
                  - connext
              - platform:
                  - windows
        ```

Next steps:

- Get the basic test case generation pipeline working
