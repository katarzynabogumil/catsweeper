# CATSWEEPER
## CS50 Final Project


#### About
Catsweeper is a take on a minesweeper game, where instead of mines the player is trying to avoid cats. *POV: You're allergic to cats. If you touch a cat, you'll die.*


#### Description
The game is written in mostly JavaScript and hosted on a static website, using HTML 5, CSS, JavaScript and a few Bootstrap elements, such as navigation bar and modals.


#### Deployment
This is a static webpage with pure JS code. There are no prerequisites for local deployment - simply check out this repository and open index.html in your browser of choice.


#### Files
* Main webpage: index.html
* CSS: static/styles.css
* JavaScript: catsweeper.js
* Several graphic files, such as cats, cursor and flag icons, as well as minesweeper-styled numbers.


#### Goal
The game is a final part of [Harvard's CS50x course](https://cs50.harvard.edu/x/2022/) and my first project after 1,5 months of learning programming from scratch. My goal was to improve my JavaScript skills, as this topic hasn't been explored deeply during the course. In order to include more algorithms I chose to make a game of minesweeper. Sticking to static JavaScript only, I gave up the database connection possibility for interaction with local storage. It was an additional challange, as we have already practised some database interaction in Flask in the problem sets during the course.


#### Features
Main webpage allows to start a new game anytime the player clicks on a chosen difficulty level. Only then the board shows up on a screen. The game copies all minesweeper funcionalities, including:
* left click to reveal a tile, if the tile is empty - opening additional tiles automaically,
* right click to flag a tile (for mobile users there are also two buttons available to chose either a flag mode or a tile checking mode),
* double click on an open tile to check the neighbouring tiles (only if all the cats nearby are flagged already),
* ensuring that the first click on a board is always safe,
* displaying the number of yet unflagged cat tiles,
* displaying the game time in seconds.

Apart from these there are two additional subpages (opening as modals, pausing the game during that time): *rules* with the game basics, and *highscores* showing best scores (as game time and level) the player had during the current session. They are added and sorted automatically after the player has won.