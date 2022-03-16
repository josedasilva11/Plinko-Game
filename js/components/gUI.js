/**
 * Handles all the UI stuff for the game.
 *
 * @link       https://mickeyuk.github.io
 * @since      1.0.0
 */
function gUI() { }

// -----------------------------------------------------------------------------
//#region INITIALIZATION

/**
 * Initializes the default app layout.
 * 
 * @param {HTMLElement} container       The app container.
 */
gUI.Init = function (container) {

    // Dark mode on default?
    if (game.config.darkMode) {
        game.gameContainer.classList.add('dark');
    } else {
        game.gameContainer.classList.remove('dark');
    }
    
    // Appbar and game container.
    gUI.appbar = gUI.Row('g-appbar');

    container.appendChild(gUI.appbar);

    gUI.appbarTitle = gUI.Col('g-appbar-title');
    gUI.appbar.appendChild(gUI.appbarTitle);

    gUI.appbarMenu = gUI.Col('g-appbar-menu');
    gUI.appbar.appendChild(gUI.appbarMenu);

    // Game container
    gUI.container = gUI.Row('g-game-container');

    container.appendChild(gUI.container);

    // Background
    gUI.background = gUI.Div('g-background');
    gUI.container.appendChild(gUI.background);
    gUI.background.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="1440" height="250" preserveAspectRatio="none" viewBox="0 0 1440 250"><g mask="url(&quot;#SvgjsMask1424&quot;)" fill="none"><rect width="1440" height="250" x="0" y="0" fill="rgba(254, 254, 255, 0)"></rect><path d="M42 250L292 0L610 0L360 250z" fill="url(#SvgjsLinearGradient1425)"></path><path d="M238.60000000000002 250L488.6 0L602.6 0L352.6 250z" fill="url(#SvgjsLinearGradient1425)"></path><path d="M496.20000000000005 250L746.2 0L840.7 0L590.7 250z" fill="url(#SvgjsLinearGradient1425)"></path><path d="M756.8000000000001 250L1006.8000000000001 0L1344.3000000000002 0L1094.3000000000002 250z" fill="url(#SvgjsLinearGradient1425)"></path><path d="M1438 250L1188 0L946.5 0L1196.5 250z" fill="url(#SvgjsLinearGradient1426)"></path><path d="M1199.4 250L949.4000000000001 0L796.4000000000001 0L1046.4 250z" fill="url(#SvgjsLinearGradient1426)"></path><path d="M943.8 250L693.8 0L390.79999999999995 0L640.8 250z" fill="url(#SvgjsLinearGradient1426)"></path><path d="M713.1999999999999 250L463.19999999999993 0L205.19999999999993 0L455.19999999999993 250z" fill="url(#SvgjsLinearGradient1426)"></path><path d="M1311.0099193826968 250L1440 121.00991938269689L1440 250z" fill="url(#SvgjsLinearGradient1425)"></path><path d="M0 250L128.9900806173031 250L 0 121.00991938269689z" fill="url(#SvgjsLinearGradient1426)"></path></g><defs><mask id="SvgjsMask1424"><rect width="1440" height="250" fill="#ffffff"></rect></mask><linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="SvgjsLinearGradient1425"><stop stop-color="rgba(41, 46, 57, 0.2)" offset="0"></stop><stop stop-opacity="0" stop-color="rgba(41, 46, 57, 0.2)" offset="0.66"></stop></linearGradient><linearGradient x1="100%" y1="100%" x2="0%" y2="0%" id="SvgjsLinearGradient1426"><stop stop-color="rgba(41, 46, 57, 0.2)" offset="0"></stop><stop stop-opacity="0" stop-color="rgba(41, 46, 57, 0.2)" offset="0.66"></stop></linearGradient></defs></svg>';

    // Game and bet frames
    gUI.gameFrame = gUI.Col('g-frame-game', ['g-frame']);
    gUI.betFrame = gUI.Col('g-frame-bet');

    gUI.container.appendChild(gUI.gameFrame);
    gUI.container.appendChild(gUI.betFrame);

    // Bet frame sections
    gUI.betTop = gUI.Div('g-bet-top', ['g-bet-container']);
    gUI.betCenter = gUI.Div('g-bet-center', ['g-bet-container']);
    gUI.betBottom = gUI.Div('g-bet-bottom', ['g-bet-container']);

    gUI.betFrame.appendChild(gUI.betTop);
    gUI.betFrame.appendChild(gUI.betCenter);
    gUI.betFrame.appendChild(gUI.betBottom);

    // Sidebar
    gUI.sidebar = gUI.Div('g-sidebar');
    gUI.container.appendChild(gUI.sidebar);

    // Sidebar menu
    gUI.sidebarMenu = document.createElement('div');
    gUI.sidebarMenu.id = 'g-sidebar-menu';
    gUI.sidebar.appendChild(gUI.sidebarMenu);

    // Initialize bet form
    gUI.InitAppBar();

    // Initialize sidebar
    gUI.InitSidebar();

    // Initialize bet form
    gUI.InitBetForm();

    // Initialize bet options
    gUI.InitBetButtons();

    // Initialize modals
    gUI.InitModal();

}

