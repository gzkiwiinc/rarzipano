import * as React from "react";
import
{
	MarzipanoScene,
	MarzipanoHotspot,
	MarzipanoRectilinearViewCoords,
	MarzipanoFlatViewCoords,
	IPerspective,
	MarzipanoHotspotContainer,
	MarzipanoViewer,
} from '../marzipanoTypes';
import createMarzipanoComponent, { MarzipanoComponentChildContext } from "../core/component";
import { sceneExist, hotspotContainerExist } from '../core/utils';

const marzipanoReadonlyProps: (keyof MarzipanoReadOnlyProps)[] = [];

// tslint:disable-next-line no-empty-interface
interface MarzipanoReadOnlyProps { }

interface HotspotProps extends MarzipanoReadOnlyProps
{
	coords: MarzipanoRectilinearViewCoords | MarzipanoFlatViewCoords;
	perspective?: IPerspective;
	zLevel?: number;
	visible?: boolean;
}

interface HotspotState
{
	style?: React.CSSProperties
}

export class Hotspot extends React.Component<HotspotProps & MarzipanoComponentChildContext, HotspotState> {

	private _viewer: MarzipanoViewer | null;
	public _scene: MarzipanoScene | null;
	private _hotspotContainer: MarzipanoHotspotContainer | null;
	public _hotspot: MarzipanoHotspot | null;

	constructor(props: HotspotProps & MarzipanoComponentChildContext)
	{
		super(props);
		this._viewer = props.marzipanoContext.viewer || null
		this._scene = props.marzipanoContext.scene ? props.marzipanoContext.scene : this._viewer ? this._viewer.scene() : null
		this._hotspotContainer = this._scene ? this._scene.hotspotContainer() : null
		this.hotspotContainerStyleSetting(this._hotspotContainer)
		this.state = {
			style: {
				position: 'relative',
				width: '1px',
				height: '1px',
				zIndex: props.zLevel || 1,
			}
		}
	}

	/**
	 * https://www.cnblogs.com/reaf/p/5788781.html
	 * safari浏览器transform变换z-index层级渲染异常, 给父级元素设置overflow:hidden可解决
	 */
	private hotspotContainerStyleSetting(hotspotContainer: MarzipanoHotspotContainer | null)
	{
		if (hotspotContainer && hotspotContainer._hotspotContainerWrapper)
		{
			const domElement = hotspotContainer.domElement()
			hotspotContainer._hotspotContainerWrapper.style.width = '100%'
			hotspotContainer._hotspotContainerWrapper.style.height = '100%'
			domElement.style.width = '100%'
			domElement.style.height = '100%'
			domElement.style.overflow = 'hidden'
		}
		else
		{
			console.warn('hotspotContainerStyleSetting fail', hotspotContainer)
		}
	}

	private async createHotspot()
	{
		const { coords, perspective } = this.props
		const hotspot = this.refs["hotspot"];
		if (this._scene && this._hotspotContainer)
		{
			const opts = perspective && { perspective }
			this._hotspot = this._hotspotContainer.createHotspot(hotspot, coords, opts)
		}
	}

	private destroyHotspot()
	{
		if (this._scene && this._hotspotContainer && this._hotspot)
		{
			sceneExist(this._scene) && hotspotContainerExist(this._hotspotContainer) && this._hotspotContainer.destroyHotspot(this._hotspot)
			this._hotspot = null
		}
	}

	public render()
	{
		const { style } = this.state
		return (
			<section>
				<div
					ref="hotspot"
					style={style}
				>
					{this.props.children}
				</div>
			</section>
		)
	}

	public componentDidMount()
	{
		this.createHotspot();
	}

	public async componentDidUpdate(prevProps: HotspotProps & MarzipanoComponentChildContext)
	{
		const { coords, perspective, zLevel, visible } = this.props
		if (coords && coords !== prevProps.coords)
		{
			this._hotspot && this._hotspot.setPosition(coords)
		}

		if (perspective && perspective !== prevProps.perspective)
		{
			this._hotspot && this._hotspot.setPerspective(perspective)
		}

		if (visible !== prevProps.visible)
		{
			this._hotspot && (visible ? this._hotspot.show() : this._hotspot.hide())
		}

		if (zLevel !== prevProps.zLevel)
		{
			const oldStyle = this.state.style
			this.setState({
				style: {
					...oldStyle,
					zIndex: zLevel,
				}
			})
		}
	}

	public componentWillUnmount()
	{
		this.destroyHotspot();
	}
}

export default createMarzipanoComponent<HotspotProps, Hotspot>(Hotspot, { marzipanoReadonlyProps })


