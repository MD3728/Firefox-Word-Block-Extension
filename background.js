//
//Basic Word Checking Program
//

// Basically, program gets all the information about a web page and checks if the word is on that webpage
// If it is, the extension will redirect you to google

// List with blocked words and phrases
let wordBlockList = [

  // Insert most recent words that need to be blocked
  // Format should be: ["word1", "word2"] etc.
  "Someword",
  "Some other word",
  "etc."

];


let unblockedTime = [[8,40,8,50]];//8:40 -> 8:50 (Not inclusive at end point but inclusive at starting point)
let canCurrentlyBlock = true;

function parseTime(){
  let currentTime = new Date(new Date().getTime()).toLocaleTimeString().split(":");
  let currentHour = parseInt(currentTime[0]);
  let currentMinute = parseInt(currentTime[1]);
  let currentSecond = parseInt(currentTime[2].slice(0,2));
  if (currentTime[2][3] === "P"){
    currentHour += 12;
  }
  // console.log("Current Hour: " + currentHour)
  // console.log("Current Time: " + currentTime);
  for (let unblockFrame of unblockedTime){
    if ((parseInt(currentHour) >= unblockFrame[0])&&(parseInt(currentHour) <= unblockFrame[2])
    &&(parseInt(currentMinute) >= unblockFrame[1])&&(parseInt(currentMinute) < unblockFrame[3])){
      return true; // Within Time Period
    }
  }
  return false; // Outside of Time Period
}

setInterval(parseTime, 2000);

browser.tabs.onActivated.addListener(() => {
  //console.log("onActivated Listener Running");
  if ((!parseTime())&&(canCurrentlyBlock === true)){
    browser.tabs.query({active: true, currentWindow: true}, function(tabs){
      //console.log(tabs);
      browser.tabs.sendMessage(tabs[0].id, {text: 'test'}, (response) => {
        let websiteData = response.toString().toLowerCase();
        for (let currentWord of wordBlockList){
          if (websiteData.includes(currentWord)){
            console.log(`Page Blocked Due To Word: ${currentWord}`);
            let updating = browser.tabs.update(tabs[0].id, {
              active: true,
              url: "https://www.google.com/"
            });
            canCurrentlyBlock = false;
            setTimeout(() => {canCurrentlyBlock = true;},800);
            break;
          }
        }
      });
    });
  }
});

browser.tabs.onUpdated.addListener(() => {
  //console.log("onUpdated Listener Running");
  if ((!parseTime())&&(canCurrentlyBlock === true)){
    browser.tabs.query({active: true, currentWindow: true}, function(tabs){
      //console.log(tabs[0].url);
      browser.tabs.sendMessage(tabs[0].id, {text: 'test'}, (response) => {
        let websiteData = response.toString().toLowerCase();
        for (let currentWord of wordBlockList){
          if (websiteData.includes(currentWord)){
            console.log(`Page Blocked Due To Word: ${currentWord}`);
            let updating = browser.tabs.update(tabs[0].id, {
              active: true,
              url: "https://www.google.com/"
            });
            canCurrentlyBlock = false;
            setTimeout(() => {canCurrentlyBlock = true;},800);
            break;
          }
        }
      });
    });
  }
});

