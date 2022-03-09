/**
 * Handles all core logic for the game.
 *
 * @link       https://mickeyuk.github.io
 * @since      1.0.0
 */
function game() { }

/**
 * Game default settings
 */
game.default = {
    lang: "en",                     // Language
    currency: "USD",                // Currency
    currencySymbol: "$",            // Currency symbol
    darkMode: true,                 // Dark mode
    notificationDelay: 2000,        // Money notification delay
    sound: true,                    // Sound effects
    minBet: 0.1,                    // Minimum bet
    maxBet: 50,                     // Maximum bet
    betIncrement: 0.1,              // Bet increment
    canDebt: true,                  // Can player be in debt?
    validate: true,                 // Validate transactions?
    validateUrl: 'process.php',     // Process URL
    validateOnUpdate: true,         // Validate on personal best?
    token: '',                      // CSRF token
    serverSeed: '',                 // Seed for randomness
    userId: ''                      // User ID for validation
}

/**
 * Game settings.
 */
game.config = { ...game.default };

/**
 * Player properties
 */
game.player = {
    id: '',
    balance: 1000,
    wins: 0,
    balance_best: 1000,
}

/**
 * A log of all transactions during play.
 */
game.log = [];

// -----------------------------------------------------------------------------
//#region INITIALIZATION

/**
 * Game localization
 */
game.lang = null;

/**
 * Random seed.
 */
game.seed = null;

/**
 * Get a random sequential number.
 */
game.random = null;

/**
 * For formatting currency.
 */
game.formatter = null;

/**
 * Pause before validating user input.
 */
game.inputDelay = null;

/**
 * The player's bet.
 */
game.bet = game.config.minBet.toFixed(2);

/**
 * The pot total.
 */
game.pot = 0;

/**
 * The game UI canvas.
 */
game.drawFrame = null;

/**
 * Scores
 */
game.scoreSheet = [[],[],[]];

/**
 * Initialize the game.
 * 
 * @param {string} container    The game container.
 * @param {object} options      The game options.
 */
game.Init = function (container, options = null) {

    // Set options
    if (options != null) {
        game.config = { ...game.config, ...options };
    }

    // Fetch language file
    fetch(`lang/${game.config.lang}.json`)
        .then((res) => res.json())
        .then((translation) => {

            // Set language
            game.lang = translation;

            // Initialize seed
            game.SetupSeed();
    
            // Initialize interface
            game.gameContainer = document.querySelector(container);
            gUI.Init(game.gameContainer);

            // Setup currency
            game.SetupCurrency();

            // Initialize sound effects
            game.InitSounds();

            // Plinko
            game.InitPlinko();

            // Login form
            if (game.config.validate) {

                // No user ID set
                if (game.config.userId == '') {

                    var form = document.createElement('form');

                    // User ID
                    game.userEl = gUI.Input('text', game._('form.user_id'), null, '');
                    game.userEl.querySelector('input').setAttribute('required', '');
                    form.appendChild(game.userEl);

                    // Play for a prize?
                    gUI.ShowModal(game._('modal.login.title'), game._('modal.login.content'), [
                        gUI.BtnSecondary('No Thanks', () => {
                            gUI.HideModal();
                        }),
                        gUI.BtnPrimary('Submit', () => {
                            form.reportValidity();
                            if (form.checkValidity()) {
                                game.player.id = game.userEl.querySelector('input').value;
                                gUI.HideModal();
                            }
                        })
                    ])

                    // Form
                    form.setAttribute('method', 'get');
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                    });
                    gUI.modalContent.appendChild(form);

                } else {

                    // User ID has been set
                    game.player.id = game.config.userId;

                }

            }

        })
        .catch(() => {
            console.error(`Could not load ${game.config.lang}.json.`);
        });

}

/**
 * Il8n language support.
 * 
 * @param {string} path    The JSON path.
 */
game._ = function(path) {

    var keys = path.split(".");
    var text = keys.reduce((obj, i) => obj[i], game.lang);

    return text;

}

/**
 * Sets up the seed for the random number generator.
 */
