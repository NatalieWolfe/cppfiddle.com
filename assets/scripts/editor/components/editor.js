'use strict';

var debounce = require('throttle-debounce/debounce');
var React = require('react');
var ReactAce = require('react-ace').default;
var socket = require('socket.io-client')('http://localhost:8181');

require('brace/mode/c_cpp');
require('brace/theme/ambiance');


const CHANGE_DEBOUNCE_MS = 2000;
const DEFAULT_TEXT = [
    '',
    '#include <iostream>',
    '',
    'using namespace std;',
    '',
    'int main() {',
    '    cout << "Hello, World!" << endl;',
    '}',
    ''
].join('\n');

var currentJobId = 0;

var execute = debounce(CHANGE_DEBOUNCE_MS, (code, cb) => {
    socket.removeAllListeners('output');
    socket.removeAllListeners('update');

    var outputStr = '';
    socket.on('output', (output) => {
        // Ignore old output.
        if (output.jobId !== currentJobId) {
            return;
        }
        outputStr += output.data;
        cb(null, {code, output: outputStr});
    });
    socket.on('update', (data) => {
        if (data.jobId !== currentJobId) {
            return;
        }
    });

    socket.emit('execute', {jobId: ++currentJobId, code});
});

class ResultsBox extends React.Component {
    render() {
        return (
            <div className="resultsBox">
                <pre>{this.props.output}</pre>
            </div>
        );
    }
}


class EditorBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {code: DEFAULT_TEXT, output: ''};
    }

    onEditorChange(code) {
        execute(code, (err, data) => this.setState(data));
    }

    onEditorLoad() {
        this.onEditorChange(DEFAULT_TEXT);
    }

    render() {
        return (
            <div className="editorBox panelist">
                <div className="panel-75">
                    <ReactAce
                        mode="c_cpp"
                        theme="ambiance"
                        width="100%"
                        height="100%"
                        onLoad={() => this.onEditorChange(DEFAULT_TEXT)}
                        onChange={(code) => this.onEditorChange(code)}
                        value={this.state.code}
                    />
                    <ResultsBox output={this.state.output} />
                </div>
            </div>
        );
    }
}

module.exports = EditorBox;
