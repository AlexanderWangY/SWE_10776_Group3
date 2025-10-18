# GatorMarket
Hi, hey, hello! Welcome to GatorMarket, the UF student centered marketplace. Think Facebook Marketplace but for verified UF students! 

This is the official repository for GatorMarket's platform. If you don't know why you are here, then we'd recommend you go [here](https://gatormarket.com). However, if you _DO_ know what you are doing, then welcome aboard. In this README we will specify the structure of this platform as well as best practices for contributing.

## Technical Overview
Our platform runs on the following technologies:
* React (React Router v7)
* FastAPI (Python)
* PostgreSQL

Should you have any questions or concerns when working on the platform, you can (and should) refer to each technology's respective documentation. If you are already familiar with these technologies, then move on to the next section to get up and running!

## Getting Started
In order to get started, you will need the following software installed on your development machine.

* [Docker Engine/Desktop](https://www.docker.com/get-started/)
* An IDE of your choosing (VSCode / Jetbrain Suite)
* [Git](https://git-scm.com/)
* [NVM](https://nodejs.org/en/download) or [NVM for Windows](https://github.com/coreybutler/nvm-windows)

You may also install the following, although not strictly necessary. We would recommend only installing these _if you know what you are doing_.

* [UV (Python Environment Manager)](https://github.com/astral-sh/uv)

#### 1. Clone the Git Repository
Open your terminal and navigate to a directory in which you would like the project to live. Then run the following:
```bash
git clone https://github.com/AlexanderWangY/SWE_10776_Group3

cd SWE_10776_Group3
```

#### 2. Run Database Migrations
In order to run migrations on your local database, we will need to navigate to the server folder. Run the correct command based on your OS. This is because Windows doesn't ship with `make` available. However, you can also find a way to install it (or use WSL - Windows Subsystem for Linux).
```bash
# From root
cd server

# For Mac/Linux
make migrate-up 

# For windows
docker compose run --rm server uv run alembic upgrade head
```
> ⚠️ **IMPORTANT**: You may need to run migrations every so often to ensure your DB schema stays the same as the most recent merges. You may follow the steps above for every migration!

#### 3. Create the backend environment files.
In your server folder, make a duplicate of the example environment file named `example.env`. Rename the new copy `.env` **WITHOUT** deleting the original `example.env`.

#### 4. Start the development services
Run the following command:
```
docker compose up
```
Wait for the service images to build, and start developing. These services should hot-reload when you change code!

## Making DB Changes
So you want to add a new table, alter an existing one, or modify the database schema to a certain extent. Here are the following steps to ensure it works.

#### 1. Add your changes inside the server's `app/models/` folder 
Either edit the existing file for an existing table, or create a new table with a new file.

#### 2. For new tables, add the class inside `app/models/__init__.py`
The file should look like this afterwards:

```python
from .access_token import AccessToken
from .user import User
from .base import Base
# Insert your new table class
from .<your file> import YourClass

__all__ = ["Base", "User", "AccessToken", "YourClass"]
```

#### 3. For new tables, add the class inside `/alembic/env.py`
Your `env.py` file should look something like this afterwards:

```python
import os

from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

from app.models import Base, User, AccessToken, YourClass # <- Your new class

_ = User, AccessToken, YourClass # <- Assign to dummy variable like the rest.

### Don't touch anything below
... Rest of the code
```

#### 4. Generate a new migration with a message
In your root `server` folder, run the following in your terminal:
```bash
# Mac/Linux
make migrate-new msg="your msg here" # (for example, "added auth tables")

# Windows
docker compose run --rm server uv run alembic revision --autogenerate -m "your msg here"
```
This will autogenerate a new migration file inside `alembic/versions/` based off the diff between the current DB schema and the changed files.

#### 5. Ensure migration files make sense!
Navigate into `alembic/versions` and find your newly generate migration file. It should have your message appended somewhere at the end of the file name. Open it in your editor and ensure types, names, and imported modules are correct. If you run into errors in the next step, most likely you didn't do this step correctly (or you just didn't make your changes correctly LOL)

#### 6. Migrate the changes!
Go ahead and run the following in your terminal in the `server` directory.
```bash
# For Mac/Linux
make migrate-up 

# For windows
docker compose run --rm server uv run alembic upgrade head
```
This will actually apply changes to your database! You are good to go if this step completes fine without erroring!

## Contribution Guide
Oh hey! Thanks for wanting to contribute! In order to push new features, changes, and fixes, we need to set a few ground rules.

1) Changes must be from a branch into `main`
2) Changes must pass ALL tests and linters.
3) Changes must be reviewed by a collaborator before merging.

Please start commit messages in the following format:

- fix: [your msg]
- feat: [your msg]
- chore: [your msg]
- docs: [your msg]

This is based on the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard. Please give it a read!