game.SetupSeed = function () {

    // Create seed for randomness
    if (game.config.serverSeed == '') {
        var seed = gHelper.xmur3(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    } else {
        var seed = gHelper.xmur3(game.config.serverSeed);
    }
    game.random = gHelper.sfc32(seed(), seed(), seed(), seed());
    game.random = gHelper.mulberry32(seed());

}

/**
 * Sets up the currency used in the game.
 */
game.SetupCurrency = function () {

    game.formatter = new Intl.NumberFormat(game.config.currency, {
        style: "currency",
        currency: game.config.currency
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

}

//#endregion
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
//#region MONEY

/**
 * This validates a player's bet
 * 
 * @param {mixed} val   The bet amount.
 */
game.SetBet = function (val) {

    // Limit bet to min/max
    val = gHelper.Clamp(val, game.config.minBet, game.config.maxBet);
    
    // Submitted bet
    var bet = gHelper.Clamp(parseFloat(val), game.config.minBet, game.player.balance).toFixed(2);

    // Convert to currency format
    gUI.betInput.querySelector('input').value = bet;

    // Allow bet
    game.bet = bet;
    gUI.betBottom.classList.remove('disabled');

}

/**
 * Takes bet from player balance and adds to pot, 
 * then starts game.
 */
game.MakeBet = function () {

    // Subtract bet from player balance
    game.Charge(game.bet);

    // Add bet to pot
    game.pot += game.bet;
    //gUI.pot.innerText = game.formatter.format(game.pot);

    // Reset input
    //gUI.betInput.querySelector('input').value = game.config.minBet.toFixed(2);

    // Disable bet form
    gUI.betTop.classList.add('disabled');
    gUI.betCenter.classList.add('disabled');
    gUI.betBottom.classList.add('disabled');

}

/**
 * Pay the player.
 * 
 * @param {number} amount   The amount to pay the player.
 */
game.Pay = function (amount) {

    // Take money from player balance
    game.player.balance += amount;
    game.log.push(game.player.balance);

    // Update Appbar balance
    gUI.balance.innerText = game.config.currencySymbol + game.player.balance.toFixed(2);

    // Create notification
    gUI.CheckoutNotification(amount, 'plus');

}

/**
 * Charge the player.
 * 
 * @param {number} amount   The amount to charge the player.
 */
game.Charge = function (amount) {

    // Take money from player balance
    game.player.balance -= amount;
    game.log.push(game.player.balance);

    // Update Appbar balance
    gUI.balance.innerText = game.config.currencySymbol + game.player.balance.toFixed(2);

    // Create notification
    gUI.CheckoutNotification(amount, 'minus');

}

/**
 * Player takes their winnings.
 */
game.Cashout = function () {

    // Validation enabled?
    if (game.config.validate) {

        // Player scored a new personal best?
        if (!game.config.validateOnUpdate ||
            (game.player.balance > game.player.balance_best)) {
            
            // Record new best
            game.player.balance_best = game.player.balance;

            // Name and wallet set?
            if (game.player.playerName != '' && game.player.wallet != '') {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", game.config.validateUrl, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    id: game.player.id,
                    balance: game.player.balance,
                    transactions: game.log,
                    token: game.config.token
                }));
                xhr.onload = function () {
                    console.log("Leaderboard updated!");
                    console.log(xhr.responseText);
                    //console.log(this.responseText);
                }
            }

        }

    }

    // Clear log
    game.log = [];

}

//#endregion
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
//#region AUDIO

/**
 * Stores all the loaded audio files.
 */
game.sounds = {};
 
/**
 * Adds all the game sounds.
 */
game.InitSounds = function () {
    
    game.sounds.select = 'audio/select.mp3';
    game.sounds.win = 'audio/win.wav';
    game.sounds.whoosh = 'audio/whoosh.mp3';
    game.sounds.popup = 'audio/popup.mp3';
    game.sounds.money = 'audio/money.mp3';

}

/**
 * Plays a sound.
 * 
 * @param {Audio} sound    The audio to play.
 */
game.PlaySound = function (sound) {

    // Play sound
    if (game.config.sound) {
        var audio = new Audio(sound);
        audio.play();
        audio.remove();
    }

}
 
 //#endregion
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
//#region PLINKO

/**
 * Number of pin rows.
 */
game.pinCount = 16;

/**
 * Array of all the board pins.
 */
game.pins = [];

/**
 * Array of all the balls.
 */
