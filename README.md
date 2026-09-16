# myGames
A website where users can find video games, save/add to their collections, write reviews for others to read, and randomly pick a game.

## 🚀 Specification Deliverable

### Elevator pitch

Want to a single place where you can store your games and easily see other's reviews? Well myGames allows you to search video games, save them, write reviews, and read what others think about a game. Search other profiles to see what other video games people have saved. 

### Key features

- Login over HTTPS
- Search engine that holds a gaming API (https://rawg.io/apidocs or https://api-docs.igdb.com/#getting-started)
- Have search to show game name, picture (if it holds it) and description
- Ability to store video games.
- People who create accounts can see other account names, games saved, and reviews.
- Save games and reviews using name and email
- Randomizer to find random games

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Four HTML pages. Use hyperlinks to move between them. One for the main page with search. Another the randomizer. Another to view other users. Lastly, one to create/login and see your account.
- **CSS** - Style each page that can be used on different sceens. Uses good styling to look like a game app.
- **React** - Provides login, use points, and save taps as points.
- **Service** - Used for backend such as login accounts, make taps/points functional, rank accourding to points, and adding/subracting points.
- **DB/Login** - Store usernames, points, rankings, and 'skin' images. Accounts saved so people can save their points. 
- **WebSocket** - Every tap is saved and automatically applies to ranking for other users to see. 
