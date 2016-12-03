var term;
function termOpen() {
    if ((!term) || term.closed) {
        var conf = {
            handler: cmdHandler,
            ps: '~$',
            cols: 800,
            rows: 45,
            crsrBlinkMode: true,
            crsrBlockMode: true,
            blinkDelay: 500,
            wrapping: true,
            frameWidth: 0,
            ctrlHandler: controlHandler,
            greeting: 'Welcome'
        };
        term = new Terminal(conf);
        term.open();
    }
}

function cmdHandler() {
    var parser = new Parser();
    parser.parseLine(this);
    var cmd = this.argv[this.argc];

    this.newLine();
    if (cmd == 'help') {
        this.write('help');
    }
    else if (cmd == 'char') {
        this.charMode = true;
        charModeHandler(this);
        this.handler = charModeHandler;
        this.cursorOn();
        this.lock = false;
        return;
    }

    else if (cmd == 'ls') {
        cmdLs(this);
    }
    else if (cmd == 'clear') {
        cmdClear(this)
    }
    // else if (cmd == 'll') {
    //     cmdLl(this);
    // }
    // else if (cmd == 'rm') {
    //     cmdRm(this);
    // }
    // else if (cmd == 'uname') {
    //     cmdUname(this);
    // }
    // else if (cmd == 'whoami' || cmd == 'who') {
    //     this.write('%c(@lightgrey)' + this.user);
    // }
    this.prompt();
}

function cmdClear(term) {
    term.clear();
}

function cmdLs(term) {
    $.ajax({
        type: "POST",
        url: "/get-list/",
        async: false,
        data: {csrfmiddlewaretoken: Cookies.get('csrftoken'), arg: 'afd'},
        success: function (response) {
            term.write(response);
            term.newLine();
        }
    });
}

function charModeHandler(preTerm) {
    if (preTerm) {
        preTerm.clear();
        preTerm.env.mode = '';
        preTerm.env.handler = preTerm.handler;
        return;
    }

    this.lock = true;
    this.cursorOff();
    var key = this.inputChar;
    if (key == 113) {
        // "q" => quit
        // leave charMode and reset the handler to normal
        this.charMode = false;
        this.handler = this.env.handler;
        // clear the screen
        this.clear();
        // prompt and return
        this.prompt();
    }
}

function controlHandler() {
    if (this.inputChar == this.termKey.ETX) {
        this.newLine();
        this.prompt();
        this.close();
    }
}