/// <reference path="./jquery.min.js" />
/// <reference path="./codemirror.min.js" />

const editor = CodeMirror($('#code')[0], {
    // value: "from random import random, choice\r\n\r\nclass Dragon:\r\n    def __init__(self, name, ferocity):\r\n        self.name = name\r\n        self.ferocity = ferocity\r\n        print('A new dragon has been born!')\r\n    def meow(self):\r\n        print(choice(['meow~', 'nya~~', 'nyan~']))\r\n    def roar(self):\r\n        print(choice(['ROAAAR!', 'rawr xd', '*growls*']))\r\n    def action(self):\r\n        print(self.name+': ', end='')\r\n        if random() < self.ferocity: self.roar()\r\n        else: self.meow()\r\n\r\ndario = Dragon('Dario', 0.3)\r\nfor n in range(4): dario.action()",
    value: 'def twoSum(arr, target):\r\n    m = {}\r\n    for i in range(len(arr)):\r\n        if target-arr[i] in m:\r\n            return [i, m[target-arr[i]]]\r\n        m[arr[i]] = i\r\n    return',
    mode: 'python',
    // mode: 'text/x-c++src',
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


$('#submit').on('click',function (e) {
    console.log('click!');
    languages[language][1]();
});



// Dragbar
var $left = $('#drag-left');
var dragOffset = null;

const drag = e => {
  document.selection?document.selection.empty():window.getSelection().removeAllRanges();
  $left.css('width', (e.pageX-dragOffset)+'px');
}

$('#dragbar').on('mousedown', e => {
  var rect = e.target.getBoundingClientRect();
  dragOffset = e.pageX-rect.left;
  $('html,body').css('cursor','col-resize');
  $(document).on('mousemove', drag);
});

$(document).on('mouseup', () => {
  if (dragOffset === null) return;
  dragOffset = null;
  $('html, body').css('cursor','');
  $(document).off('mousemove', drag);
});




if (localStorage.language === undefined) {
    localStorage.language = 0;
}

const fileRe = /\/piston\/jobs\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}\//g;
const languages = [
    ['Python', () => {
        $.post({
            url: 'https://emkc.org/api/v2/piston/execute',
            data: {
                language: 'python',
                version: '3.10',
                files: [
                    {
                        name: 'runner.py',
                        content: 'import solution\r\ntwoSum = getattr(solution, "twoSum", None)\r\nif not callable(twoSum):\r\n    raise NameError("function \'twoSum\' is not defined")\r\nparam_1, param_2 = [1, 5, 4, 2, 3, 1, 4, 5, 7, 7, 8, 9, 2, 5, 1, 3, 5, 1, 3, 4, 1], 11\r\nret = twoSum(param_1, param_2)\r\nprint(ret)'
                    },
                    {
                        name: 'solution.py',
                        content: editor.getValue()
                    }
                ],
                stdin: $('#input').text(),
                run_timeout: 10000,
                run_memory_limit: 100,
                args: []
            },
            success: function (data) {
                console.log(data);
                if (!data.run.stderr) {
                    stdout = data.run.stdout;
                    $('#output').text(stdout);
                    console.log(stdout);
                } else {
                    stderr = data.run.stdout.replaceAll(fileRe, '');
                    $('#error').text(stderr);
                    console.log(stderr);
                }
            }
        });
    }],
    ['Java', () => {}],
    ['C++', () => {}],
];
var language = localStorage.language;

$('#language').text(languages[language][0]).on('click', function () {
    language = localStorage.language = (language+1)%languages.length;
    $(this).text(languages[language][0]);
});





var consoleMode = 0;  // add localStorage later! 0: Run Code, 1: Submission Error, 2: Success

$('.toggle').on('click', () => {
    console.log('a');
    if ($('#left-wrapper').is('.problem')) {
        $('#left-wrapper').removeClass('problem').addClass('console');
    } else {
        $('#left-wrapper').removeClass('console').addClass('problem');
    }
});