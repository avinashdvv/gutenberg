/**
 * External dependencies
 */
import Clipboard from 'clipboard';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import IconButton from '../icon-button';
import Button from '../button';

class ClipboardButton extends Component {
	constructor() {
		super( ...arguments );

		this.bindContainer = this.bindContainer.bind( this );
		this.onCopy = this.onCopy.bind( this );
		this.getText = this.getText.bind( this );
	}

	componentDidMount() {
		const { container, getText, onCopy } = this;
		const button = container.firstChild;

		this.clipboard = new Clipboard( button,	{
			text: getText,
			container,
		} );

		this.clipboard.on( 'success', onCopy );
	}

	componentWillUnmount() {
		this.clipboard.destroy();
		delete this.clipboard;
		clearTimeout( this.onCopyTimeout );
	}

	bindContainer( container ) {
		this.container = container;
	}

	onCopy( args ) {
		// Clearing selection will move focus back to the triggering button,
		// ensuring that it is not reset to the body, and further that it is
		// kept within the rendered node.
		args.clearSelection();

		const { onCopy, onFinishCopy } = this.props;
		if ( onCopy ) {
			onCopy();
			// For convenience and consistency, ClipboardButton offers to call
			// a secondary callback with delay. This is useful to reset
			// consumers' state, e.g. to revert a label from "Copied" to
			// "Copy".
			if ( onFinishCopy ) {
				clearTimeout( this.onCopyTimeout );
				this.onCopyTimeout = setTimeout( onFinishCopy, 4000 );
			}
		}
	}

	getText() {
		let text = this.props.text;
		if ( 'function' === typeof text ) {
			text = text();
		}

		return text;
	}

	render() {
		// Disable reason: Exclude from spread props passed to Button
		// eslint-disable-next-line no-unused-vars
		const { className, children, onCopy, onFinishCopy, text, ...buttonProps } = this.props;
		const { icon } = buttonProps;
		const classes = classnames( 'components-clipboard-button', className );
		const ComponentToUse = icon ? IconButton : Button;

		return (
			<span ref={ this.bindContainer }>
				<ComponentToUse { ...buttonProps } className={ classes }>
					{ children }
				</ComponentToUse>
			</span>
		);
	}
}

export default ClipboardButton;
