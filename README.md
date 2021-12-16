# co-regulations-gov

## Installation

### Download code and install dependencies

```sh
$ git clone git@github.com:coforma/co-regulations-gov.git
$ cd co-regulations-gov
$ npm install
```

### API KEY

1. Go to https://open.gsa.gov/api/regulationsgov/ and request an API KEY. The API KEY should arrive by email within a few minutes.

2. Make a copy of `./.env-example` as `/.env` and add your API KEY.

## Web Application Usage

You'll need the parent Document ID which may be obtained by navigating to that particular Document on regulations.gov.

Then, in the project folder, run:

```sh
$ npm start
```

You can now use the interface at: http://localhost:3000/

Try `CMS-2021-0168-0001` to test.

**Note:** The script might take awhile to run, due to adherence to the API's rate limits.

## CLI

Running the following command:

```sh
$  npm run cli {DOCUMENT_ID}
```

Will output the results to `output.csv` and `output.json` in the project root.

### Limitations

Though the script does account for rate limits, it doesn't do so exhaustively. The API's current rate limit is 500 per hour. Consequently, if there are over ~475 comments, it will likely begin to fail at some point.

### Feedback

We welcome any/all feedback/comments, including the creation of Issues and/or Pull requests to this repository.

Please direct any non-code feedback to: https://coforma.io/connect/
