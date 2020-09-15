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
    - dtrack-cli --server ${DTRACK_HOST_URL} --bom-path bom.xml --api-key ${DTRACK_API_KEY} --project-name ${NAME} --project-version ${VERSION} --auto-create true
  allow_failure: true
  only:
    - master
```

### PyPi based projects

```yaml
stages:
  - dtrack
  
dependency-check:
  stage: dtrack
  image: python:3.6
  before_script:
    - apt update -y
    - apt install curl gnupg -y
    - curl -sL https://deb.nodesource.com/setup_12.x  | bash -
    - apt install nodejs -y
    - npm install -g @fjbarrena/dtrack-cli
    - node -v
    - pip install cyclonedx-bom
  script:
    # Assuming your code is in root, if not just make a cd
    - cyclonedx-py -i requirements.txt -o bom.xml
    - dtrack-cli --server ${DTRACK_HOST_URL} --bom-path bom.xml --api-key ${DTRACK_API_KEY} --project-name ${NAME} --project-version ${VERSION} --auto-create true
  allow_failure: true
  only:
    - master
```

### Maven based projects

```yaml
dependency-check-java:
  stage: sonar
  image: maven:3.6-openjdk-11
  before_script:
    - apt update -y
    - apt install curl gnupg -y
    - curl -sL https://deb.nodesource.com/setup_12.x  | bash -
    - apt install nodejs -y
    - npm install -g @fjbarrena/dtrack-cli
  script:
    # Assuming your code is in root, if not just make a cd
    - mvn clean install
    - mvn org.cyclonedx:cyclonedx-maven-plugin:makeBom
    - dtrack-cli --server ${DTRACK_HOST_URL} --bom-path target/bom.xml --api-key ${DTRACK_API_KEY} --project-name ${NAME} --project-version ${VERSION} --auto-create true
  allow_failure: true
  only:
    - master
```

## Dependency Track configuration example

* Install Dependency Track in a server using the latest version and based in Docker. Using the instructions of the documentation of Dependency Track
```
https://docs.dependencytrack.org/getting-started/deploy-docker/
```
* If all it's right, you will be able to access to the following URL: http://localhost:8080 (change with the IP of your server)
* Then, log in and go to the Teams section inside the administration. Edit the "Automation" Team with the following permissions

<img width="1344" alt="Screenshot 2020-09-15 at 10 39 13" src="https://user-images.githubusercontent.com/1855013/93187232-dfebe300-f73f-11ea-896e-cde4fc69917e.png">

* Make sure you have an API Key for the Automation Team, like the following (don't worry, this key is revoked ;))

<img width="466" alt="Screenshot 2020-09-15 at 10 41 52" src="https://user-images.githubusercontent.com/1855013/93187442-1a558000-f740-11ea-8399-fe0039e2ed83.png">

* Now, with the previous API Key, you will be able to use the dtrack-cli following the instructions provided, in my test using Gitlab CI/CD in a NestJS (NPM/NodeJS) project was as follows:

<img width="1103" alt="Screenshot 2020-09-15 at 10 58 22" src="https://user-images.githubusercontent.com/1855013/93189459-73261800-f742-11ea-9168-0a6b79f4c457.png">