/**
 * Initializes the modal/dialog boxes.
 */
gUI.InitModal = function () {
    
    // Modal container
    gUI.modalContainer = gUI.Div('g-modal-container');
    game.gameContainer.appendChild(gUI.modalContainer);

    // Modal
    gUI.modal = gUI.Div('g-modal');
    gUI.modalContainer.appendChild(gUI.modal);

    // Modal header
    gUI.modalHeader = gUI.Div('g-modal-header');
    gUI.modal.appendChild(gUI.modalHeader);

    // Modal title
    gUI.modalTitle = gUI.Div('g-modal-title');
    gUI.modalHeader.appendChild(gUI.modalTitle);

    // Modal close
    gUI.modalClose = gUI.Div('g-modal-close');
    gUI.modalClose.innerHTML = gIcon.close;
    gUI.modalHeader.appendChild(gUI.modalClose);
    gUI.modalClose.onclick = gUI.HideModal;

    // Modal body
    gUI.modalBody = gUI.Div('g-modal-body-container');
    gUI.modal.appendChild(gUI.modalBody);

    // Content
    gUI.modalContent = gUI.Div('g-modal-content');
    gUI.modalBody.appendChild(gUI.modalContent);

    // Modal footer
    gUI.modalFooter = gUI.Div('g-modal-footer');
    gUI.modal.appendChild(gUI.modalFooter);

}

/**
 * Initializes appbar and appbar menu.
 */
gUI.InitAppBar = function () {

    // Money icon
    var icon = gUI.Div('g-appbar-money-icon');
    icon.innerHTML = gIcon.money;
    gUI.appbarTitle.appendChild(icon);

    // Money amount
    gUI.balance = gUI.Div('g-appbar-money');
    gUI.balance.innerHTML = game.config.currencySymbol + game.player.balance;
    gUI.appbarTitle.appendChild(gUI.balance);

    // Checkout Notifications
    gUI.appbarCheckout = gUI.Div('g-appbar-checkout');
    gUI.appbarTitle.appendChild(gUI.appbarCheckout);
    var fade = gUI.Div('g-appbar-checkout-fade');
    gUI.appbarCheckout.appendChild(fade);

    // --- OPTIONS ---

    // Dark Mode Toggle
    gUI.darkModeButton = gUI.Btn((game.config.darkMode ? gIcon.lightbulbOff : gIcon.lightbulbOn), () => {
        game.PlaySound(game.sounds.select);
        gUI.ToggleDarkMode();
        game.ToggleDarkMode();
    });
    gUI.appbarMenu.appendChild(gUI.darkModeButton);

    // Help
    var help = gUI.Btn(gIcon.help, () => {
        
        game.PlaySound(game.sounds.select);
        gUI.ShowModal(game._('modal.how_to_play.title'), game._('modal.how_to_play.content'), [
            gUI.BtnPrimary(game._('generic.okay'), gUI.HideModal)
        ]);

    });
    gUI.appbarMenu.appendChild(help);

    // Menu
    var menu = gUI.Btn(gIcon.menu, () => {
        gUI.sidebar.classList.toggle('active');
        game.PlaySound(game.sounds.whoosh);
    });
    gUI.appbarMenu.appendChild(menu);

}

/**
 * Initializes appbar and appbar menu.
 */
