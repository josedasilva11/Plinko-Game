<!-- PROJECT LOGO -->
<br />

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li><a href="#embedding-the-game">Embedding the Game</a></li>
    <li><a href="#configuration">Configuration</a></li>
    <li><a href="#server-side-verification">Server Side Verification</a></li>
  </ol>
</details>


## About the Project

Embed a Plinko casino game on any page. Can be played just for fun, or for gambling with real funds.

## Embedding the Game

To embed the game on a page, simply link the scripts **game.js**, **matter.min.js** and **matter-attractors.js**, create a div container for the game and then call the function **game.Init()**, passing the ID of the container element as an argument.

```
<div id="game"></div>

<script src="js/vendor/matter.min.js"></script>
<script src="js/vendor/matter-attractors.js"></script>
<script src="js/game.js"></script>
<script>

    // Initialize game
    game.Init('#game');

</script>
```
Additional configuration options can be passed in an object parameter when initializing the game:

```
game.Init('#game', {
  darkMode: false,
  currencySymbol: "£",
});
```

## Configuration

Below is a list of all the available configuration options.

##### Localization
|Key|Value Type|Description|Default|
| ----------- | ----------- | ----------- | ----------- |
|lang|string| Set the game language. | "en"
|currency|string|The currency used in the game. | "USD"
|currencySymbol|string|The currency symbol to use. | "$"

##### Interface
|Key|Value Type|Description|Default|
| ----------- | ----------- | ----------- | ----------- |
|darkMode|boolean|Is the dark mode colour scheme enabled. | true
|notificationDelay|float|How long a notification stays on screen. | 2000
|sound|boolean|Whether sound is enabled. | true

##### Betting
|Key|Value Type|Description|Default|
| ----------- | ----------- | ----------- | ----------- |
|minBet|float|The minimum bet to play. | 0.1
|maxBet|float|The maximum bet to play. | 50
|betIncrement|float|The increment when the increase/decrease bet  buttons pressed. | 0.1
|canDebt|boolean|Can the player go in debt? | true

##### Server Side

|Key|Value Type|Description|Default|
| ----------- | ----------- | ----------- | ----------- |
|validate|boolean|This will send all transactions to the process url to be validated.|true
|validateOnUpdate|boolean|Transactions are only sent for validation when the player bests their previous score.|true
|validateUrl|string|The URL for processing transactions and logs.|process.php
|serverSeed|string|Server seed for the provably fair system.
|token|string|CSRF token|
|userId|mixed|This is some sort of user identifier for your backend. If validate is enabled and this has not been set, the user will be asked to enter an ID (or whatever is labelled as in the language file) or validation will be disabled.

## Server Side Verification

When the **validate** configuation option is enabled, the game will send all transaction data to the **validateUrl** specified in the configuration options. When the game is running client side, it is vulnerable to cheating. This is why when dealing with real money, transactions should be logged and processed server side.

When sending new transaction information, the game will send this data in JSON format:

|Key|Value Type|Description
| ----------- | ----------- | ----------- |
|id|mixed| The user ID.
|balance|float| The user's current balance.
|transactions|array|A list of all transactions made during play.
|token|mixed|The CSRF token specified in the configuation file.

