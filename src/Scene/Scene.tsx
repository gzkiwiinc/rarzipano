import * as React from "react";
import { MarzipanoViewer, MarzipanoScene, MarzipanoView, MarzipanoSource, MarzipanoGeometry, MarzipanoTextureStoreOpts, MarzipanoLayerOpts } from '../marzipanoTypes';
import createMarzipanoComponent, { MarzipanoComponentChildContext } from "../core/component";
import { createRectilinearView, viewerExist, sceneExist } from '../core/utils';

const marzipanoReadonlyProps: (keyof MarzipanoReadOnlyProps)[] = [
	"viewer",
	"opts",
];

export interface SceneOpts
{
	view: MarzipanoView,
	source?: MarzipanoSource,
	geometry?: MarzipanoGeometry,
	pinFirstLevel?: boolean,
	textureStoreOpts?: MarzipanoTextureStoreOpts,
	layerOpts?: MarzipanoLayerOpts,
}

interface MarzipanoReadOnlyProps
{
	id?: number;
	viewer?: MarzipanoViewer;
	type?: 'Flat | Rectilinear';
	opts?: SceneOpts;
}

interface SceneProps extends MarzipanoReadOnlyProps
{
	switchTo?: boolean;
}

interface State
{
	scene: MarzipanoScene | null;
}

class Scene extends React.Component<SceneProps & MarzipanoComponentChildContext, State> {
	private _scene: MarzipanoScene | null;
	private _viewer: MarzipanoViewer | null;
	static defaultProps = {
		switchTo: true,
	};
	constructor(props: SceneProps & MarzipanoComponentChildContext)
	{
		super(props);
		this._viewer = props.viewer ? props.viewer : props.marzipanoContext.viewer ? props.marzipanoContext.viewer : null
		this.state = {
			scene: null
		}
	}

	public componentDidMount()
	{
		this.createScene();
	}

	public componentWillUnmount()
	{
		this.destroyScene();
	}

	public async componentDidUpdate(prevProps: SceneProps & MarzipanoComponentChildContext)
	{
		if (this.props.switchTo && this.props.switchTo !== prevProps.switchTo && this._viewer && this._scene)
		{
			const isCurrentScene = this._viewer && this._scene && this._viewer.scene() === this._scene
			!isCurrentScene && this.switchToScene()
		}
	}

	private registerProvideToContext()
	{
		const { onRegisterProvide } = this.props
		this._scene && onRegisterProvide && onRegisterProvide({ scene: this._scene })
	}

	private updateSceneState()
	{
		this.setState({ scene: this._scene })
	}

	private async createScene(switchTo: boolean = true)
	{
		const { opts, id } = this.props

		// Viewer check
		if (!this._viewer)
		{
			console.error('No viewer to create scene')
			return;
		}

		if (opts && opts.view && opts.source && opts.geometry)
		{
			const { source, view, geometry } = opts
			this._scene = this._viewer.createScene({ ...opts, source, view, geometry })
			this._scene.id = id || Date.now()
		}
		else
		{
			this._scene = this._viewer.createEmptyScene({
				view: opts && opts.view ? opts.view : createRectilinearView()
			})
		}
		this.registerProvideToContext()

		this.updateSceneState()
		switchTo && this.switchToScene()

		return this._scene
	}

	private destroyScene()
	{
		if (this._viewer && this._scene)
		{
			viewerExist(this._viewer) && sceneExist(this._scene) && this._viewer.destroyScene(this._scene)
			this._scene = null
			this.updateSceneState()
		}
	}

	private switchToScene()
	{
		this._scene && this._scene.switchTo();
	}

	public render()
	{
		return this.state.scene ? this.props.children : null
	}
}

export default createMarzipanoComponent<SceneProps, Scene>(Scene, { provider: true, marzipanoReadonlyProps });