gUI.InitSidebar = function () {

    gUI.AddSidebarOption(gIcon.sound, "Sound", () => {
        game.PlaySound(game.sounds.select);
        game.config.sound = !game.config.sound;
    }, true, game.config.sound);

    gUI.AddSidebarOption(gIcon.help, "How to Play", () => {
        game.PlaySound(game.sounds.select);
        gUI.ShowModal(game._('modal.how_to_play.title'), game._('modal.how_to_play.content'), [
            gUI.BtnPrimary(game._('generic.okay'), gUI.HideModal)
        ]);
    }, false, false);

}

/**
 * Initialize the bet options.
 */
gUI.InitBetForm = function () {
    
    // Bet form
    var form = gUI.Row('g-bet-form', ['g-frame']);
    gUI.betCenter.appendChild(form);

    // Bet amount
    var div = gUI.Row('g-bet-amount');
    form.appendChild(div);

    // Bet decrease
    var col = gUI.Col();
    var button = gUI.BtnRound(gIcon.minus, () => { 
        game.PlaySound(game.sounds.select);
        var bet = parseFloat(gUI.betInput.querySelector('input').value);
        bet -= game.config.betIncrement;
        game.SetBet(bet);
    });
    col.appendChild(button);
    div.appendChild(col);

    // Bet amount input
    gUI.betInput = gUI.Input('number', 'Bet amount', null, game.config.minBet.toFixed(2));
    gUI.betInput.querySelector('input').id = 'g-bet-amount-input';
    div.appendChild(gUI.betInput);

    // Only numbers!
    gUI.betInput.querySelector('input').addEventListener("keypress", function (e) {
        var allowedChars = '0123456789.';
        function contains(stringValue, charValue) {
            return stringValue.indexOf(charValue) > -1;
        }
        var invalidKey = e.key.length === 1 && !contains(allowedChars, e.key)
                || e.key === '.' && contains(e.target.value, '.');
        invalidKey && e.preventDefault();
    });

    // Player has entered bet amount
    gUI.betInput.querySelector('input').onkeyup = function (e) {

        // Temporarily disable input
        gUI.betBottom.classList.add('disabled');
        
        // Validates bet amount
        if (game.inputDelay) clearTimeout(game.inputDelay);
        if (gUI.betInput.querySelector('input').value.length > 0) {
            game.inputDelay = setTimeout(function () {
                game.SetBet(e.target.value);
            }, 1000);
        }

    };

    // Bet increase
    var col = gUI.Col();
    var button = gUI.BtnRound(gIcon.plus, () => { 
        game.PlaySound(game.sounds.select);
        var bet = parseFloat(gUI.betInput.querySelector('input').value);
        bet += game.config.betIncrement;
        game.SetBet(bet);
    });
    col.appendChild(button);
    div.appendChild(col);

    // Shortcut buttons
    var div = gUI.Row('g-bet-shortcuts');
    form.appendChild(div);

    var btns = [5, 10, 25, 50];
    for (var i = 0; i < btns.length; i++) {
        
        var col = gUI.Col();
        var button = gUI.BtnSecondary(game.config.currencySymbol + btns[i], (e) => { 
            game.PlaySound(game.sounds.select);
            var bet = parseFloat(gUI.betInput.querySelector('input').value);
            bet += parseFloat(e.target.value);
            game.SetBet(bet);
        });
        button.value = btns[i];
        col.appendChild(button);
        div.appendChild(col);

    }

}

/**
 * Adds betting options to the bet form.
 */