game.balls = [];

/**
 * Array of all the win zones.
 */
game.winZones = [];

/**
 * All the UI win zone elements for drawing to canvas.
 */
game.uiZones = [[], [], []];

/**
 * Is player currently autobetting?
 */
game.autoBetting = false;

/**
 * For autobetting
 */
game.interval = null;

/**
 * The value of the colour types
 */
game.typeValues = [0.5, 0.28, 0.12];

/**
 * Initializes everything for the Plinko game.
 */
game.InitPlinko = function () {

    // Initialize Matter.JS
    game.InitMatter();

    // Move balls where they need to be
    game.MoveBalls();

    // Setup Plinko board
    game.SetupBoard(game.pinCount);

    // Initialize collisions
    game.InitCollisions();

};

/**
 * Initializes Matter.JS.
 */
game.InitMatter = function () {

    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite;
    
    // Plugins
    Matter.use('matter-attractors');

    // Dimensions
    game.width = gUI.gameFrame.clientHeight;
    game.height = gUI.gameFrame.clientHeight;
    game.cx = game.width / 2;
    game.cy = game.height / 2;

    // Create an engine
    game.engine = Matter.Engine.create({
        enableSleeping: false,
        positionIterations: 12,
    });
    //game.engine.gravity.y = 0.35;
    game.engine.gravity.y = game.height / 1500;
    console.log(game.engine.gravity.y);

    // Create a renderer
    game.render = Render.create({
        element: gUI.gameFrame,
        engine: game.engine,
        options: {
            width: game.width,
            height: game.height,
            wireframes: false
        }
    });

    /*
    window.addEventListener('resize', () => { 
        game.render.bounds.max.x = gUI.gameFrame.clientWidth;
        game.render.bounds.max.y = gUI.gameFrame.clientHeight;
        game.render.options.width = gUI.gameFrame.clientWidth;
        game.render.options.height = gUI.gameFrame.clientHeight;
        game.render.canvas.width = gUI.gameFrame.clientWidth;
        game.render.canvas.height = gUI.gameFrame.clientHeight;
    });
    */

    // Run the renderer
    Render.run(game.render);

    // Create runner
    game.runner = Runner.create();

    // Run the engine
    Runner.run(game.runner, game.engine);

    // Create canvas for UI
    game.uiCanvas = document.createElement('canvas');
    game.uiCanvas.id = "g-ui-canvas";
    game.uiCanvas.width = game.width;
    game.uiCanvas.height = game.height;
    
    gUI.gameFrame.appendChild(game.uiCanvas);

}

/**
 * Handles all the collision events.
 */
game.InitCollisions = function() {

    // Matter.js collision event
    Matter.Events.on(game.engine, "collisionStart", function(event) {

        // Get all pairs
        var pairs = event.pairs;

        // If ball enters the win zone
        if (pairs[0].bodyA.label == 'zone' && pairs[0].bodyB.label == 'ball') {
            game.BallWin(pairs[0].bodyA, pairs[0].bodyB);
        } else
        if (pairs[0].bodyA.label == 'ball' && pairs[0].bodyB.label == 'zone') {
            game.BallWin(pairs[0].bodyB, pairs[0].bodyA);
        }

    });

}

/**
 * Sets up the Plinko board.
 */
