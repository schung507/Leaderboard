const fs = require('fs');
const csv = require('fast-csv');

/**
 * @function  [loadFile]
 * 
 * Create object from csv of format:
 * {
 *   "<date>" : [ {"app": <app>, "downloads": <number>}]
 * } 
 * and write to files to store as data
 */
const loadFile = (file) => {
    var json = {};
    var stream = fs.createReadStream(file);
    stream.on("error", function() { 
        console.error("No such file") });
    csv
        .fromStream(stream, {headers : true})
        .on("data", function(data){
            
            var appName = data.AppName;
            for(var key in data){
                if (key != 'AppName') {
                    if (!(key in json)) json[key] = [];
                    var obj = {};
                    obj['app'] = appName;
                    obj['downloads'] = parseInt(data[key]);
                    json[key].push(obj);
                }
            }
           
        })
        .on("end", function(){
            checkDirectorySync("./db"); 
            fs.writeFile("db/loads.json", JSON.stringify(json), 'utf8', function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            }); 
        });  
}

const getRecent = () => {
    if (checkForData()) {
        fs.readFile('db/loads.json', 'utf8', function (err, data) {
            if (err) {
                console.error("Error reading file", err);
            }
            var json = JSON.parse(data);
            var recent = Object.keys(json).pop();
            getTopTen(recent, json);
        
        });
    }
   
};

const getLeaderboard = (date) => {
    if (checkForData()) {
        fs.readFile('db/loads.json', 'utf8', function (err, data) {
            if (err) {
                console.error("Error reading file", err);
            }
            
            var json = JSON.parse(data);
            getTopTen(date, json);
        });
    }
}

/**
 * @function  [getTopTen]
 * 
 * Helper function that logs top ten apps for given date
 */
const getTopTen = (date, json) => {
    
        if (!(date in json)) {
            console.log('No data for ' + date);
        } else {
            var leaderboard = [];
            for (app in json[date]) {
                leaderboard.push(json[date][app]);
            }
            leaderboard.sort(function(a, b){return b.downloads-a.downloads});
            for (var i = 0; i < 10; ++i) {
                var rank = i + 1;
                console.log(rank + ". " + leaderboard[i]['app'] + " .....loads: " + leaderboard[i]['downloads']);
            }
        } 
}

/**
 * @function  [searchRange]
 * 
 * Finds cumulative leader given a date and a range
 */
const searchRange = (date, range) => {
    
    if (checkForData()) {

        fs.readFile('db/loads.json', 'utf8', function (err, data) {
            if (err) {
                console.error("Error reading file", err);
            }
            
            var json = JSON.parse(data);
            if (!(date in json)) {
                console.log( "Data for " + date + " not in records")
            } else {
                var dates = Object.keys(json);
                dates.sort();
                var started = false;
                var counter = 0;
                var map = {};
                var max = 0;
                var leader = "";
                for (var d in dates) {
                    var dd = dates[d];
                    if (counter == range) break;
                    else if (started) {
                        for (var app in json[dd]) {
                            var appName = json[dd][app].app;
                            map[appName] = map[appName] + json[dd][app].downloads;
                            if (counter+1 == range && map[appName] > max) {
                                max = map[appName];
                                leader = appName;
                            }
                        }
                        counter++;
                    } else if (dd == date) {
                        started = true;
                        for (var app in json[dd]) {
                            var appName = json[dd][app].app;
                            map[appName] = json[dd][app].downloads;
                        }
                        counter++;
                    }
                    
                }
                if (counter < range) {
                    console.log("Not enough data to cover range");
                } else {
                    console.log("Date: " + date);
                    console.log("Range: " + range + " days");
                    console.log("Leader: " + leader);
                    console.log("Downloads: " + map[leader]);
                }
            }

        });
    }
}

/*Check that data exists*/
const checkForData = () => {
    if (!fs.existsSync('db/loads.json')) { 
        console.log("No data yet. Please load csv file first with 'leaderboard ld'");
        return false;
    } 
    return true;
}

const checkDirectorySync = (directory) => {  
  try {
    fs.statSync(directory);
  } catch(e) {
    fs.mkdirSync(directory);
  }
}

module.exports = {
    loadFile, 
    getRecent, 
    getLeaderboard,
    searchRange
};
