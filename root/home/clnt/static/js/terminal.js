var term;

var dir = '/home/clnt';

var closedHint = '<p>' +
    'The terminal is closed<br>' +
    'Click <a id="reset">HERE</a>' +
    ' to reopen it<br></p>';

var helpText = [
    'Commands:',
    'help                                       Print this help page',
    'exit                                        Close the terminal'
];

var info = [

];

function termOpen() {
    if ((!term) || term.closed) {
        let conf = {
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
            greeting: 'Welcome to web terminal, type \'help\' if you are lost.'
        };
        term = new Terminal(conf);
        term.user = 'clnt';
        term.open();
    }
}

function removeTip() {
    document.getElementById('closed-hint').remove();
    termOpen();
}

function cmdHandler() {
    var parser = new Parser();
    parser.parseLine(this);
    var cmd = this.argv[this.argc];

    this.newLine();
    if (cmd == undefined) {
        // do nothing
    }
    else if (cmd == 'help') {
        this.write(helpText);
    }
    else if (cmd == 'exit') {
        this.close();
        document.getElementById("closed-hint").innerHTML = closedHint;
        document.getElementById("reset").onclick = removeTip;
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
        cmdClear(this);
    }
    else if (cmd == 'cd') {
        cmdCd(this);
    }
    else if (cmd == 'pwd') {
        cmdPwd(this);
    }
    else if (cmd == 'man') {
        cmdMan(this);
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
    else if (cmd == 'whoami') {
        this.write('%c(@lightgrey)' + this.user);
    }
    else if (cmd == 'sudo') {
        this.write('You have no power here!');
    }
    else {
        this.write(cmd + ': command not found');
    }

    var dirList = dir.split('/');
    console.log(dir);
    if (dirList[1] == 'home' && dirList[2] == 'clnt') {
        dirList.splice(0, 3);
        let homeDir = dirList.join('/');
        if (homeDir == '') {
            this.ps = '~$'
        } else {
            this.ps = '~/' + dirList.join('/') + '$';
        }
    } else if (dirList[1] == undefined) {
        this.ps = '/$';
    } else {
        this.ps = dirList.join('/') + '$';
    }

    this.prompt();
}

function cmdMan(term) {
    term.write('No manual entry for ' + term.argv[1]);
}

function cmdPwd(term) {
    term.write(dir);
}

function cmdClear(term) {
    term.clear();
}

function realURL(directory) {
    return 'root' + directory;
}

function cmdCd(term) {
    $.ajax({
        type: "POST",
        url: "/change-dir/",
        async: false,
        data: {
            csrfmiddlewaretoken: Cookies.get('csrftoken'),
            currentDir: realURL(dir),
            command: term.argv[1]
        },
        success: function (response) {
            let data = JSON.parse(response);
            let message = data['message'];
            dir = data['dir'];

            if (message != '') {
                term.write(message);
            }
        }
    });
}

function cmdLs(term) {
    $.ajax({
        type: "POST",
        url: "/get-list/",
        async: false,
        data: {
            csrfmiddlewaretoken: Cookies.get('csrftoken'),
            arg: realURL(dir) // pass the path of current file
        },
        success: function (response) {
            // update current directory
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