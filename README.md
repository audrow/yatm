# README

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
npm link # call directly with tcm
```

From there, you should be able to run the following command. If this doesn't work make sure that the place where node files are being stored is in your system path (`PATH`).

```bash
tcm -h
```

From there, you can run the tests to confirm that things are working:

```bash
npm test
```

## How to use this repository

To run the script we'll use `tcm`. You can run this command without any arguments to see the help message. Note that most commands have shortcuts, such as `tcm requirements` which can be shortened to `tcm r`.

Here are the steps to using this package:

1. Make requirements

```bash
tcm requirements list-plugins # or tcm r l
tcm requirements make all # plugin name or all
```

2. Make test cases:

```bash
tcm test-cases make
```

Note that these test cases are made from data specified in the `test-case.config.yaml`. 3. Create the test cases in the db

```bash
tcm test-cases db github create # or tcm t d github c
```

You could then delete the created issues with the following command:

```bash
tcm test-cases db github delete "." # or tcm t d github d
```

Note you can also specify some regex code with create or delete that will be used to match labels or the PR's title.

At the moment things are not very well exposed or configurable without going into a few top-level files and configuring them. If this package has more interest, I expect it to become more configurable over time.
Here is where different configuration lives:

- `src/constants.github.ts`: Configuration to use this project with Github as the database
- `src/constants.ts`: Configuration about directory structure, files that are looked for, etc.
- `test-case.config.yaml`: A YAML file that specifies the test case generation, as well as filters for what test cases to create from requirements and to specify the dimensions that should be varied for the test cases.

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

Requirements also support instructions for the tester to try and for what they should expect. If you have a try entry, you must have an expect entry.

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
