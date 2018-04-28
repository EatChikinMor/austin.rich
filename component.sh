#!/bin/sh

function generate_component_contents() {
  COMPONENT_NAME=$1
  printf "'use strict';\n\nimport React from 'react';\n"
  printf "import PropTypes from 'prop-types';\n"
  printf "/**\n* @module "$COMPONENT_NAME"\n*/\n"
  printf "export default class "$COMPONENT_NAME" extends React.Component {\n\n"
  printf "	constructor(props) {\n		super(props);\n\n		this.state = {\n			exampleState : 'initial state'\n		};\n	}\n\n"
  printf "	componentWillMount() {\n	}\n\n"
  printf "	componentDidMount() {\n	}\n\n"
  printf "	componentWillUpdate() {\n	}\n\n"
  printf "	componentDidUpdate() {\n	}\n\n"
  printf "	componentWillUnmount() {\n	}\n\n"
  printf "	render() {\n		return (\n			<div></div>\n		);\n	}\n}\n"
  printf $COMPONENT_NAME".defaultProps = {\n  defaultPropGoesHere: 'default prop'\n};\n\n"
  printf $COMPONENT_NAME".propTypes = {\n  example: PropTypes.string\n};\n\n"
  printf $COMPONENT_NAME".displayName = '"$COMPONENT_NAME"';\n\n"
}

function component() {
  ComponentDirectory=$(find . -name 'Components');
  mkdir -p  $PWD/"$ComponentDirectory"/"$1"
  generate_component_contents $1 > $ComponentDirectory/$1/$1".js"
}
