----------------------
NOTES
----------------------
thoughts after reading the requirements:
1. thinking about using a react/angular deployment to meet responsive requirement however:
   1.1. react I have less experience/memory of working with as of recently (compared to angular).
   1.2. angular uses jQLite which is a lightweight version of jquery (so I plan to avoid it)
2. due to the case study only requesting simple tasks, I will be using a node.js server to act as the central hub and using handlebars for the main comic component.
3. will fetch data straight from the database provided by xkcd API
4. generic CSS colouring and changes will be made rather than using bootstrap

plan (core):
- create basic node.js server (launches first)
- access/import data from xkcd API ("backend database")
- found online existing api wrappers and CLI tools (require double checking afterwards)
- create handlebars to handle the html (express-handlebars - does not use jquery & cleans up code reusage for the HTML)
- manipulate data from there:
  - https://xkcd.com/info.0.json <- latest comic out
  - https://xkcd.com/#/info.0.json <- # comic
  - do a get for latest, take num, run until == latest [false = push and continue | true = push and exit] to grab all into data
- add CSS for basic colour design

plan (side):
  - include a separate count number (with a check)
  - keep a local variable thats there always (maybe written and saved onto a text file?)
  - add CSS for modularity/responsiveness
  - add random button (random # then navigate to random)

list of npm installs:
express
express-handlebars
cross-fetch (includes node-fetch) //alternative of xkcd-api  

----------------------
CHANGELOG - NOTE: progress is slow due to educational priorities
----------------------
25/10/2021: received email, establish plan on how to create, established notes + changelog page  
26/10/2021: delayed reply to email, requesting further information, establishing base code (awaiting response)  
27/10/2021: established base code (using own implementation via cross-fetch, may also include a more succinct version in comments using available apis online), ensuring functions are all working & ready for HTML implementation  
28/10/2021: completed majority of core functionalities ( display latest comic on home, display only 1 per page, next & prev button, display publish date, parsable by inputting # at the top, parse transcript to be readable), bonus functionalities added (random button). Hosted project onto heroku, majority of work completed

----------------------  
Things left to do:  
----------------------  
core: CSS & HTML adjustments
bonus: responsive, counter (possibly a read/write from local file, would have liked to consider implementing it in the database object if possible)
