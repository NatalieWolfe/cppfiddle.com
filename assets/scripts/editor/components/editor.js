'use strict';

var React = require('react');
var ReactAce = require('react-ace').default;

require('brace/mode/c_cpp');
require('brace/theme/ambiance');


var EditorBox = React.createClass({
    render: () => (
        <div className="editorBox">
            <form method="post" action="/execute">
                <div><ReactAce mode="c_cpp" theme="ambiance" name="code" /></div>
                <div><button type="submit">Execute!</button></div>
            </form>
        </div>
    )
});

module.exports = EditorBox;
