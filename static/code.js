/// <reference path="./jquery.min.js" />
/// <reference path="./codemirror.min.js" />


const editor = CodeMirror($('#code')[0], {
    // value: "from random import random, choice\r\n\r\nclass Dragon:\r\n    def __init__(self, name, ferocity):\r\n        self.name = name\r\n        self.ferocity = ferocity\r\n        print('A new dragon has been born!')\r\n    def meow(self):\r\n        print(choice(['meow~', 'nya~~', 'nyan~']))\r\n    def roar(self):\r\n        print(choice(['ROAAAR!', 'rawr xd', '*growls*']))\r\n    def action(self):\r\n        print(self.name+': ', end='')\r\n        if random() < self.ferocity: self.roar()\r\n        else: self.meow()\r\n\r\ndario = Dragon('Dario', 0.3)\r\nfor n in range(4): dario.action()",
    value: 'def twoSum(arr, target):\r\n    m = {}\r\n    for i in range(len(arr)):\r\n        if target-arr[i] in m:\r\n            return [i, m[target-arr[i]]]\r\n        m[arr[i]] = i\r\n    return [-1, -1]',
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




const testcases = '2 7 11 15\n9\n3 2 4\n6\n3 3\n6\n0 1 3 0\n0\n-1 1000000000 0 4 -999999999\n1\n';
if (localStorage.lastInput === undefined) {
    localStorage.lastInput = null;
}
var lastInput = localStorage.lastInput;


$('#run').on('click', function (e) {
    console.log('click!');
    $('#output, #expected').html('<span>...</span>');
    $('#left-wrapper').removeClass('problem').addClass('console');
    $('#stdout').parent().css('display', 'none');
    if ($('#input').text().trim() == "(hidden)" || $('#input').text().trim() == '') {
        if (lastInput && lastInput != '(hidden)') {
            $('#input').text(lastInput);
            localStorage.lastInput = lastInput = null;
        } else {
            $('#input').text("2 7 11 15\n9");
        }
    }
    $('#error').css('display', 'none');
    $('.title span.status').removeClass('darkgreen green red').text('Running...');
    $('.title span.runtime').text('');
    if (!~~((($('#input').text().trim().match(/\n/g)||[]).length+1)/2)) {
        $('.title span.status').text('Not Enough Input');
        return;
    }
    languages[language][2](editor.getValue(), language, function () {
        $('.title span.status').addClass('darkgreen').text('Accepted');
    });
});

$('#submit').on('click', function (e) {
    console.log('click!');
    $('#left-wrapper').removeClass('problem').addClass('console');
    $('#output, #expected').html('<span>...</span>');
    $('#stdout, #input').parent().css('display', 'none');
    localStorage.lastInput = lastInput = $('#input').text();
    $('#input').text(testcases);
    $('#error').css('display', 'none');
    $('.title span.status').removeClass('darkgreen green red').text('Running...');
    $('.title span.runtime').text('');
    languages[language][2](editor.getValue(), language, function () {
        $('.title span.status').addClass('green').text('Success');
        $('#input').html('<span>(hidden)</span>').on('pointerdown touchstart', function () { $(this).text('').off('pointerdown touchstart') }).parent().css('display', '');
        $('#output, #expected').html('<span>(hidden)</span>');
    });
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
if (localStorage.obj === undefined) {
    localStorage.obj = '{}';
}

const fileRe = /\/piston\/jobs\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}\//g;

function judge(data, lang, callback) {
    console.log(data);
    console.log(data.run.stdout);
    console.log(data.run.stderr);
    var out = data.run.stdout.split('Auy2i2SvK9OM8i9Pxf6ogq0jJ9jGS8Ne');
    console.log(callback);
    obj = {stdout: out[0], stdin: out[1], output: out[2], expected: out[3], runtime: out[4], stderr: data.run.stderr.replaceAll(fileRe, ''), callback: '('+callback+')()'}
    setDisplay(obj);
    localStorage.obj = JSON.stringify(obj);
}

function setDisplay(obj) {
    if (obj.callback === undefined) return;
    $('#output').text(obj.output);
    $('#expected').text(obj.expected);
    if (obj.stdin) {
        $('#input').text(obj.stdin).parent().css('display', '');
    }
    if (obj.stdout) {
        $('#stdout').text(obj.stdout).parent().css('display', '');
    }
    if (obj.stderr) {
        $('#error').text(obj.stderr).css('display', 'block');
        $('.title span.status').addClass('red').text('Runtime Error');
    } else if (obj.output != obj.expected) {
        $('.title span.status').addClass('red').text('Wrong Answer');
        $('.title span.runtime').text('Runtime: '+obj.runtime+'ms');
    } else {
        console.log(obj);
        eval(obj.callback);
        $('.title span.runtime').text('Runtime: '+obj.runtime+'ms');
    }
}
setDisplay(JSON.parse(localStorage.obj));

const languages = [
    ['Python', 'python', (input, lang, callback) => {
        $.post({
            url: 'https://emkc.org/api/v2/piston/execute',
            data: {
                language: 'python',
                version: '3.10',
                files: [
                    {
                        name: 'runner.py',
                        content: 'from time import time\nimport solution\ntwoSum = getattr(solution, "twoSum", None)\nif not callable(twoSum):\n    raise NameError("function \'twoSum\' is not defined")\nfrom expected import twoSum as _twoSum\nstdin = [(input(), input()) for n in range(int(input()))]\nout1 = ""\nout2 = ""\ndelim = "Auy2i2SvK9OM8i9Pxf6ogq0jJ9jGS8Ne"\nruntime = 0\nfor line1, line2 in stdin:\n    param_1 = [int(n) for n in line1.split(" ")]\n    param_2 = int(line2)\n    start = time()\n    res = twoSum(param_1, param_2)\n    end = time()\n    assert isinstance(res, list), "Return type should be list[int]"\n    runtime += end-start\n    str1 = " ".join(map(str, res))+"\\n"\n    res = _twoSum(param_1, param_2)\n    str2 = " ".join(map(str, res))+"\\n"\n    if str1 != str2:\n        print(delim+line1+\'\\n\'+line2+delim+str1+delim+str2+delim+str(int(runtime*1000)), end="")\n        exit()\n    out1 += str1\n    out2 += str2\nprint(delim+delim+out1+delim+out2+delim+str(int(runtime*1000)), end="")'
                    },
                    {
                        name: 'solution.py',
                        content: input
                    },
                    {
                        name: 'expected.py',
                        content: 'def twoSum(arr, target):\r\n    m = {}\r\n    for i in range(len(arr)):\r\n        if target-arr[i] in m:\r\n            return [i, m[target-arr[i]]]\r\n        m[arr[i]] = i\r\n    return [-1, -1]'
                    }
                ],
                stdin: ((text) => ""+~~(((text.match(/\n/g)||[]).length+1)/2)+"\n"+text)($('#input').text().trim()),  // 2 is number of lines each inp
                run_timeout: 10000,
                run_memory_limit: 100,
                args: []
            },
            success: data => judge(data, lang, callback)
        });
    }],
    // ['Java', () => {}],
    // ['C++', () => {}],
];


if (localStorage.saves === undefined) {
    localStorage.saves = JSON.stringify({
        Python: 'def twoSum(nums, target):\r\n    """\r\n    :type nums: list[int]\r\n    :type target: int\r\n    :rtype: list[int]\r\n    """',
    });
}
var saves = JSON.parse(localStorage.saves);
editor.on('change', function (cm) {
    saves[languages[language][0]] = cm.getValue();
    localStorage.saves = JSON.stringify(saves);
});

var language = localStorage.language;
setLanguage();
$('#language').on('click', function () {
    language = localStorage.language = (language+1)%languages.length;
    setLanguage();
});
function setLanguage() {
    $('#language').text(languages[language][0]);
    editor.setOption('mode', languages[language][1]);
    editor.setValue(saves[languages[language][0]]);
}


$('.toggle').on('click', () => {
    console.log('a');
    if ($('#left-wrapper').is('.problem')) {
        $('#left-wrapper').removeClass('problem').addClass('console');
    } else {
        $('#left-wrapper').removeClass('console').addClass('problem');
    }
});