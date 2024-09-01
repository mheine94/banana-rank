# Welcome banana rank 🍌

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

## App functionality
This app is a ranking leaderboard. The User with the most bananas wins.

### Search

You can search the banana ranking by typing a user name an hit search.

The App will display a leaderboard and highlight the searched user.
If the user is outside of the top or bottom 10 then he will be displayed at the bottom or top of the list.

In case you dont know any username you can search without typing anything in the search box.

You can cancel your search by touching the "x" in the search box.

### Options
There are two options that you can change Sorting and Top 10 or Bottom 10

##### Sorting 
By default the leaderboard gets sorted by rank, but there is another option.
Touch the "Sort by Name" button to sort the current results by their name.

##### Selection

By default the leaderboard shows the top 10 users, but you can switch to show the bottom 10 users by touching the 
"Top 10" Button.

### Bonus (Fuzzy Search)

You can fuzzy search for user names that contain a substring by prefixing your query with "~".

For example search for "~Chris" to find all users with names that contain "Chris".

If searching only "~" all users will be displayed. 

In that case there will be a pagination displayed on the bottom of the leader board.

### Copy name to clipboard

You can copy the name of a user to your clipboard by long-pressing the table row of the user.