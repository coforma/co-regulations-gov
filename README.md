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

2. Create a file in the project folder called `.env`.
   The contents of that file should be:

```conf
API_KEY=DEMO_KEY
```

_Replace `DEMO_KEY` with the key you receive by email._

## Usage

You'll need the parent document ID by navigating there on regulations.gov.

Then, in project folder, run:

```sh
$ npm start:dev
```

You can now use the interface at: http://localhost:3000/

Try `CMS-2021-0147-0001` to test.

**Note:** The script might take awhile to run, due to adherence to the API's rate limits.

### Limitations

Though the script does account for rate limits, it doesn't do so exhaustively. The API's current rate limit is 500 per hour. Consequently, if there are over ~475 comments, it will likely begin to fail at some point.
