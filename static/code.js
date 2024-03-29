/// <reference path="./jquery.min.js" />
/// <reference path="./codemirror.min.js" />


const editor = CodeMirror($('#code')[0], {
    // value: "from random import random, choice\r\n\r\nclass Dragon:\r\n    def __init__(self, name, ferocity):\r\n        self.name = name\r\n        self.ferocity = ferocity\r\n        print('A new dragon has been born!')\r\n    def meow(self):\r\n        print(choice(['meow~', 'nya~~', 'nyan~']))\r\n    def roar(self):\r\n        print(choice(['ROAAAR!', 'rawr xd', '*growls*']))\r\n    def action(self):\r\n        print(self.name+': ', end='')\r\n        if random() < self.ferocity: self.roar()\r\n        else: self.meow()\r\n\r\ndario = Dragon('Dario', 0.3)\r\nfor n in range(4): dario.action()",
    // value: 'def twoSum(arr, target):\r\n    m = {}\r\n    for i in range(len(arr)):\r\n        if target-arr[i] in m:\r\n            return [i, m[target-arr[i]]]\r\n        m[arr[i]] = i\r\n    return [-1, -1]',
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


const numLines = str => ~~(((str.match(/\n/g)||[]).length+1)/2);
const testcases = '2 7 11 15\n9\n3 2 4\n6\n3 3\n6\n0 1 3 0\n0\n-1 1000000000 0 4 -999999999\n1\n';
if (localStorage.lastInput === undefined) {
    localStorage.lastInput = "2 7 11 15\n9";
}
var lastInput = localStorage.lastInput;
var runInput;
$('#input').text(lastInput);
$('#input').on('input', function (e) {
    localStorage.lastInput = lastInput = $(this).text();
});

$('#run').on('click', function (e) {
    console.log('click!');
    $('#output, #expected').html('<span>...</span>');
    $('#left-wrapper').removeClass('problem').addClass('console');
    $('#stdout').parent().css('display', 'none');
    $('#input').text(lastInput);
    runInput = lastInput;
    $('#error').css('display', 'none');
    $('.title span.status').removeClass('darkgreen green red').text('Running...');
    $('.title span.runtime').text('');
    if (!numLines($('#input').text().trim())) {
        $('.title span.status').text('Incomplete Input');
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
    $('#stdout').parent().css('display', 'none');
    $('#input')
        .attr('contenteditable', 'false')
        .css({'border': '1px solid #eeeeee', '-webkit-user-modify': 'read-only', '-ms-user-modify': 'read-only', 'user-modify': 'read-only'})
        .html('<span>(hidden)</span>')
    ;
    runInput = testcases;
    $('#error').css('display', 'none');
    $('.title span.status').removeClass('darkgreen green red').text('Running...');
    $('.title span.runtime').text('');
    languages[language][2](editor.getValue(), language, function () {
        $('.title span.status').addClass('green').text('Success');
        $('#input')
            .on('pointerdown touchstart focus', function () { $(this).text(lastInput).off('pointerdown touchstart focus') })
            .css({'border': '', '-webkit-user-modify': '', '-ms-user-modify': '', 'user-modify': ''})
            .parent()
                .css('display', '')
        ;
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
    if (obj.stdout) {
        $('#stdout').text(obj.stdout).parent().css('display', '');
    }
    if (obj.stderr) {
        $('#error').text(obj.stderr).css('display', 'block');
        $('.title span.status').addClass('red').text('Runtime Error');
    } else if (obj.stdin) {
        $('#input').text(obj.stdin).parent().css('display', '');
        $('.title span.status').addClass('red').text('Wrong Answer');
        $('.title span.runtime').text('Runtime: '+obj.runtime+' ms');
    } else {
        console.log(obj);
        eval(obj.callback);
        $('.title span.runtime').text('Runtime: '+obj.runtime+' ms');
    }
}
setDisplay(JSON.parse(localStorage.obj));

const languages = [  // [Visible Name, Codemirror Name, Run Function]
    ['Java', 'text/x-java', (input, lang, callback) => {
        $.post({
            url: 'https://emkc.org/api/v2/piston/execute',
            data: {
                language: 'java',
                version: '15.0.2',
                files: [
                    {
                        name: 'Main.java',
                        content: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));\n        String[][] stdin = new String[Integer.parseInt(in.readLine())][2];\n        for (int i = 0; i < stdin.length; i++) {\n            stdin[i][0] = in.readLine();\n            stdin[i][1] = in.readLine();\n        }\n        String out1 = "";\n        String out2 = "";\n        String delim = "Auy2i2SvK9OM8i9Pxf6ogq0jJ9jGS8Ne";\n        int runtime = 0;\n        for (int i = 0; i < stdin.length; i++) {\n            String line1 = stdin[i][0];\n            String line2 = stdin[i][1];\n            String[] temp = line1.split(" ");\n            int[] param1 = new int[temp.length];\n            for (int j = 0; j < temp.length; ++j) {\n                param1[j] = Integer.parseInt(temp[j]);\n            }\n            int param2 = Integer.parseInt(line2);\n            int[] _res = twoSum(param1, param2);\n            String str2 = ""+_res[0]+" "+_res[1]+"\\n";\n            final long start = System.currentTimeMillis();\n            int[] res = (new Solution()).twoSum(param1, param2);\n            final long end = System.currentTimeMillis();\n            runtime += (int)(end-start);\n            String str1 = ""+res[0]+" "+res[1]+"\\n";\n            if (!(res[0] == _res[0] && res[1] == _res[1] || res[0] == _res[1] && res[1] == _res[0])) {\n                System.out.print(delim+line1+"\\n"+line2+delim+str1+delim+str2+delim+runtime);\n                System.exit(0);\n            }\n            out1 += str1;\n            out2 += str2;\n        }\n        System.out.print(delim+delim+out1+delim+out2+delim+runtime);\n    }\n    private static int[] twoSum(int[] arr, int target) {\n        Map<Integer, Integer> hash = new HashMap<Integer, Integer>();\n        for (int i = arr.length-1; i >= 0; i--) {\n            int addend = target-arr[i];\n            if (hash.containsKey(addend)) {\n                return new int[]{i, hash.get(addend)};\n            }\n            hash.put(arr[i], i);\n        }\n        return new int[]{-1, -1};\n    }\n}'+input
                    }
                ],
                stdin: (text => `${numLines(text)}\n${text}`)(runInput.trim()),
                run_timeout: 10000,
            },
            success: data => judge(data, lang, callback),
            error: function (data) {
                console.log(data);
            }
        });
    }],
    ['Python', 'python', (input, lang, callback) => {
        $.post({
            url: 'https://emkc.org/api/v2/piston/execute',
            data: {
                language: 'python',
                version: '3.10',
                files: [
                    {
                        name: 'main.py',
                        content: 'from time import time\nimport solution\ntwoSum = getattr(solution, "twoSum", None)\nif not callable(twoSum):\n    raise NameError("function \'twoSum\' is not defined")\nfrom expected import twoSum as _twoSum\nstdin = [(input(), input()) for n in range(int(input()))]\nout1 = ""\nout2 = ""\ndelim = "Auy2i2SvK9OM8i9Pxf6ogq0jJ9jGS8Ne"\nruntime = 0\nfor line1, line2 in stdin:\n    param1 = [int(n) for n in line1.split(" ")]\n    param2 = int(line2)\n    _res = _twoSum(param1, param2)\n    str2 = " ".join(map(str, _res))+"\\n"\n    start = time()\n    res = twoSum(param1, param2)\n    end = time()\n    assert isinstance(res, list), "Return type should be list[int]"\n    runtime += end-start\n    str1 = " ".join(map(str, res))+"\\n"\n    if res != _res and res[::-1] != _res:\n        print(delim+line1+\'\\n\'+line2+delim+str1+delim+str2+delim+str(int(runtime*1000)), end="")\n        exit()\n    out1 += str1\n    out2 += str2\nprint(delim+delim+out1+delim+out2+delim+str(int(runtime*1000)), end="")'
                    },
                    {
                        name: 'solution.py',
                        content: input
                    },
                    {
                        name: 'expected.py',
                        content: 'def twoSum(arr, target):\n    m = {}\n    for i in range(len(arr)):\n        if target-arr[i] in m:\n            return [m[target-arr[i]], i]\n        m[arr[i]] = i\n    return [-1, -1]'
                    }
                ],
                stdin: (text => `${numLines(text)}\n${text}`)(runInput.trim()),
                run_timeout: 10000,
            },
            success: data => judge(data, lang, callback)
        });
    }],
    // ['C++', () => {}],
];


if (localStorage.saves === undefined) {
    localStorage.saves = '{}';
}
var defaultSaves = {
    Python: 'def twoSum(nums, target):\r\n    """\r\n    :type nums: list[int]\r\n    :type target: int\r\n    :rtype: list[int]\r\n    """',
    Java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}',
};
var saves = JSON.parse(localStorage.saves);
saves = {...defaultSaves, ...saves};
editor.on('change', function (cm) {
    saves[languages[language][0]] = cm.getValue();
    localStorage.saves = JSON.stringify(saves);
});

var language = +localStorage.language;
setLanguage();
$('#language').on('click', function () {
    localStorage.language = language = (language+1)%languages.length;
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
