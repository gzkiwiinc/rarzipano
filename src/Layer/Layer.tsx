import * as React from "react";
import { MarzipanoScene, MarzipanoLayer, MarzipanoSceneCreateLayerOpts } from '../marzipanoTypes';
import createMarzipanoComponent, { MarzipanoComponentChildContext } from "../core/component";
import { layerExist, sceneExist } from '../core/utils';

const marzipanoReadonlyProps: (keyof MarzipanoReadOnlyProps)[] = [
	"scene",
	"opts",
];

interface MarzipanoReadOnlyProps
{
	scene?: MarzipanoScene;
	opts: MarzipanoSceneCreateLayerOpts;
}

// tslint:disable-next-line no-empty-interface
interface LayerProps extends MarzipanoReadOnlyProps { }

interface State
{
	layer: MarzipanoLayer | null;
}

class Layer extends React.Component<LayerProps & MarzipanoComponentChildContext, State> {
	private _scene: MarzipanoScene | null;
	private _layer: MarzipanoLayer | null;
	static defaultProps = {
	};
	constructor(props: LayerProps & MarzipanoComponentChildContext)
	{
		super(props);
		this._scene = props.scene ? props.scene : props.marzipanoContext.scene ? props.marzipanoContext.scene : null
		this.state = {
			layer: null
		}
	}

	public componentDidMount()
	{
		this.createLayer();
	}

	public componentWillUnmount()
	{
		this.destroyLayer();
	}

	private registerProvideToContext()
	{
		const { onRegisterProvide } = this.props
		this._layer && onRegisterProvide && onRegisterProvide({ layer: this._layer })
	}

	private updateLayerState()
	{
		this.setState({ layer: this._layer })
	}

	private async createLayer()
	{
		const { opts } = this.props

		// Scene check
		if (!this._scene)
		{
			console.error('No scene to create layer')
			return;
		}

		if (opts)
		{
			this._layer = this._scene.createLayer(opts)
			this.updateLayerState()
		}

		this.registerProvideToContext()

		return this._layer
	}

	private destroyLayer()
	{
		if (this._scene && this._layer)
		{
			sceneExist(this._scene) && layerExist(this._layer) && this._scene.destroyLayer(this._layer)
			this._layer = null
			this.updateLayerState()
		}
	}

	public render()
	{
		return this.state.layer ? this.props.children : null
	}
}

export default createMarzipanoComponent<LayerProps, Layer>(Layer, { provider: true, marzipanoReadonlyProps });
