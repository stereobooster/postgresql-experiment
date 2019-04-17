# Experiment with DBs and auto API generation

## PostgreSQL

We will use Docker to run everything. Because we need to run more than one docker image and this is a toy project we will use [docker compose](https://docs.docker.com/compose/gettingstarted/).

...

## External client

(optional)

[Let's connect to the database with an external client](https://www.cockroachlabs.com/docs/managed/stable/managed-connect-to-your-cluster.html).

Start compose

```
docker-compose up
```

[Use DB client of your preference](https://github.com/dhamaniasad/awesome-postgres#gui). I would use [pgcli](https://www.pgcli.com/).

```
pgcli "postgresql://postgres:password@localhost:5432/postgres"
Server: PostgreSQL 11.2
Version: 2.0.2
Chat: https://gitter.im/dbcli/pgcli
Mail: https://groups.google.com/forum/#!forum/pgcli
Home: http://pgcli.com
postgres@localhost:postgres>
```

## Sample database

Let's set up [sample database](https://stackoverflow.com/questions/5363613/sample-database-for-postgresql).

There are a lot of them (but not all work out of the box):

- https://github.com/devrimgunduz/pagila
- https://github.com/catherinedevlin/opensourceshakespeare
- http://pgfoundry.org/projects/dbsamples/
- https://musicbrainz.org/doc/MusicBrainz_Database/Download
- http://wiki.postgresql.org/wiki/Sample_Databases

I picked up [opensourceshakespeare](https://github.com/catherinedevlin/opensourceshakespeare).

```
mkdir db/dump
wget https://raw.githubusercontent.com/catherinedevlin/opensourceshakespeare/master/shakespeare.sql -O db/dump/shakespeare.sql
docker-compose up -d
  Starting db-experiment_db_1 ... done
docker exec -it db-experiment_db_1 bash
root@1539eecb5137:/# psql -U postgres postgres < tmp/dump/shakespeare.sql
root@1539eecb5137:/# exit
```

## Autogenerated API

### Postgraphile

Let's add Postgraphile. To do this we can use [official docker image](https://hub.docker.com/r/graphile/postgraphile/). But first, let's try it locally

```
npx postgraphile -n 0.0.0.0 --connection "postgresql://postgres:password@localhost:5432/postgres" --schema postgres --watch
```

### Hasura

Let's add [Hasura section to the docker compose](https://docs.hasura.io/1.0/graphql/manual/deployment/docker/index.html#step-1-get-the-docker-run-sh-bash-script).

## GraphQL explorers

### Voyager

```
npx serve -s voyager -p 5001
```

Open http://localhost:5001

### Rover

- Go to https://brbb.github.io/graphql-rover/
- Configure Endpoint url http://localhost:5000/graphql

## Visualization and analytics

### superset

See docker-compose section for superset.

Credentials

```
username: admin
password: superset
```

Go to add database scrion. Add postgresql://postgres:password@db:5432/postgres

### redash

See https://github.com/getredash/redash/blob/master/docker-compose.yml

## Other

- https://github.com/QuantumObject/docker-mywebsql
- https://github.com/taivokasper/docker-omnidb
- https://www.gatsbyjs.org/docs/headless-cms/
- https://github.com/postlight/awesome-cms

### Ghost as CMS

Use docker `docker run -p 3001:2368 ghost` or [deploy to heroku](https://github.com/cobyism/ghost-on-heroku).

Use gatsby as GraphQL API proxy

```
git clone https://github.com/TryGhost/gatsby-starter-ghost.git
cd gatsby-starter-ghost
yarn
yarn dev
```

Go to http://localhost:8000/___graphql

### WordPress as CMS

```
git clone https://github.com/postlight/headless-wp-starter.git
cd headless-wp-starter
docker-compose up
```

- Dashboard: http://localhost:8080/wp-admin (default credentials nedstark/winteriscoming)
- GraphQL API: http://localhost:8080/graphql

### Directus

```
git clone https://github.com/directus/docker.git directus
cd directus/examples/single-api
docker-compose up
```

- Dashboard: http://localhost:8000/ (default credentials admin@localhost.com/directusrocks)
- API: http://localhost:7000/

> You can assign a static token to any user by adding a value to the token column in the directus_users table in the database directly. As of right now, it's not (yet) possible to set this token from the admin application, as it's rather easy to create a huge security leak for unexperienced users.

```
docker exec -i -t single-api_database_1 mysql --user=someusername --password=somepassword somedb
```

```sql
UPDATE directus_users SET token='token' where id=1;
exit;
```

Use gatsby as GraphQL API proxy

```
npx gatsby new directus-starter
cd directus-starter
yarn add gatsby-source-directus
```

change `gatsby-config.js` - add plugin config

```js
{
  resolve: `gatsby-source-directus`,
  options: {
    /*
      * The base URL of Directus without the trailing slash.
      * Example: 'example.com' or 'www.example.com'
      */
    url: `localhost:7000`,
    /*
      * Directus protocol. Can be either http or https
      */
    protocol: "http",
    /*
      * Directus API key. You can find it on the bottom of your account settings page.
      */
    apiKey: "token",
  },
},
```

```
yarn develop
...
error Plugin gatsby-source-directus returned an error
ReferenceError: regeneratorRuntime is not defined
```

### Strapi

start db continer

```
docker-compose up
```

login into PostgreSQL database

```
docker exec -it db-experiment_db_1 psql --u postgres
```

create db

```sql
create database strapi;
```

stop container. Add strapi section to compose file

```yaml
strapi:
  image: strapi/strapi
  depends_on:
    - db
  ports:
    - 1337:1337
  environment:
    - APP_NAME=strapi-app
    - DATABASE_CLIENT=postgres
    - DATABASE_HOST=db
    - DATABASE_PORT=5432
    - DATABASE_USERNAME=postgres
    - DATABASE_PASSWORD=password
    - DATABASE_NAME=strapi
  volumes:
    - ./db/strapi-app/:/usr/src/api/strapi-app
```

start

```
docker-compose up
```

Go to http://localhost:1337/admin/. Register.

Go to http://localhost:1337/admin/marketplace. Install GraphQL plugin.

Add content type.

Edit permissions http://localhost:1337/admin/plugins/users-permissions/roles/edit/3

Your API is ready http://localhost:1337/graphql.

### Prime

```
git clone https://github.com/primecms/heroku.git docker-primecms
cd docker-primecms
docker-compose up
```

Go to http://localhost:4000

### Cockpit

https://getcockpit.com/

```
docker run -p 8080:80 agentejo/cockpit
```

Go to http://localhost:8080/install/

And I have no idea how to install [CockpitQL](https://github.com/agentejo/CockpitQL).

### Mesh

```
docker run -p 8080:8080 gentics/mesh-demo
```

go to http://localhost:8080/mesh-ui/ (use admin/admin for credentials)
