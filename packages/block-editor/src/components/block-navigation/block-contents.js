/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { forwardRef, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useBlockNavigationContext } from './context';
import BlockNavigationBlockSelectButton from './block-select-button';
import BlockDraggable from '../block-draggable';

const BlockNavigationBlockContents = forwardRef(
	(
		{
			onClick,
			block,
			isSelected,
			position,
			siblingBlockCount,
			level,
			...props
		},
		ref
	) => {
		const {
			__experimentalFeatures,
			blockDropTarget = {},
		} = useBlockNavigationContext();

		const { clientId } = block;

		const rootClientId = useSelect(
			( select ) =>
				select( 'core/block-editor' ).getBlockRootClientId(
					clientId
				) || '',
			[ clientId ]
		);

		const {
			rootClientId: dropTargetRootClientId,
			clientId: dropTargetClientId,
			dropPosition,
		} = blockDropTarget;

		const isDroppingBefore =
			dropTargetRootClientId === rootClientId &&
			dropTargetClientId === clientId &&
			dropPosition === 'top';
		const isDroppingAfter =
			dropTargetRootClientId === rootClientId &&
			dropTargetClientId === clientId &&
			dropPosition === 'bottom';
		const isDroppingToInnerBlocks =
			dropTargetRootClientId === clientId && dropPosition === 'inside';

		const className = useMemo( () => {
			return classnames( 'block-editor-block-navigation-block-contents', {
				'is-dropping-before': isDroppingBefore,
				'is-dropping-after': isDroppingAfter,
				'is-dropping-to-inner-blocks': isDroppingToInnerBlocks,
			} );
		}, [ isDroppingBefore, isDroppingAfter, isDroppingToInnerBlocks ] );

		const clientIds = useMemo( () => [ clientId ], [ clientId ] );

		return (
			<BlockDraggable
				clientIds={ clientIds }
				elementId={ `block-navigation-block-${ clientId }` }
			>
				{ ( { isDraggable, onDraggableStart, onDraggableEnd } ) => (
					<BlockNavigationBlockSelectButton
						ref={ ref }
						className={ className }
						block={ block }
						onClick={ onClick }
						isSelected={ isSelected }
						position={ position }
						siblingBlockCount={ siblingBlockCount }
						level={ level }
						draggable={ isDraggable && __experimentalFeatures }
						onDragStart={ onDraggableStart }
						onDragEnd={ onDraggableEnd }
						{ ...props }
					/>
				) }
			</BlockDraggable>
		);
	}
);

export default BlockNavigationBlockContents;
