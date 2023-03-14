# README

- [Features](#features)
- [Getting started](#getting-started)
- [How to use this repository](#how-to-use-this-repository)
  - [Command line interface](#command-line-interface)
  - [Configuration](#configuration)
  - [Creating Requirements](#creating-requirements)
  - [Creating Test Cases from Requirements](#creating-test-cases-from-requirements)
  - [Lessons Learned](#lessons-learned)

This project is used as an alternative to various test case management softwares.
It allows you to define requirements and then to create test cases from those requirements.

There are a few parts of this project where you can write your own plugins:

- Generating requirements
- Supporting different databases for test cases

In the future, I plan to make the supported steps for the test cases plugable.

## Features

- YAML format to specify requirements
  - Can specify instructions for what to try and what you should expect
  - The instructions for the try and expect sections can have 1 or more steps
  - The instructions for the try and expect sections support several formats:
    - Notes
    - Images (stored somewhere online)
    - Stdin, stdout, stderr with numbered terminals
- Create test cases from requirements for combinations
  - Supports YAML file to filter requirements and create specific combinations of test cases
  - Requirements are validated through JSON Schema Validation
- Test cases support a generation number
- Supports Github Issues as a database for test cases
  - Create test cases if they don't exist
  - Create test cases from available test cases given a regex pattern
  - Delete test cases that match a regex pattern

You define requirements in YAML files, or can write plugins to generate requirements.

## Getting started

To get started, install [NodeJS 16](https://nodejs.org/en/), clone this repository, and run the following:

```bash
npm ci  # install dependencies
npm run prepare  # setup git hooks
```

```bash
npx ts-node src/index.ts -h
```

From there, you can run the tests to confirm that things are working:

```bash
npm test
```

## How to use this repository

### Command line interface

To run the script we'll use `npx ts-node src/index.ts`. You can run this command without any arguments to see the help message. Note that most commands have shortcuts, such as `npx ts-node src/index.ts requirements` which can be shortened to `npx ts-node src/index.ts r`.

Here are the steps to using this package:

1. Make requirements

   ```bash
   npx ts-node src/index.ts requirements list-plugins # or npx ts-node src/index.ts r l
   npx ts-node src/index.ts requirements make all # plugin name or all
   ```

2. Make test cases:

   ```bash
   npx ts-node src/index.ts test-cases make
   ```

   Note that these test cases are made from data specified in the `test-case.config.yaml`.

3. Create the test cases in the db

   ```bash
   npx ts-node src/index.ts test-cases db github create # or npx ts-node src/index.ts t d github c
   ```

   You could then delete the created issues with the following command:

   ```bash
   npx ts-node src/index.ts test-cases db github delete "." # or npx ts-node src/index.ts t d github d
   ```

   Note you can also specify some regex code with create or delete that will be used to match labels or the PR's title.

### Configuration

At the moment things are not very well exposed or configurable without going into a few top-level files and configuring them. If this package has more interest, I expect it to become more configurable over time.
Here is where different configuration lives:

- `src/constants.github.ts`: Configuration to use this project with Github as the database
- `src/constants.ts`: Configuration about directory structure, files that are looked for, etc.
- `test-case.config.yaml`: A YAML file that specifies the test case generation, as well as filters for what test cases to create from requirements and to specify the dimensions that should be varied for the test cases.

You will also need an environmental variable for your Github Personal Access token, stored in `GITHUB_TOKEN`. The easiest way to do this is probably to have a `.env` file in the project's root which has the following content:

```bash
GITHUB_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Note that your personal access token will need to have the ability to read and write the repository you would like to create issues in.

### Creating Requirements

To create your own requirements, add a yaml file to the `requirements` directory or create a plugin that puts files into `generated-files/requirements`. The minimum requirement file should look like the following:

```yaml
requirements:
  - name: Requirement
    checks:
      - name: Check
```

You can add labels or a URL to requirement, for example:

```yaml
requirements:
  - name: Requirement
    labels:
      - ros2cli
      - another label
    url: https://github.com/ros2/ros2cli
    checks:
      - name: Check
```

You can have multiple checks for each requirement and multiple requirements in one requirements file:

```yaml
requirements:
  - name: Requirement name 1
    checks:
      - name: Check 1
      - name: Check 2
  - name: Requirement name 2
    checks:
      - name: Check 3
```

Requirements also support instructions for the tester to try and for what they should expect. You can have a try statement without an expect statement, but you cannot have an expect statement without a try statement.

```yaml
requirements:
  - name: Requirement
    checks:
      - name: ROS2 Topic help
        try:
          - note: something to try
        expect:
          - stdout: /greet
```

The steps in try and accept support several arguments:

- `note`: For textual instructions
- `imageUrl`: For an image URL (note, the image must be hosted somewhere on the internet)
- `stdin`, `stdout`, and `stderr`: For terminal input, output, and errors. Note that these arguments support an optional argument `terminal` to number the terminal.

You can use one or more of these in each step. Unfortunately for now, they will always display in a fixed order.

Here is a more complete example:

```yaml
requirements:
  - name: Test ROS 2 Bag
    labels:
      - ros2cli
    url: https://github.com/ros2/ros2cli
    checks:
      - name: ROS2 Topic help
        try:
          - note: Try the help command
            stdin: ros2 topic show --help
            terminal: 2
        expect:
          - note: You should get the following
            imageUrl: https://img.search.brave.com/TBRxzNr6M8Enl8QPxfadgwmwEdKnYY1yUuyCsg50AYI/rs:fit:200:200:1/g:ce/aHR0cHM6Ly9hd3Mx/LmRpc2NvdXJzZS1j/ZG4uY29tL2dpdGh1/Yi9vcmlnaW5hbC8y/WC9kL2Q0MTY3NmM5/YmY5ZmJhYThlZGJl/NzZlZjM0NzQ0ZjM4/MDg5ZDA0NzQuc3Zn.svg
```

Also, note that you should be able to use all of YAML's goodness in any YAML file. You can see [this YAML cheat sheet](https://quickref.me/yaml) for inspiration.

### Creating Test Cases from Requirements

Test cases are generated for requirements for specific combinations of discrete labels. To make this easier, a YAML file, `test-case.config.yaml`, specifies which labels should be applied to which requirements. An example of this YAML file is as follows:

```yaml
generation: 1
sets:
  - filters:
      - isMatch: true
        name: tf2
        labels:
          - docs
    dimensions:
      os:
        - jammy
      buildType:
        - debian
        - source
```

The `generation` key is an idea from databases. It creates a high-level label for identifying a group of tests that was created together.

The `sets` key takes an array of sets that should specify which requirements should be made into tests. In each set, there is a `filters` key and a `dimensions` key. The `filters` key allows you to specify which requirements to include (`isMatch: true`) or exclude (`isMatch: false`). Requirements can be narrowed down with zero or more labels or a regex expression that will be compared to the name of each requirement. For example, in the YAML above, the filters would find requirements with the `docs` label that have `tf2` in the title.

The `dimensions` key allows you to specify arbitrary lists to get the combinations for.
For example, the above YAML would create the following combinations: `[jammy, debian]` and `[jammy, source]`. You can imagine that the number of combinations blows up as there become more dimensions.

### Lessons Learned

Here is some advice for using this framework, based on some experience with it. As it is early days for this project, feel free to disregard them, if you find something better.

- Include requirements in bulk with labels and then refine from there with a combination of labels and name (more brittle).
- Split requirements up into files with logical groupings.
- Test how your requirements render before uploading them to a database (e.g., Github).
