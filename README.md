# App Leaderboard Take-home

## Setup

 1. `brew install npm`
 2. `brew install node`
 3. Extract zip file and go into directory
 4. `npm install`
 5. `npm link`

## Interface

To see interface on command line:
```
> leaderboard --help
```
Basic Commands:
```
> leaderboard ld //loads csv file
> leaderboard a //todays leaderboard
> leaderboard b //shows leaderboard given a date
```
Inputs will be prompted.

### Extra Feature

Search a range:
```
> leaderboard r
```
Will prompt user for date and range. Only supports range as a number (of days). Will return the leader based on the sum of app downloads within that range.