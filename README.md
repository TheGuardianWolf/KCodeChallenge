# KITOMBA Code Challenge

## Prerequisites

You will need nodejs LTS preferrably. Your system might need node-gyp to build
the test suite dependency.

## How to run

Make sure you have an up to date nodejs and then run:

```
git clone https://github.com/TheGuardianWolf/KCodeChallenge.git
cd KCodeChallenge
npm install
npm run test
```

## Additional Notes

Most of the notes are in the code files as comments.

The third problem had a malformed input. This has been fixed in the resources
file, so the input differs from what is written, but is correct according to the
description.

Original:

```
5 5
1 2 N LMLMLMLMM 3 3 E
MMRMMRMRRM
```

Fixed:

```
5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM
```