gUI.InitBetButtons = function () {

    // Number of pins
    gUI.betPins = gUI.Row('g-bet-pins', ['g-frame']);
    gUI.betTop.appendChild(gUI.betPins);

    var label = document.createElement('label');
    label.innerHTML = game._('form.number_of_pins');
    gUI.betPins.appendChild(label);

    var group = gUI.Row();
    gUI.betPins.appendChild(group);

    // 12 Pins
    gUI.btn12 = gUI.Btn('12 Low', () => {
        game.PlaySound(game.sounds.select);
        game.SetupBoard(14);
    });
    group.appendChild(gUI.btn12);
    gUI.btn12.classList.add((game.pinCount === 14) ? 'g-btn-primary' : 'g-btn-secondary');

    // 14 Pins
    gUI.btn14 = gUI.Btn('14 Normal', () => {
        game.PlaySound(game.sounds.select);
        game.SetupBoard(16);
    });
    group.appendChild(gUI.btn14);
    gUI.btn14.classList.add((game.pinCount === 16) ? 'g-btn-primary' : 'g-btn-secondary');
    
    // 16 Pins
    gUI.btn16 = gUI.Btn('16 High', () => {
        game.PlaySound(game.sounds.select);
        game.SetupBoard(18);
    });
    group.appendChild(gUI.btn16);
    gUI.btn16.classList.add((game.pinCount === 18) ? 'g-btn-primary' : 'g-btn-secondary');

    // Bet types
    var div = gUI.Row('g-bet-type', ['g-frame']);
    gUI.betTop.appendChild(div);

    // Bet Manual
    gUI.betManual = gUI.Btn('Manual', () => {
        game.PlaySound(game.sounds.select);
        gUI.ManualButtons();
    });
    div.appendChild(gUI.betManual);

    // Bet Auto
    gUI.betAuto = gUI.Btn('Auto', () => {
        game.PlaySound(game.sounds.select);
        gUI.AutoButtons();
    });
    div.appendChild(gUI.betAuto);

    // Bet Options container
    gUI.betOptions = gUI.Div('g-bet-options');
    gUI.betTop.appendChild(gUI.betOptions);

    // Manual options by default
    gUI.ManualButtons();

}

/**
 * Inserts the manual buttons.
 */
gUI.ManualButtons = function () {

    // Reset
    gUI.betBottom.innerHTML = '';
    gUI.betOptions.innerHTML = '';
    gUI.betManual.classList.add('g-btn-primary');
    gUI.betManual.classList.remove('g-btn-secondary');
    gUI.betAuto.classList.remove('g-btn-primary');
    gUI.betAuto.classList.add('g-btn-secondary');

    // Bet Green
    var greenBet = gUI.BtnPrimary('Bet', () => {
        game.StartManual(0);
    });
    greenBet.classList.add('green');
    gUI.betBottom.appendChild(greenBet);

    /*
    // Bet Yellow
    var yellowBet = gUI.BtnPrimary('Yellow', () => {
        game.StartManual(1);
    });
    yellowBet.classList.add('yellow');
    gUI.betBottom.appendChild(yellowBet);
    // Bet Red
    var redBet = gUI.BtnPrimary('Red', () => {
        game.StartManual(2);
    });
    redBet.classList.add('red');
    gUI.betBottom.appendChild(redBet);
    */

}

/**
 * Inserts the auto buttons.
 */
gUI.AutoButtons = function () {
    
    // Reset
    gUI.betBottom.innerHTML = '';
    gUI.betOptions.innerHTML = '';
    gUI.betAuto.classList.add('g-btn-primary');
    gUI.betAuto.classList.remove('g-btn-secondary');
    gUI.betManual.classList.remove('g-btn-primary');
    gUI.betManual.classList.add('g-btn-secondary');

    // Autobetting
    gUI.autobetButton = gUI.BtnPrimary('Start Autobetting', () => {
        game.StartAuto();
    });
    gUI.betBottom.appendChild(gUI.autobetButton);

}

//#endregion
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
//#region CUSTOMIZATION

/**
 * Toggles the game's dark mode theme.
 */
gUI.ToggleDarkMode = function () {

    // Toggle setting
    game.config.darkMode = !game.config.darkMode;

    // Toggle class
    game.gameContainer.classList.toggle('dark');

    // Toggle icon
    gUI.darkModeButton.innerHTML = game.config.darkMode ? gIcon.lightbulbOff : gIcon.lightbulbOn;

}

//#endregion
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
//#region MODALS & ALERTS

/**
 * Shows the modal.
 * 
 * @param {*} title 
 * @param {*} content 
 * @param {*} buttons 
 * @param {*} canClose 
 */
