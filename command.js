#!/usr/bin/env node

const { prompt } = require('inquirer'); 
const program = require('commander');
const app = require('./logic');

// Craft questions to present to users
const questions = [
    {
        type : 'input',
        name : 'file',
        message : 'Enter csv file/path ...'
    },
    {
        type : 'input',
        name : 'date',
        message : 'Enter date of desired leaderboard (format: yyyy/mm/dd) ...'
    }];

const rangeQuestions = [
    {
        type : 'input',
        name : 'date',
        message : 'Enter starting date (format: yyyy/mm/dd) ...'
    },
    {
        type : 'input',
        name : 'range',
        message : 'Enter range (in number of days) ...'
    }];     

program
    .version('0.0.1')
    .description('Leaderboard');

program
    .command('loadFile')
    .alias('ld')
    .description('Load csv file')
    .action(() => {
    prompt(questions[0]).then(answers => {
            var filename = answers.file;
            app.loadFile(filename);
        });
    });

program
    .command('todaysLeaderboard')
    .alias('a')
    .description('Get today\'s leaderboard based on most recent download number')
    .action(() => app.getRecent());

program
    .command('getLeaderboard')
    .alias('b')
    .description('Get leaderboard of given date')
    .action(() => {
        prompt(questions[1]).then(answers => {
            var date = answers.date;
            app.getLeaderboard(date);
        });
    });

program
    .command('searchRange')
    .alias('r')
    .description('Get leader for given range')
    .action(() => {
        prompt(rangeQuestions).then(answers => {
            var date = answers.date;
            var range = answers.range;
            app.searchRange(date, range);
        });
    });

program.parse(process.argv);