game.SetupBoard = function (n) {

    // Clear existing pins
    game.pins.forEach(function (pin) {

        // Remove pin from world
        Matter.World.remove(game.engine.world, pin);

    });

    // Clear existing zones
    game.winZones.forEach(function (zone) {

        // Remove zone from world
        Matter.World.remove(game.engine.world, zone);

    });
    
    // Reset
    game.pins = [];
    game.winZones = [];
    game.uiZones = [[], [], []];
    game.pinCount = n;
    game.odds = [];
    if (game.drawFrame) window.cancelAnimationFrame(game.drawFrame);

    // Set odds
    game.odds = game.CalculateOdds(n);

    // Toggle buttons
    switch (n) {

        case 14:
            gUI.btn12.classList = 'g-btn-default g-btn-primary';
            gUI.btn14.classList = 'g-btn-default g-btn-secondary';
            gUI.btn16.classList = 'g-btn-default g-btn-secondary';
            break;
     
        case 16:
            gUI.btn12.classList = 'g-btn-default g-btn-secondary';
            gUI.btn14.classList = 'g-btn-default g-btn-primary';
            gUI.btn16.classList = 'g-btn-default g-btn-secondary';
            break;
        
        case 18:
            gUI.btn12.classList = 'g-btn-default g-btn-secondary';
            gUI.btn14.classList = 'g-btn-default g-btn-secondary';
            gUI.btn16.classList = 'g-btn-default g-btn-primary';
        break;

    }

    var xspace = (game.width / n) / 1.1;
    var yspace = (game.height / n) / 1.1;
    var x = game.cx - xspace;
    var y = game.height / 24;

    // Pin loop
    var i, j;
    for (i = 3; i <= n; i++) {
        for (j = 0; j < i; j++) {
            game.CreatePin(x, y, (game.width / n) / 8);
            x += xspace;
        }
        x = x - (i * xspace) - (xspace / 2);
        y += yspace;
    }

    // Walls
    var wall = Matter.Bodies.rectangle(xspace/1.5, game.cy, xspace, game.height,
        { isStatic: true, render: { fillStyle: "transparent" }
    });
    Matter.Composite.add(game.engine.world, wall);

    var wall = Matter.Bodies.rectangle(game.width - (xspace / 1.5), game.cy, xspace, game.height,
        { isStatic: true, render: { fillStyle: "transparent" }
    });
    Matter.Composite.add(game.engine.world, wall);

    // Set colours
    game.ToggleDarkMode();

    // Win zones
    game.SetupWinZones(n, x, y, xspace, yspace);

}

/**
 * Sets up the win zones.
 * 
 * @param {number} n        Number of pins. 
 * @param {number} x        X position. 
 * @param {number} y        Y position. 
 * @param {number} xspace   X spacing. 
 * @param {number} yspace   Y spacing. 
 */
game.SetupWinZones = function (n, x, y, xspace, yspace) {

    var width = (game.width / n) / 1.2;

    var ctx = game.uiCanvas.getContext('2d');
    ctx.font = width / 2 + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';

    // Starting position
    x += xspace;
    y -= 4;
    var xx = x;
    for (var i = 0; i < 3; i++) {

        for (var j = 0; j < game.pinCount-1; j++) {

            var options = {
                isStatic: true,
                isSensor: true,
                render: {
                    fillStyle: "transparent",
                }
            };

            // Create a new body 
            var zone = Matter.Bodies.rectangle(x, y, width, width, options);
            zone.label = 'zone';
            zone.index = j;
            game.winZones.push(zone);

            // Add to scene
            Matter.Composite.add(game.engine.world, zone);
            game.odds[i][j].x = x;
            game.odds[i][j].y = y;

            // Draw win zone on UI
            game.uiZones[i].push({
                x: x,
                y: y,
                width: width,
                height: width,
                start_x: x,
                start_y: y,
                min_size: width,
                max_size: width + (width / 10),
                valueType: i,
                index: j,
                bg: game.TypeColor(i),
                color1: '#000',
                color2: '#FFF',
                opacity: 0,
                steps: 120,
                step: 0,
                hit: false,
            });

            x += xspace;

        }

        x = xx;
        y += yspace;

    }

    // Draw UI
    game.drawFrame = window.requestAnimationFrame(game.DrawUI);

}

/**
 * Draws all the UI win zones.
 */
game.DrawUI = function () {

    var ctx = game.uiCanvas.getContext('2d');
    ctx.font = ((game.width / game.pinCount) / 1.2) / 2 + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    ctx.clearRect(0, 0, game.width, game.height);

    // Draw win zones
    var multi = 0;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < game.pinCount-1; j++) {

            // Zone object
            var zone = game.uiZones[i][j];

            // Grow on zone hit
            if (zone.hit) {
                if (zone.width < zone.max_size) {
                    zone.width += (zone.max_size - zone.min_size) / 30;
                    zone.height += (zone.max_size - zone.min_size) / 30;
                } else {
                    zone.hit = false;
                }
            } else {
                if (zone.width > zone.min_size) {
                    zone.width -= (zone.max_size - zone.min_size) / 30;
                    zone.height -= (zone.max_size - zone.min_size) / 30;
                }
            }

            ctx.globalAlpha = 1;
            ctx.fillStyle = zone.bg;
            ctx.roundRect(zone.x - (zone.width / 2), zone.y - (zone.width / 2), zone.width, zone.width, { upperLeft: 4, upperRight: 4, lowerLeft: 4, lowerRight: 4 }, true, false);

            ctx.fillStyle = "black";

            ctx.fillText(game.odds[i][j].value, zone.x, zone.y + 1);

        }

        // multi += 2;

    }

    // Update
    game.drawFrame = window.requestAnimationFrame(game.DrawUI);

}

