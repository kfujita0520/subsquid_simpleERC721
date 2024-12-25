

# Minimal EVM squid



## Quickstart

```bash


# 1. Install dependencies
npm ci

# 2. Start a Postgres database container and detach
sqd up

# 3. Build the squid
sqd build

# 4. Build and start the processor
sqd process

# 5. The command above will block the terminal
#    being busy with fetching the chain data, 
#    transforming and storing it in the target database.
#
#    To start the graphql server open the separate terminal
#    and run
sqd serve

```
A GraphiQL playground will be available at [localhost:4350/graphql](http://localhost:4350/graphql).


## Customize Flow

### 1. Change database schema and Generate TypeORM classed

Change graph query schema on `schema.graphql` as needed

Create necessary entity classes under src/model/generated folder by running `sqd codegen` command.

### 2. Import ABI contract and generate interfaces to decode events

Place erc721 and erc1155 ABI definition taken from astar-erc-tokens repository into ./abi folder.
Generate a type-safe facade class to decode EVM log under ./src/abi folder by executing `sqd typegen` command

### 3. Change processor and main script

Change network configration to Polygon in .env and processor.js.
Accordingly the implementaion under common and mapping folder should also be changed.


### 4 regenerate db schema migration files
```bash
rm -r db/migrations
npx squid-typeorm-migration generate
```

## Reference 
https://docs.subsquid.io/sdk/how-to-start/squid-development/



## Project conventions

Squid tools assume a certain [project layout](https://docs.subsquid.io/basics/squid-structure):

* All compiled js files must reside in `lib` and all TypeScript sources in `src`.
The layout of `lib` must reflect `src`.
* All TypeORM classes must be exported by `src/model/index.ts` (`lib/model` module).
* Database schema must be defined in `schema.graphql`.
* Database migrations must reside in `db/migrations` and must be plain js files.
* `sqd(1)` and `squid-*(1)` executables consult `.env` file for environment variables.