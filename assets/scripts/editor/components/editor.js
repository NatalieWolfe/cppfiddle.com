'use strict';

var debounce = require('throttle-debounce/debounce');
var React = require('react');
var ReactAce = require('react-ace').default;

require('brace/mode/c_cpp');
require('brace/theme/ambiance');


const CHANGE_DEBOUNCE_MS = 500;

var onEditorChange = debounce(CHANGE_DEBOUNCE_MS, (code) => {
});

var ResultsBox = React.createClass({
    getInitialState: () => ({runResults: '', compileResults: ''}),
    render: function() {
        return (
            <div className="resultsBox">
                <div>{this.state.compileResults}</div>
                <hr />
                <div>{this.state.runResults}</div>
            </div>
        );
    }
});

var EditorBox = React.createClass({
    render: () => (
        <div className="editorBox panelist">
            <div className="panel-75">
                <ReactAce mode="c_cpp" theme="ambiance" width="100%" height="100%" onChange={onEditorChange} />
            </div>
            <div className="panel-25">
                <ResultsBox />
            </div>
        </div>
    )
});

module.exports = EditorBox;
