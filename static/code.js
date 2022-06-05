/// <reference path="./jquery.min.js" />
/// <reference path="./codemirror.min.js" />

const editor = CodeMirror($('#code')[0], {
    value: "from random import random, choice\r\n\r\nclass Dragon:\r\n    def __init__(self, name, ferocity):\r\n        self.name = name\r\n        self.ferocity = ferocity\r\n        print('A new dragon has been born!')\r\n    def meow(self):\r\n        print(choice(['meow~', 'nya~~', 'nyan~']))\r\n    def roar(self):\r\n        print(choice(['ROAAAR!', 'rawr xd', '*growls*']))\r\n    def action(self):\r\n        print(self.name+': ', end='')\r\n        if random() < self.ferocity: self.roar()\r\n        else: self.meow()\r\n\r\ndario = Dragon('Dario', 0.3)\r\nfor n in range(4): dario.action()",
    mode: 'python',
    theme: 'textmate',
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTab: true,
    styleActiveLine: true,
    extraKeys: {
        'Ctrl-/': 'toggleComment',
        'Shift-Tab': 'indentLess',
        'Tab': function (cm) {
            if (editor.getSelection()) {
                cm.execCommand('indentMore')
            } else {
                cm.execCommand('insertSoftTab');
            }
        }
    },
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
});

// Backspace tab deletion
const indentRe = /^  *$/;
editor.on('keydown', function (e) {
    var e = window.event || e;
    if (e.key == 'Backspace' && !e.ctrlKey && !editor.getSelection()) {
        var pos = editor.getCursor();
        var lines = editor.getValue().split('\n');
        var line = lines[pos.line];
        if (indentRe.test(line.substring(0, pos.ch))) {
            e.preventDefault();
            var ch = (~~((pos.ch-1)/4))*4;
            editor.replaceRange('', {line: pos.line, ch: ch}, {line: pos.line, ch: pos.ch});
        }
    }
});


const fileRe = /\/piston\/jobs\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}\/file0.code/;
$('#submit').on('click',function (e) {
    console.log('click!');
    $.post({
        url: 'https://emkc.org/api/v1/piston/execute',
        data: {
            language: 'python3',
            source: editor.getValue(),
            stdin: 'Input will be added soon!\n',
            run_timeout: 1000,
            run_memory_limit: 100,
            args: []
        },
        success: function (data) {
            stdout = data.output.replace(fileRe, '/home/temp/file.py');
            $('#output').text(stdout);
            console.log(stdout);
        }
    });
});