/**
 * Handles all the collision events.
 */
game.MoveBalls = function () {
}

/**
 * Ball entered win zone.
 * 
 * @param {*} zone 
 * @param {*} ball 
 */
game.BallWin = function(zone, ball) {

    // Activate win zone
    game.uiZones[ball.valueType][zone.index].hit = true;

    // Sound effect
    game.PlaySound(game.sounds.win);

    // Calculate winnings
    var winnings = game.odds[ball.valueType][zone.index].value * game.bet;
    game.Pay(winnings);

    // Remove anchor
    Matter.World.remove(game.engine.world, ball.anchor);

    // Remove ball
    Matter.World.remove(game.engine.world, ball);
    game.balls.splice(game.balls.indexOf(ball), 1);

    // Check if all balls are gone
    if (game.balls.length == 0) {

        // Enable board type setting
        gUI.betPins.classList.remove('disabled');

        // Update leaderboard
        game.Cashout();

    }

}

/**
 * Calculate the odds of winning.
 * 
 * @param {number} n - Number of pins.
 */
game.CalculateOdds = function (n) {

    var pascals = gHelper.Pascals(n - 1);
    var pascalOdds = pascals[pascals.length - 1];

    var odds = [[], [], []];
    var multiplier = Math.round(pascalOdds.length / 2) - 1;
    
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < pascalOdds.length; j++) {

            var value;
            switch (i) {
                case 1:
                    value = (Math.abs(multiplier) > 3 ? 0.3 * (Math.abs(multiplier) * (i+1)) : 0.2 * Math.abs(multiplier));
                    break;
                case 2:
                    value = (Math.abs(multiplier) > 4 ? 0.2 * (Math.abs(multiplier) * (i+2)) : 0.2 * Math.abs(multiplier));
                    break;
                default:
                    value = 0.5 * Math.abs(multiplier);
                    break;
            }

            odds[i].push({
                rating: pascalOdds[j],
                x: 0,
                y: 0,
                multiplier: Math.abs(multiplier),
                value: value.toFixed(1).replace(/[.,]0$/, "")
            });
            multiplier--;
        }
        multiplier = Math.round(pascalOdds.length / 2) - 1;
    }

    return odds;

}

/**
 * Creates a pin on the board.
 * 
 * @param {number} x    The x position.
 * @param {number} y    The y position.
 * @param {number} r    The radius.
 */
game.CreatePin = function(x, y, r) {

    // Create a new body
    var pin = Matter.Bodies.circle(x, y, r, {
        isStatic: true,
        density: 1,
        restitution: 1,
        friction: 0,
        render: {
            fillStyle: (game.config.darkMode) ? '#fff' : '#000',
        }
    });
    game.pins.push(pin);

    // Add to scene
    Matter.Composite.add(game.engine.world, pin);

}

/**
 * Creates a plinko ball.
 * 
 * @param {number} type     Type/value of ball.
 */
