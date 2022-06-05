/// <reference path="./jquery.min.js" />
/// <reference path="./codemirror.min.js" />

const editor = CodeMirror($('#code')[0], {
    value: 'class Solution:\r\n    def twoSum(self, arr, target):\r\n        m = {}\r\n        for i in range(len(arr)):\r\n            if target-arr[i] in m:\r\n                return [i, m[target-arr[i]]]\r\n            m[arr[i]] = i\r\n        return []',
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
            stdin: 'Joseph\n',
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