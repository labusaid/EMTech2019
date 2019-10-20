const util = require('util');
const exec = util.promisify(require('child_process').exec);

const fs = require('fs');
const tweetsDir = './tweets/';
const tonesDir = './tones/';

var express = require('express');
var app = express();
var port = 3001;

var cors = require('cors')

var locations = ['oklahomacity', 'losangeles'];

const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  authenticator: new IamAuthenticator({
    apikey: 'v_4x0FNnbkPfLhcuV-qa6zAjZP3pW-VYShUmjFfFwREi',
  }),
  url: 'https://gateway.watsonplatform.net/tone-analyzer/api',
});

app.options('*', cors()) // include before other routes 
app.use(cors())

app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If 
});

async function getTweets(keyword, limit) {
  if(!limit){
    limit = 80;
  }
  console.log('getting tweets with keyword: ' + keyword);
  var cityData = [];

  for(var city in locations){
    console.log('Getting tweets for keyword: '+ keyword + ' from city: ' + locations[city]);
    await getTweetsFromLocation(keyword, locations[city], limit).then((data) => {
      cityData.push({
        location: locations[city],
        tweets: JSON.parse(data)
      });
      console.log(' city data added to array');
    });
  }

  return cityData;
}

async function getTweetsFromLocation(keyword, location, limit){
  var fileName = location +'-tweets.json';
  var currentDir = tweetsDir + keyword + '/';
  if(!fs.existsSync(currentDir + fileName)){
    if(!fs.existsSync(currentDir)){
      fs.mkdirSync(currentDir);
    }
    const { stdout, stderr } = await exec('twitterscraper "' + keyword +' near:' + location + ' within:30mi" -l ' + limit + ' -bd 2019-10-19 -ed 2019-10-20 -o=' + currentDir + fileName);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  }
  try {
    var data = fs.readFileSync(currentDir + fileName, 'utf8');
    //console.log(data);
    return data;
  } catch(e) {
      console.log('Error:', e.stack);
  }
}


// must send a 'keyword' parameter
app.get('/gettweets', (req, res) => {
  console.log('request received');
  if(!req.query.keyword){
    res.send('request failed, no keyword parameter');
    return;
  }
  getTweets(req.query.keyword).then((tweetData)=> {
    console.log('final data: ' + JSON.stringify(tweetData));
    var currentDir = tweetsDir + req.query.keyword + '/';
    fs.writeFileSync(currentDir + req.query.keyword + '-final.json', JSON.stringify(tweetData));
    res.end('success');
    // res.end(JSON.stringify(tweetData));
    // getToneOfTweets();
  }).catch(err => {
    console.log(err);
  });
});

function getTweetsPath(keyword, location){
 return tweetsDir + keyword + '/' + location + '-tweets.json';
}

async function getToneOfTweetsAtLocation(keyword, location){
  if(!fs.existsSync(getTweetsPath(keyword, location))){
    console.log("cannot process tone, tweets file doesnt exist");
    return;
  }
  var data = fs.readFileSync(getTweetsPath(keyword, location));
  var toneTweets = [];

  for(var tweet in JSON.parse(data)){
    var currentTweet = JSON.parse(data)[tweet];

    console.log('text to process: ' + currentTweet.text);

    const toneParams = {
      toneInput: { 'text': currentTweet.text },
      contentType: 'application/json',
    };
  
    await toneAnalyzer.tone(toneParams)
    .then(toneAnalysis => {
      var validation = validateTweetTone(toneAnalysis);
      if(validation != false){
        var finalTweetObj = getFinalToneTweetObj(validation, currentTweet);
        console.log(JSON.stringify(finalTweetObj));
        toneTweets.push(finalTweetObj);
      }
    })
    .catch(err => {
      console.log('error:', err);
    });;
  }

  fs.writeFileSync(tonesDir + location + '-' + keyword + '.json', JSON.stringify(toneTweets));
}

app.get('/getaveragetone', (req, res) => {
  if(!req.query.location){
    res.send('request failed, must provided location paramater');
    return;
  }
  else if(!req.query.keyword){
    res.send('request failed, must provided keyword paramater');
    return;
  }

  var tweetsData = fs.readFileSync(tonesDir + req.query.location + '-' + req.query.keyword + '.json');
  var positiveValues = 0;
  var positiveCount = 0;
  var negativeValues = 0;
  var negativeCount = 0;
  for(var tweet in JSON.parse(tweetsData)){
    var tweetData = JSON.parse(tweetsData)[tweet];
    if(tweetData.tone == true){
      positiveCount++;
      positiveValues += tweetData.tone_value;
    }else{
      negativeCount++;
      negativeValues += tweetData.tone_value;
    }
  }

  res.end(JSON.stringify({
    keyword: req.query.keyword,
    location: req.query.location,
    positive_count: positiveCount,
    negative_count: negativeCount,
    positive_average: positiveValues / positiveCount,
    negative_average: negativeValues / negativeCount
  }));
});

function getFinalToneTweetObj(tweetToneObj, tweetObj){
  return {
    tweeter: tweetObj.username,
    text: tweetObj.text,
    tweet_date: tweetObj.timestamp,
    tone: tweetToneObj.positive,
    tone_value: tweetToneObj.score
  };
}

function validateTweetTone(analysis){
  var tones = analysis.result.document_tone.tones;
  for(var tone in tones){
    if(tones[tone].tone_id == 'anger'){
      return {
        positive: false,
        score: tones[tone].score
      };
    }
    else if(tones[tone].tone_id == 'sadness'){
      return {
        positive: false,
        score: tones[tone].score
      };
    }
    else if(tones[tone].tone_id == 'joy'){
      return {
        positive: true,
        score: tones[tone].score
      };
    }
  }
  return false;
}

app.get('/gettweettone', (req, res) =>{
  console.log('getting tone for keyword: ' + req.query.keyword);
  if(req.query.location) //if location parameter is provided, only process for that location
  {
    console.log('getting tone at: ' + req.query.location);
    getToneOfTweetsAtLocation(req.query.keyword, req.query.location);
  }
  else{
    for(var city in locations){ //if no location parameter is provided, process for all locations
      console.log('getting tone at: ' + locations[city]);
      getToneOfTweetsAtLocation(req.query.keyword, locations[city]);
    }
  }

  res.end('success');
});


app.listen(port, () => console.log(`HateMap app listening on port ${port}!`));