gUI.ShowModal = function (title, content, buttons = null, canClose = true) {

    // Sound effect
    game.PlaySound(game.sounds.popup);

    // Title
    gUI.modalTitle.innerHTML = title;
    (title || canClose) ? gUI.modalHeader.classList.add('active') : gUI.modalHeader.classList.remove('active');

    // Content
    gUI.modalContent.innerHTML = content;

    // Buttons
    if (buttons != null) {
        gUI.modalFooter.innerHTML = '';
        gUI.modalFooter.classList.add('active');
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            gUI.modalFooter.appendChild(button);
        }
    } else {
        gUI.modalFooter.classList.remove('active');
    }

    // Close
    canClose ? gUI.modalClose.classList.add('active') : gUI.modalClose.classList.remove('active');

    // Show
    gUI.modalContainer.classList.add('active');
    gUI.modal.classList.add('active');

}

/**
 * Hides the modal window.
 */
gUI.HideModal = function () {

    gUI.modalContainer.classList.remove('active');
    gUI.modal.classList.remove('active');

}

/**
 * Checkout notification.
 * 
 * @param {number} amount   The amount to give/charge the player.
 * @param {string} type     plus or minus 
 */
gUI.CheckoutNotification = function (amount, type) {

    // Create notification
    var notification = document.createElement('div');
    notification.classList.add('g-appbar-notification');
    notification.classList.add(type);
    
    // Icon
    notification.innerHTML = (type == "plus" ? gIcon.plus : gIcon.minus);

    // Text
    var text = document.createElement('div');
    text.classList.add('g-appbar-notification-text');
    text.innerText = game.config.currencySymbol + parseFloat(amount).toFixed(2);
    notification.appendChild(text);

    // Add to appbar
    gUI.appbarCheckout.appendChild(notification);

    // Remove notification after 2 seconds
    gUI.RemoveOnFade(notification, game.config.notificationDelay * (gUI.appbarCheckout.childElementCount - 1));

}

//#endregion
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
//#region HTML ELEMENTS

/**
 * HTML Div element.
 * 
 * @param {string} id           Element ID
 * @param {array} classList     Element class name(s)
 * @param {string} style        Element style 
 * @returns 
 */
gUI.Div = function (id = null, classList = [], style = "") {
    var div = document.createElement("div");
    div.id = id ? id : "";
    div.classList.add(...classList);
    div.style = style;
    return div;   
}

/**
 * HTML Row element.
 * 
 * @param {string} id           Element ID 
 * @param {array} classList     Element class name(s)
 * @param {string} width        Element width
 * @param {string} gap          Element gap
 * 
 * @returns {HTMLElement}
 */
gUI.Row = function(id = null, classList = [], width = null, gap = null) {

    var row = document.createElement('div');
    row.classList.add('g-row');
    row.id = id ? id : "";
    row.classList.add(...classList);
    if (width) row.style.width = width;
    if (gap) row.style.gap = gap;

    return row;

}

/**
 * HTML Column element.
 * 
 * @param {string} id           Element ID 
 * @param {array} classList     Element class name(s)
 * @param {string} width        Element width
 * 
 * @returns {HTMLElement}
 */
gUI.Col = function(id = null, classList = []) {

    var col = document.createElement('div');
    col.id = id ? id : "";

    col.classList.add('g-col');
    col.classList.add(...classList);

    return col;

}

/**
 * Create an input.
 * 
 * @param {string} label        Label on input.
 * @param {string} onchange     Onchange event.
 * @param {string} value        Value of input.
 * 
 * @returns {HTMLElement}
 */
gUI.Input = function(type, label, onchange, value = '') {

    var input = document.createElement('input');
    input.type = type;
    if (value) input.value = value;
    if (onchange) input.onchange = onchange;

    var labelEl = document.createElement('label');
    labelEl.innerHTML = label;

    var div = document.createElement('div');
    div.classList.add('g-field-group');
    div.appendChild(labelEl);
    div.appendChild(input);

    return div;

}

/**
 * Create a primary button.
 * 
 * @param {string} label    Label on button.
 * @param {mixed} onclick   Onclick event.
 * 
 * 
 * @returns {HTMLElement}
 */
gUI.Btn = function(label, onclick) {

    var btn = document.createElement('button');
    btn.classList.add('g-btn-default');
    btn.innerHTML = label;
    btn.onclick = onclick;

    return btn;

}

