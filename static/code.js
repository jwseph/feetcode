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
    if (e.key == 'Backspace') {
        var cursor = editor.getCursor();
        var lines = editor.getValue().split('\n');
        var line = lines[cursor.line];
        if (indentRe.test(line.substring(0, cursor.ch))) {
            e.preventDefault();
            var pos = (~~((cursor.ch-1)/4))*4;
            lines[cursor.line] = line.substring(0, pos)+line.substring(cursor.ch);
            editor.setValue(lines.join('\n'));
            editor.setCursor({line: cursor.line, ch: pos});
        }
    }
});


// editor.setOption('mode', 'javascript');