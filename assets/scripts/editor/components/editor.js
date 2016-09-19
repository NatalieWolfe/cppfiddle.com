'use strict';

var $ = require('jquery');
var debounce = require('throttle-debounce/debounce');
var Promise = require('bluebird');
var React = require('react');
var ReactAce = require('react-ace').default;

require('brace/mode/c_cpp');
require('brace/theme/ambiance');


const CHANGE_DEBOUNCE_MS = 500;
const DEFAULT_TEXT = [
    '#include <iostream>',
    '',
    'using namespace std;',
    '',
    'int main() {',
    '    cout << "Hello, World!" << endl;',
    '}',
    ''
].join('\n');


function extractResults(res) {
    return res ? res.stdout || res.stderr : '';
}

var execute = debounce(CHANGE_DEBOUNCE_MS, (code, cb) => {
    $.ajax({
        method: 'post',
        url: 'http://localhost:8181/execute',
        dataType: 'json',
        cache: false,
        data: {code: code},
        success: (data) => {
            console.log('Compilation results:', data);
            cb(null, {
                code: code,
                runResults: extractResults(data.run),
                compileResults: extractResults(data.compile)
            });
        },
        error: (err) => {
            var data = err.responseJSON || {};
            cb(null, {
                code: code,
                runResults: extractResults(data.run),
                compileResults: extractResults(data.compile)
            });
        }
    });
});

class ResultsBox extends React.Component {
    render() {
        return (
            <div className="resultsBox">
                <div>{this.props.compileResults}</div>
                <hr />
                <div>{this.props.runResults}</div>
            </div>
        );
    }
}


class EditorBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {code: DEFAULT_TEXT, runResults: '', compileResults: ''};
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
                </div>
                <div className="panel-25">
                    <ResultsBox runResults={this.state.runResults} compileResults={this.state.compileResults} />
                </div>
            </div>
        );
    }
}

module.exports = EditorBox;
