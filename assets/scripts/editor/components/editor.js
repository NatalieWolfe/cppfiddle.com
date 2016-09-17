'use strict';

var $ = require('jquery');
var debounce = require('throttle-debounce/debounce');
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

var ResultsBox = React.createClass({
    render: function() {
        return (
            <div className="resultsBox">
                <div>{this.props.compileResults}</div>
                <hr />
                <div>{this.props.runResults}</div>
            </div>
        );
    }
});

var EditorBox = React.createClass({
    getInitialState: () => ({code: DEFAULT_TEXT, runResults: '', compileResults: ''}),

    onEditorChange: debounce(CHANGE_DEBOUNCE_MS, function(code) {
        $.ajax({
            method: 'post',
            url: '/execute',
            dataType: 'json',
            cache: false,
            data: {code: code},
            success: (data) => {
                this.setState({code: code, runResults: data.run, compileResults: data.compile});
            },
            error: (err) => {
                this.setState({code: code, runResults: '', compileResults: err});
            }
        });
    }),

    render: function() {
        return (
            <div className="editorBox panelist">
                <div className="panel-75">
                    <ReactAce
                        mode="c_cpp"
                        theme="ambiance"
                        width="100%"
                        height="100%"
                        onLoad={this.onEditorChange}
                        onChange={this.onEditorChange}
                        value={this.state.code}
                    />
                </div>
                <div className="panel-25">
                    <ResultsBox runResults={this.state.runResults} compileResults={this.state.compileResults} />
                </div>
            </div>
        );
    }
});

module.exports = EditorBox;
