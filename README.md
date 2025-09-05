Hi everyone, this will be our repository that we will be using for our project.
Please read this README to the end since it has important information.

### Prerequisites
Firstly, please install the following on your system:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node LTS](https://nodejs.org/en)
- [UV (Python Package and Version Manager)](https://docs.astral.sh/uv/getting-started/installation/#installation-methods)
- [Git](https://git-scm.com/downloads) 

Docker will be used for our postgres + ensuring the program runs on everyone's system just fine.
Node is used for frontend.
UV (Python) will be used on the backend.

### Getting Started
First, navigate to a desirable place in your computer through the terminal (or you can do it using Github Desktop).

```bash
  git clone https://github.com/AlexanderWangY/SWE_10776_Group3.git
```
> Or do this in Github Desktop

... wait ... we need to add more setup instructions here...


### How to contribute
For every contribution, you need to create a new branch.
You can do this locally by running the following command:

```bash
  git checkout -b new_branch_name
```

Your branch should have the following naming convention:

feat/<the feature name>
fix/<the bug fix name>

After you are ok with changes, push and commit to the new branch, then make a pull request into main.


### Folder Structure
Onto folder structure,
.
├── docker-compose.yml
└── apps
    ├── web
    │   ├── Dockerfile
    │   └── src/
    └── api
        ├── Dockerfile
        └── src/
