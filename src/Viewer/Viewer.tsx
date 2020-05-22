import * as React from "react";
import { MarzipanoViewerOpts, MarzipanoViewer, IMarzipano } from "../marzipanoTypes";
import createMarzipanoComponent, { MarzipanoComponentChildContext } from "../core/component";
import { viewerExist } from '../core/utils';
import fullscreen from '../core/screenfull'

const Marzipano: IMarzipano = require('marzipano');

const marzipanoReadonlyProps: (keyof MarzipanoReadOnlyProps)[] = [
	"opts",
];

interface MarzipanoReadOnlyProps
{
	full?: boolean;
	opts?: MarzipanoViewerOpts;
	onFullScreenChange?: (isFullscreen: boolean) => void;
}

interface ViewerProps extends MarzipanoReadOnlyProps
{
	onReady?: (viewer: MarzipanoViewer) => void
	onClick?: (viewer: MarzipanoViewer | null) => void
	onMouseMove?: (viewer: MarzipanoViewer | null) => void
	onMouseDown?: (viewer: MarzipanoViewer | null) => void
	onMouseUp?: (viewer: MarzipanoViewer | null) => void
	onSceneChange?: () => void
}

interface State
{
	viewer: MarzipanoViewer | null;
}

class Viewer extends React.Component<ViewerProps & MarzipanoComponentChildContext, State>
{
	public _viewer: MarzipanoViewer | null;
	constructor(props: ViewerProps & MarzipanoComponentChildContext)
	{
		super(props)
		this.state = {
			viewer: null
		}
	}

	public componentDidMount()
	{
		this.createViewer();
		this.listenFullScreenChangeEvent()
	}

	public componentWillUnmount()
	{
		this.destoryViewer();
	}

	public async componentDidUpdate(prevProps: ViewerProps & MarzipanoComponentChildContext)
	{
		if (this.props.full !== prevProps.full && this.props.full !== fullscreen.isFullscreen)
		{
			fullscreen.toggle()
		}
	}

	private listenFullScreenChangeEvent()
	{
		const { onFullScreenChange } = this.props
		if (onFullScreenChange)
		{
			fullscreen.onchange(() =>
			{
				onFullScreenChange(fullscreen.isFullscreen)
			})
		}
	}

	private registerProvideToContext()
	{
		const { onRegisterProvide } = this.props
		const pano = this.refs["pano"];
		pano && this._viewer && onRegisterProvide && onRegisterProvide({ viewer: this._viewer })
	}

	private updateViewerState()
	{
		this.setState({ viewer: this._viewer })
	}

	private createViewer(recreate?: boolean)
	{
		const { opts, onReady } = this.props
		recreate && this.destoryViewer(); // Recreate a new viewer
		const pano = this.refs["pano"];
		if (!this._viewer)
		{
			// Create viewer
			const viewerOpts: MarzipanoViewerOpts = opts ? opts : {
				controls: {
					mouseViewMode: 'drag'
				},
			};
			this._viewer = new Marzipano.Viewer(pano, viewerOpts)
			this._viewer.addEventListener('sceneChange', this.onSceneChange)
			this._viewer && onReady && onReady(this._viewer)
			this.updateViewerState()
			this.registerProvideToContext()
		}
	}

	private onSceneChange = () =>
	{
		const { onSceneChange } = this.props
		onSceneChange && onSceneChange()
	}

	private destoryViewer()
	{
		if (this._viewer)
		{
			this._viewer.removeEventListener('sceneChange', this.onSceneChange)
			viewerExist(this._viewer) && this._viewer.destroy()
			this._viewer = null;
			this.updateViewerState()
			return true
		}
		else
		{
			console.warn('No viewer can be destroyed')
			return false
		}
	}

	onClick = () =>
	{
		this.props.onClick && this.props.onClick(this._viewer)
	}

	onMouseMove = () =>
	{
		this.props.onMouseMove && this.props.onMouseMove(this._viewer)
	}

	onMouseDown = () =>
	{
		this.props.onMouseDown && this.props.onMouseDown(this._viewer)
	}

	onMouseUp = () =>
	{
		this.props.onMouseUp && this.props.onMouseUp(this._viewer)
	}

	public render()
	{
		return (
			<div
				ref="pano"
				id="pano"
				onClick={this.onClick}
				onMouseMove={this.onMouseMove}
				onMouseDown={this.onMouseDown}
				onMouseUp={this.onMouseUp}
			>
				{
					this.state.viewer ? this.props.children : null
				}
			</div>
		);
	}
}

export default createMarzipanoComponent<ViewerProps, Viewer>(Viewer, { provider: true, marzipanoReadonlyProps });
