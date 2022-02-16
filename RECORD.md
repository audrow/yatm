# RECORD

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
