# co-regulations-gov

## Installation

### Download code and install dependencies

```sh
$ git clone git@github.com:coforma/co-regulations-gov.git
$ cd co-regulations-gov
$ yarn install
```

### API Key & Environment Variables

1. Go to https://open.gsa.gov/api/regulationsgov/ and request an API KEY. The API KEY should arrive by email within a few minutes.

2. In `./packages/server`, make a copy of `./packages/server/.env-example` as `./packages/server/.env` and add your API KEY.

3. In `./packages/client`, make a copy of `./packages/client/.env-example` as `./packages/client/.env`

## Web Application Usage

You'll need the parent Document ID which may be obtained by navigating to that particular Document on regulations.gov.

Then, in the project root, run:

```sh
$ yarn start
```

You can now use the interface at: http://localhost:3000/

Try `CMS-2021-0168-0001` to test.

## CLI

Running the following command in the project root:

```sh
$  yarn cli {DOCUMENT_ID}
```

Will output the results to `output.csv` and `output.json` in the project root.

### Limitations

Though the script does account for rate limits, it doesn't do so exhaustively. The API's current rate limit is 500 per hour. Consequently, if there are over ~475 comments, it will likely begin to fail at some point.

### Feedback

We welcome any/all feedback/comments, including the creation of Issues and/or Pull requests to this repository.

Please direct any non-code feedback to: https://coforma.io/connect/
