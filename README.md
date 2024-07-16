# Cardano Grades
A blockchain-based infrastructure for managing academic data

## Quickstart

### Docker
1. **Ensure docker is installed**:
    - If not, download and install it from [Docker's official site](https://www.docker.com/).

2. **Configure environment variables**:
    - Copy the example environment file and modify it as needed.
```bash
cp .env.example .env
```

3. **[Optional] Add your ProofSpace RSA private key**:
    - Place your RSA private key in the [application/ps_sk](application/ps_sk) file.

4. **[Optional] Create the Credential Schemas and relevant interactions from the ProofSpace UI:**
    - Create and deploy the Verifiable Credential Schemas, along with the interactions to issue them, from the ProofSpace dashboard. 
    - Update the constants, credential IDs, and schema IDs to their new values in the [proofspaceRepository](application/src/database/proofspaceRepository.js).

    **Note**: If you do not want to use ProofSpace, it is possible to run the application without it. To do this, you need to unset the `PROOFSPACE` environmental variable in the `.env` file. The application will still be fully functional without ProofSpace, but will miss some features that rely on ProofSpace.
5. **Build and run the Docker container**:
    - Execute the [build_docker](build_docker.sh) script to build and run the container. This will start an emulated Cardano node to test the infrastructure, start the backend server, seed the database, add some subjects, teachers and students to the system, and seed the students with some initial grades.
```bash
sh build_docker.sh
```
6. **Access the application**:
    - The application can be accessed at `http://localhost:3000`

## System Architecture

![Alt Components](./images/system_arch.png?raw=true "Title")

The platform consists of the following main components:

- Cardano Smart Contracts
    - Plutus scripts written in the [Aiken Programming Language](https://aiken-lang.org/), responsible for validating and verifying every modification to the academic data
- [ProofSpace](https://www.proofspace.id/)
    - SaaS solution that simplifies working with Decentralized Identifiers and the issuance of Verifiable Credentials
- ProofSpace Mobile Application
    - Provided by ProofSpace, it functions as the user's digital wallet, storing their Decentralized Identifier and allowing them to view their credentials
- Backend
    - Contains all the [off-chain code](application/src/database/cardanoRepository.js) to interact with the Cardano network, utilizing the [Lucid](https://lucid.spacebudz.io/) library
    - Responsible for [invoking the ProofSpace API](application/src/database/proofspaceRepository.js) to issue Verifiable Credentials
    - Manages an [off-chain database](application/src/models) to store stakeholders' login credentials
- Frontend
    - Primary user interface for all the stakeholders