/**
 * Create a primary button.
 * 
 * @param {string} label    Label on button.
 * @param {mixed} onclick   Onclick event.
 * 
 * @returns {HTMLElement}
 */
gUI.BtnPrimary = function(label, onclick) {

    var btn = document.createElement('button');
    btn.classList.add('g-btn-default');
    btn.classList.add('g-btn-primary');
    btn.innerHTML = label;
    btn.onclick = onclick;

    return btn;

}

/**
 * Create a secondary button.
 * 
 * @param {string} label    Label on button.
 * @param {mixed} onclick   Onclick event.
 * 
 * @returns {HTMLElement}
 */
gUI.BtnSecondary = function(label, onclick) {

    var btn = document.createElement('button');
    btn.classList.add('g-btn-default');
    btn.classList.add('g-btn-secondary');
    btn.innerHTML = label;
    btn.onclick = onclick;

    return btn;

}

/**
 * Create an outline button.
 * 
 * @param {string} label    Label on button.
 * @param {mixed} onclick   Onclick event.
 * 
 * @returns {HTMLElement}
 */
gUI.BtnOutline = function(label, onclick) {

    var btn = document.createElement('button');
    btn.classList.add('g-btn-default');
    btn.classList.add('g-btn-outline');
    btn.innerHTML = label;
    btn.onclick = onclick;

    return btn;

}

/**
 * Create a round button.
 * 
 * @param {string} label    Label on button.
 * @param {mixed} onclick   Onclick event.
 * 
 * @returns {HTMLElement}
 */
gUI.BtnRound = function(label, onclick) {

    var btn = document.createElement('button');
    btn.classList.add('g-btn-default');
    btn.classList.add('g-btn-round');
    btn.innerHTML = label;
    btn.onclick = onclick;

    return btn;

}

/**
 * Creates a toggle switch button element.
 * 
 * @param {bool} enabled Is active?
 */
gUI.SwitchElement = function(enabled) {

    var switchEl = gUI.Div(null, ['switch']);

    var label = document.createElement('label');
    label.classList.add('toggle-control');
    switchEl.appendChild(label);

    var input = document.createElement('input');
    input.type = 'checkbox';
    input.classList.add('toggle-control-input');
    if (enabled) {
        input.checked = true;
    }
    label.appendChild(input);

    var span = document.createElement('span');
    span.classList.add('control');
    label.appendChild(span);

    return switchEl;

}
 
//#endregion
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
//#region HELPERS

/**
 * Adds an option to the sidebar.
 * 
 * @param {string}  icon        Icon for the option.
 * @param {string}  label       Label for the option. 
 * @param {mixed}   onClick     Function to call when the option is clicked.
 * @param {boolean} toggle      Whether the option is a toggle.
 * @param {boolean} enabled     Whether the option is enabled.
 */
gUI.AddSidebarOption = function (icon = null, label = null, onClick = null, toggle = false, enabled = false) {

    // Create option
    var option = gUI.Row(null, ['g-sidebar-option']);

    // Create icon
    var iconEl = gUI.Div(null, ['g-sidebar-option-icon']);
    iconEl.innerHTML = icon;
    option.appendChild(iconEl);

    // Create label
    var labelEl = gUI.Div(null, ['g-sidebar-option-label']);
    labelEl.innerHTML = label;
    option.appendChild(labelEl);

    // Create toggle
    if (toggle) {
        var toggleEl = gUI.SwitchElement(enabled);
        option.appendChild(toggleEl);

        // Add event listener
        toggleEl.querySelector('input').onchange = onClick;

    }

    // Add to sidebar
    gUI.sidebarMenu.appendChild(option);

    // Add onclick
    if (onClick && !toggle) {

        option.onclick = onClick;

    }

}

/**
 * Fades element in, waits, fades out and removes.
 * 
 * @param {HTMLElement} el      Element to fade.
 * @param {number} delay        Delay before fade out.
 */
gUI.RemoveOnFade = function( el, delay) {
    
    el.classList.add('game-fade-in');
    setTimeout(function () {
        
        el.classList.remove('game-fade-in');
        el.classList.add('game-fade-out');
        el.addEventListener('animationend', function () {
            el.remove(); 
        });

    }, delay);

}

//#endregion
// -----------------------------------------------------------------------------
