import * as React from "react";
import { IMarzipano, MarzipanoLayer, MarzipanoScene, MarzipanoImageUrlSourceOpts, MarzipanoLevelPropertiesListItem, MarzipanoImageUrlSourceFromTile, MarzipanoSceneCreateLayerOpts, MarzipanoSource, MarzipanoGeometry, MarzipanoTextureStoreOpts, MarzipanoLayerOpts } from '../marzipanoTypes';
import { Layer } from "..";
import { defaultLevelPropertiesList, createCubeGeometry, createImageUrlSource } from '../core/utils';
import createMarzipanoComponent, { MarzipanoComponentChildContext } from '../core/component';
const Marzipano: IMarzipano = require('marzipano');

const marzipanoReadonlyProps: (keyof MarzipanoReadOnlyProps)[] = [
	"scene",
	"sourceFromTile",
	"sourceOpts",
	"levelPropertiesList",
	"pinFirstLevel",
	"textureStoreOpts",
	"layerOpts"
];

interface MarzipanoReadOnlyProps
{
	scene?: MarzipanoScene;
	sourceFromTile: MarzipanoImageUrlSourceFromTile;
	sourceOpts?: MarzipanoImageUrlSourceOpts;
	levelPropertiesList?: MarzipanoLevelPropertiesListItem[];
	pinFirstLevel?: boolean;
	textureStoreOpts?: MarzipanoTextureStoreOpts;
	layerOpts?: MarzipanoLayerOpts
}

// tslint:disable-next-line no-empty-interface
interface LayerProps extends MarzipanoReadOnlyProps
{
}

interface State
{
	layer: MarzipanoLayer | null;
}

interface DefaultProps
{
	levelPropertiesList: MarzipanoLevelPropertiesListItem[];
}

class MultiresolutionCubeLayer extends React.Component<LayerProps & MarzipanoComponentChildContext & DefaultProps, State> {
	static defaultProps: DefaultProps = {
		levelPropertiesList: defaultLevelPropertiesList,
	};
	private _source: MarzipanoSource;
	private _geometry: MarzipanoGeometry;
	private _opts: MarzipanoSceneCreateLayerOpts;
	constructor(props: LayerProps & MarzipanoComponentChildContext & DefaultProps)
	{
		super(props);
		const { sourceFromTile, levelPropertiesList, pinFirstLevel, textureStoreOpts, layerOpts } = props;
		this._source = createImageUrlSource(sourceFromTile)
		this._geometry = createCubeGeometry(levelPropertiesList)
		this._opts = {
			source: this._source,
			geometry: this._geometry,
			pinFirstLevel,
			textureStoreOpts,
			layerOpts,
		}
		this.state = {
			layer: null
		}
	}

	public render()
	{
		return (
			<Layer opts={this._opts}>
				{this.props.children}
			</Layer>
		);
	}
}

export default createMarzipanoComponent<LayerProps, MultiresolutionCubeLayer>(MultiresolutionCubeLayer, { marzipanoReadonlyProps });