game.CreateBall = function (type = 0) {

    // Odd lists
    var half = Math.ceil(game.odds[type].length / 2);
    var oddsList = [
        game.odds[type].slice(0, half),
        game.odds[type].slice(-half)
    ];

    // Left or right
    var n = Math.round(game.random());

    // Select random odds from array
    var randomMax = Math.max.apply(Math, oddsList[n].map(function (o) { return o.rating; }));
    randomVal = Math.round(game.random() * randomMax);

    var target = oddsList[n].reduce((acc, obj) =>
       Math.abs(randomVal - obj.rating) < Math.abs(randomVal - acc.rating) ? obj : acc
    );

    // Position
    var space = (game.width / game.pinCount) / 1.1;
    var x = (target.x < game.cx ? game.cx - (space / 2) : game.cx + (space / 2));
    var y = 0;
    
    // Radius
    var radius = (game.width / game.pinCount) / 5;

    // Create a new body
    var ball = Matter.Bodies.circle(x, y, radius, {
        isStatic: false,
        restitution: .5,
        friction: .1,
        frictionAir: .03,
        render: {
            fillStyle: game.TypeColor(type),
        }
    });
    ball.label = 'ball';
    game.balls.push(ball);
    ball.index = game.balls.length - 1;
    ball.valueType = type;

    // Create anchor
    var anchor = Matter.Bodies.circle(target.x, ball.position.y, 3, {
        isStatic: true,
        isSensor: true,
        render: {
            fillStyle: "transparent",
        },
        plugin: {
            attractors: [
                function () {

                    anchor.position.y = ball.position.y + space;
                    
                    var force = {
                        x: (anchor.position.x - ball.position.x) * 0.0000001,
                        y: (anchor.position.y - ball.position.y) * 0.0000001,
                    };
            
                    // apply force to both bodies
                    Matter.Body.applyForce(anchor, anchor.position, Matter.Vector.neg(force));
                    Matter.Body.applyForce(ball, ball.position, force);

                }
            ]
        }
    });
    ball.anchor = anchor;
    
    // Add to scene
    Matter.Composite.add(game.engine.world, [anchor, ball]);

    return ball;

}

/**
 * Set the color based on ball/bet type.
 * 
 * @param {number} type 
 * 
 * @returns {string}
 */
game.TypeColor = function(type) {

    switch (type) {
        case 0:
            return '#03A007';
        case 1:
            return '#FF9502';
        case 2:
            return '#D33B3B';
    }

}

/**
 * Starts a manual game.
 * 
 * @param {number} type     The bet type.
 */
game.StartManual = function (type) {

    // Disable board type options
    gUI.betPins.classList.add('disabled');

    // Sound effect
    game.PlaySound(game.sounds.money);

    // Set bet
    game.MakeBet();

    // Create ball
    game.CreateBall(type);

    // Short delay before can bet again
    setTimeout(function () {
        if (game.config.canDebt || game.player.balance >= game.config.minBet) {
            game.SetBet(parseFloat(gUI.betInput.querySelector('input').value).toFixed(2));
            gUI.betTop.classList.remove('disabled');
            gUI.betCenter.classList.remove('disabled');
            gUI.betBottom.classList.remove('disabled');
        }
    }, 2000);

}

/**
 * Starts a auto betting game.
 */
game.StartAuto = function () {

    // Disable board type options
    gUI.betPins.classList.add('disabled');

    // Sound effect
    game.PlaySound(game.sounds.money);

    // Autobetting
    game.autoBetting = true;

    // Show stop button
    gUI.autobetButton.innerHTML = 'Stop';
    gUI.betBottom.classList.remove('disabled');
    gUI.autobetButton.onclick = {};
    gUI.autobetButton.addEventListener('click', function () {
        game.autobetting = false;
        gUI.betBottom.classList.add('disabled');
        if (game.config.canDebt || game.player.balance >= game.config.minBet) {
            if (game.interval) clearInterval(game.interval);
            game.SetBet(parseFloat(gUI.betInput.querySelector('input').value).toFixed(2));
            gUI.betTop.classList.remove('disabled');
            gUI.betCenter.classList.remove('disabled');
            gUI.betBottom.classList.remove('disabled');
            gUI.AutoButtons();
        }
    });

    game.interval = setInterval(function () {
        
        if (document.hasFocus()) {
            game.MakeBet();
            gUI.betBottom.classList.remove('disabled');
            //var x = gHelper.RandomRange(game.cx - (2/game.pinCount), game.cx + (2/game.pinCount));
            game.CreateBall(Math.round(gHelper.RandomRange(0, 2)));
        }

    }, 2000);

}

/**
 * Modify game mode based on colour scheme.
 */
game.ToggleDarkMode = function() {

    // Update pins
    for (let i = 0; i < game.pins.length; i++) {
        game.pins[i].render.fillStyle = (game.config.darkMode) ? '#fff' : '#757575';
    }

}

//#endregion
// -----------------------------------------------------------------------------
