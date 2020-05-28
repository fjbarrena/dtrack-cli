# dtrack-cli

A tiny CLI to upload BOM files to [OWASP Dependency Track Tool](https://dependencytrack.org/)

## Installation

Fast and furious, just install it using npm

```
npm install @fjbarrena/dtrack-cli -g
```

## Usage

Fast and furious. Just execute the following command:

```
dtrack-cli --server https://yourDependencyTrackServer.com/ --bom-path bom.xml
           --api-key PUT_YOUR_KEY_HERE --project-name "LOL Great Name"
           --project-version latest --auto-create true
```

To see the help, just run

```
dtrack-cli
```

## Requirements

* Tested in Dependency Track v3.8.0
* An API Key with enough permissions
  * You can get it in Administration -> Teams
  * Automation Team recommended, with the following permissions:
    * BOM_UPLOAD
    * PROJECT_CREATION_UPLOAD

## Gitlab CI/CD example

### package.json based projects (NodeJS, Angular, React...)

```yaml
stages:
  - dtrack

dependency-check:
  stage: dtrack
  image: node:12.17
  before_script:
    - npm install -g @cyclonedx/bom
    - npm install -g @fjbarrena/dtrack-cli
  script:
    # Assuming your code is in root, if not just make a cd
    - npm install
    - cyclonedx-bom -o bom.xml
    - dtrack-cli --server ${SERVER} --bom-path bom.xml --api-key ${KEY} --project-name ${NAME} --project-version ${VERSION} --auto-create true
  allow_failure: true
  only:
    - master
```