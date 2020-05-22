/**
 * API: https://www.marzipano.net/reference/
 */
export type MarzipanoMouseViewMode = 'drag' | 'qtvr'
export interface IMarzipano
{
	Controls: MarzipanoControlsConstructor;
	CubeGeometry: MarzipanoCubeGeometryConstructor;
	DynamicAsset: MarzipanoDynamicAssetConstructor;
	FlatView: MarzipanoFlatViewConstructor;
	Hotspot: MarzipanoHotspotConstructor;
	HotspotContainer: MarzipanoHotspotContainerConstructor;
	ImageUrlSource: MarzipanoImageUrlSourceConstructor;
	Layer: MarzipanoLayerConstructor;
	RectilinearView: MarzipanoRectilinearViewConstructor;
	RenderLoop: MarzipanoRenderLoopConstructor;
	Scene: MarzipanoSceneConstructor;
	SingleAssetSource: MarzipanoSingleAssetSourceConstructor;
	StaticAsset: MarzipanoStaticAssetConstructor;
	TextureStore: MarzipanoTextureStoreConstructor;
	Viewer: MarzipanoViewerConstructor;
	// Global
	autorotate: (opts: MarzipanoAutorotateOpts) => () => any; // return Movement function that can be passed to Viewer#setIdleMovement or Scene#startMovement
	calcRect: (totalWidth: number, totalHeight: number, spec: MarzipanoRectSpec, result: MarzipanoRect) => MarzipanoRect;
	registerDefaultControls: (controls: MarzipanoControls, element: any, opts: any, mouseViewMode: MarzipanoMouseViewMode) => void;
	registerDefaultRenderers: (stage: MarzipanoStage) => void;
}

export type MarzipanoView = MarzipanoFlatView | MarzipanoRectilinearView

/**
 * Namespaces
 */
export interface MarzipanoFlatViewLimit
{
	letterbox: () => MarzipanoFlatViewLimiter,
	resolution: (size: number) => MarzipanoFlatViewLimiter,
	visibleX: (min: number, max: number) => MarzipanoFlatViewLimiter,
	visibleY: (min: number, max: number) => MarzipanoFlatViewLimiter,
	x: (min: number, max: number) => MarzipanoFlatViewLimiter,
	y: (min: number, max: number) => MarzipanoFlatViewLimiter,
	zoom: (min: number, max: number) => MarzipanoFlatViewLimiter,
}

export interface MarzipanoRectilinearViewLimit
{
	hfov: (min: number, max: number) => MarzipanoRectilinearViewLimiter,
	pitch: (min: number, max: number) => MarzipanoRectilinearViewLimiter,
	resolution: (size: number) => MarzipanoRectilinearViewLimiter,
	roll: (min: number, max: number) => MarzipanoRectilinearViewLimiter,
	traditional: (maxResolution: number, maxVFov: number, maxHFov?: number) => MarzipanoRectilinearViewLimiter,
	vfov: (min: number, max: number) => MarzipanoRectilinearViewLimiter,
	yaw: (min: number, max: number) => MarzipanoRectilinearViewLimiter,
}


/**
 * Classes
 */
type MarzipanoControlsConstructor = new () => MarzipanoControls;
export interface MarzipanoControls
{
	addMethodGroup: (groupId: string, methodIds: string[]) => void;
	attach: (renderLoop: MarzipanoRenderLoop) => void;
	attached: () => boolean;
	destroy: () => void;
	detach: () => void;
	disable: () => void;
	disableMethod: (id: string) => void;
	disableMethodGroup: (groupId: string) => void;
	enable: () => void;
	enabled: () => boolean;
	enableMethod: (id: string) => void;
	enableMethodGroup: (groupId: string) => void;
	method: (id: string) => MarzipanoControlMethod;
	methodGroups: () => any[];
	methods: () => MarzipanoControlMethod[];
	registerMethod: (id: string, instance: MarzipanoControlMethod, enable: boolean) => void;
	removeMethodGroup: (groupId: string) => void;
	unregisterMethod: (id: string) => void;
}

type MarzipanoCubeGeometryConstructor = new (levelPropertiesList: MarzipanoLevelPropertiesListItem[]) => MarzipanoCubeGeometry;
export interface MarzipanoLevelPropertiesListItem
{
	size: number;
	tileSize: number;
}
export interface MarzipanoCubeGeometry
{
	type: string;
	visibleTiles: (view: MarzipanoView, level: any) => MarzipanoTile[]
}

type MarzipanoDynamicAssetConstructor = new (element: HTMLImageElement | HTMLCanvasElement | ImageBitmap) => MarzipanoDynamicAsset;
export interface MarzipanoDynamicAsset extends MarzipanoStaticAsset
{
	destroy: () => void;
	element: () => any;
	height: () => number;
	isDynamic: () => boolean;
	markDirty: () => void;
	timestamp: () => number;
	width: () => number;
}

interface MarzipanoFlatViewConstructor
{
	new(params: MarzipanoFlatViewParams, limiter?: MarzipanoFlatViewLimiter): MarzipanoFlatView;
	// Namespaces
	limit: MarzipanoFlatViewLimit,
}
export interface MarzipanoFlatView extends MarzipanoViewBase
{
	// Member
	type: string;
	// Methods
	coordinatesToScreen: (coords: MarzipanoFlatViewCoords, result?: MarzipanoCoords) => MarzipanoCoords;
	destroy: () => void;
	height: () => number;
	intersects: (rectangle: any) => void;
	inverseProjection: () => any;
	limiter: () => MarzipanoFlatViewLimiter | null;
	mediaAspectRatio: () => number;
	offsetX: (xOffset: number) => void;
	offsetY: (yOffset: number) => void;
	offsetZoom: (zoomOffset: number) => void;
	parameters: (paramsopt?: MarzipanoFlatViewParams) => MarzipanoFlatViewParams;
	projection: () => any;
	screenToCoordinates: (coords: MarzipanoCoords, result?: MarzipanoFlatViewCoords) => MarzipanoFlatViewCoords;
	selectLevel: (levelList: any[]) => any;
	setLimiter: (limiter?: MarzipanoFlatViewLimiter) => void;
	setMediaAspectRatio: (mediaAspectRatio: number) => void;
	setParameters: (params: MarzipanoFlatViewParams) => void;
	setSize: (size: MarzipanoSize) => void;
	setX: (x: number) => void;
	setY: (y: number) => void;
	setZoom: (zoom: number) => void;
	size: (size?: MarzipanoSize) => void;
	width: () => number;
	x: () => number;
	y: () => number;
	zoom: () => number;
}

export interface MarzipanoHotspotOpts
{
	perspective: IPerspective
}

export interface IPerspective
{
	radius?: number;
	extraTransforms?: string;
}

type MarzipanoHotspotConstructor = new (domElement: any, view: MarzipanoView, coords: MarzipanoRectilinearViewCoords | MarzipanoFlatViewCoords, opts: MarzipanoHotspotOpts) => MarzipanoHotspot;
export interface MarzipanoHotspot
{
	destroy: () => void;
	domElement: () => any;
	hide: () => void;
	perspective: () => object;
	position: () => object;
	setPerspective: (perspective: object) => void;
	setPosition: (position: object) => void;
	show: () => void;
}

type MarzipanoHotspotContainerConstructor = new (parentDomElement: any, stage: MarzipanoStage, view: MarzipanoView, renderLoop: MarzipanoRenderLoop, opts: MarzipanoHotspotContainerOpts) => MarzipanoHotspotContainer;
export interface MarzipanoHotspotContainerOpts
{
	rect: MarzipanoRectSpec
}
export interface MarzipanoHotspotContainer
{
	_parentDomElement: any;
	_hotspotContainerWrapper: any;
	createHotspot(domElement: any, coords: MarzipanoRectilinearViewCoords | MarzipanoFlatViewCoords, opts?: MarzipanoHotspotOpts): MarzipanoHotspot;
	destroy: () => void;
	destroyHotspot: (hotspot: MarzipanoHotspot) => void;
	domElement: () => any;
	hasHotspot: (hotspot: MarzipanoHotspot) => boolean;
	hide: () => void;
	listHotspots: () => MarzipanoHotspot[];
	rect: () => MarzipanoRect;
	setRect: (rect: MarzipanoRect) => void;
	show: () => void;
	// Events
	addEventListener: (name: 'hotspotsChange', fn: () => any) => void;
	removeEventListener: (name: 'hotspotsChange', fn: () => any) => void;

}

type MarzipanoImageUrlSourceConstructor = new (sourceFromTile: MarzipanoImageUrlSourceFromTile, opts?: MarzipanoImageUrlSourceOpts) => MarzipanoImageUrlSource;
export interface MarzipanoImageUrlSourceOpts
{
	concurrency?: number,
	retryDelay?: number,
}
export type MarzipanoImageUrlSourceFromTile = (tile: any) => { url: string, rect?: MarzipanoRect }
export interface MarzipanoImageUrlSource
{
	fromString: (url: string, opts: {
		cubeMapPreviewUrl: string;
		cubeMapPreviewFaceOrder?: string;
	}) => any;
	loadAsset: (stage: MarzipanoStage, tile: MarzipanoTile, done: () => any) => () => any;
}

type MarzipanoLayerConstructor = new (source: MarzipanoSource, geometry: MarzipanoGeometry, view: MarzipanoView, textureStore: MarzipanoTextureStore, opts?: MarzipanoLayerOpts) => MarzipanoLayer;
export interface MarzipanoLayerOpts
{
	effects: MarzipanoEffects
}
export interface MarzipanoLayer
{
	destroy: () => void;
	effects: () => MarzipanoEffects;
	fixedLevel: () => number | null;
	geometry: () => MarzipanoGeometry;
	mergeEffects: (effects: MarzipanoEffects) => void;
	pinFirstLevel: () => void;
	pinLevel: (levelIndex: number) => void;
	setEffects: (effects: MarzipanoEffects) => void;
	setFixedLevel: (levelIndex: number | null) => void;
	source: () => MarzipanoSource;
	textureStore: () => MarzipanoTextureStore;
	unpinFirstLevel: () => void;
	unpinLevel: (levelIndex: number) => void;
	view: () => MarzipanoView;
	// Events
	addEventListener: (name: 'renderComplete', fn: () => any) => void;
	removeEventListener: (name: 'renderComplete', fn: () => any) => void;
}

interface MarzipanoRectilinearViewConstructor
{
	new(params: MarzipanoRectilinearViewParams, limiter?: MarzipanoRectilinearViewLimiter): MarzipanoRectilinearView;
	// Namespaces
	limit: MarzipanoRectilinearViewLimit,
}
export interface MarzipanoRectilinearView extends MarzipanoViewBase
{
	// Member
	type: string;
	// Methods
	coordinatesToPerspectiveTransform: (coords: MarzipanoRectilinearViewCoords, radius: number, extraTransforms: string) => string;
	coordinatesToScreen: (coords: MarzipanoRectilinearViewCoords, result?: MarzipanoCoords) => MarzipanoCoords;
	destroy: () => void;
	fov: () => number;
	height: () => number;
	intersects: (rectangle: any) => void;
	inverseProjection: () => any;
	limiter: () => MarzipanoRectilinearViewLimiter | null;
	normalizeToClosest: (coords: MarzipanoRectilinearViewCoords, result: MarzipanoRectilinearViewCoords) => void;
	offsetFov: (fovOffset: number) => void;
	offsetPitch: (pitchOffset: number) => void;
	offsetRoll: (rollOffset: number) => void;
	offsetYaw: (yawOffset: number) => void;
	parameters: (obj?: MarzipanoRectilinearViewParams) => MarzipanoRectilinearViewParams;
	pitch: () => number;
	projection: () => any;
	roll: () => number;
	screenToCoordinates: (coords: MarzipanoCoords, result?: MarzipanoRectilinearViewCoords) => MarzipanoRectilinearViewCoords;
	selectLevel: (levelList: any[]) => any;
	setFov: (fov: number) => void;
	setLimiter: (limiter: MarzipanoRectilinearViewLimiter | null) => void;
	setParameters: (params: MarzipanoRectilinearViewParams) => void;
	setPitch: (pitch: number) => void;
	setRoll: (roll: number) => void;
	setSize: (size: MarzipanoSize) => void;
	setYaw: (yaw: number) => void;
	size: (size?: MarzipanoSize) => MarzipanoSize;
	width: () => number;
	yaw: () => number;
}

type MarzipanoRenderLoopConstructor = new (stage: MarzipanoStage) => MarzipanoRenderLoop;
export interface MarzipanoRenderLoop
{
	destroy: () => void;
	renderOnNextFrame: () => void;
	stage: () => MarzipanoStage;
	start: () => void;
	stop: () => void;
	// Events
	addEventListener: (name: 'afterRender' | 'beforeRender', fn: () => any) => void;
	removeEventListener: (name: 'afterRender' | 'beforeRender', fn: () => any) => void;
}

type MarzipanoSceneConstructor = new (viewer: MarzipanoViewer, view: MarzipanoFlatView | MarzipanoRectilinearView) => MarzipanoScene;
export interface MarzipanoSceneCreateLayerOpts
{
	source: MarzipanoSource;
	geometry: MarzipanoGeometry;
	pinFirstLevel?: boolean;
	textureStoreOpts?: MarzipanoTextureStoreOpts;
	layerOpts?: MarzipanoLayerOpts;
}
export interface MarzipanoSceneLookToOpts
{
	ease?: () => any,
	controlsInterrupt?: boolean;
	transitionDuration?: number;
	closest?: boolean;
}
export interface MarzipanoScene
{
	id: number;
	createLayer: (opts: MarzipanoSceneCreateLayerOpts) => MarzipanoLayer;
	destroy: () => void;
	destroyAllLayers: () => void;
	destroyLayer: (layer: MarzipanoLayer) => void;
	hotspotContainer: () => MarzipanoHotspotContainer;
	layer: () => MarzipanoLayer;
	listLayers: () => MarzipanoLayer[];
	lookTo: (
		params: any,
		opts: MarzipanoSceneLookToOpts,
		done?: () => any
	) => void;
	movement: () => () => any;
	startMovement: (fn: () => any, done: () => any) => void;
	stopMovement: () => void;
	switchTo: (opts?: any, done?: () => any) => void;
	view: () => MarzipanoView;
	viewer: () => MarzipanoViewer;
	visible: () => boolean;
	// Events
	addEventListener: (name: 'layerChange' | 'viewChange', fn: () => any) => void;
	removeEventListener: (name: 'layerChange' | 'viewChange', fn: () => any) => void;
}

type MarzipanoSingleAssetSourceConstructor = new (asset: MarzipanoAsset) => MarzipanoSingleAssetSource;
export interface MarzipanoSingleAssetSource extends MarzipanoAsset
{
	loadAsset: (stage: MarzipanoStage, tile: MarzipanoTile, done: () => any) => () => any
}

type MarzipanoStaticAssetConstructor = new (element: HTMLImageElement | HTMLCanvasElement | ImageBitmap) => MarzipanoStaticAsset;
export interface MarzipanoStaticAsset extends MarzipanoAsset
{
	destroy: () => void;
	element: () => any;
	height: () => number;
	isDynamic: () => boolean;
	timestamp: () => number;
	width: () => number;
}

type MarzipanoTextureStoreConstructor = new (source: MarzipanoSource, stage: MarzipanoStage, opts?: MarzipanoTextureStoreOpts) => MarzipanoTextureStore;
export interface MarzipanoTextureStoreOpts
{
	previouslyVisibleCacheSize: number
}
type MarzipanoTextureStoreEventName = 'textureCancel' | 'textureError' | 'textureInvalid' | 'textureLoad' | 'textureStartLoad' | 'textureUnload'
export interface MarzipanoTextureStore
{
	clear: () => void;
	clearNotPinned: () => void;
	destroy: () => void;
	endFrame: () => void;
	markTile: (tile: MarzipanoTile) => void;
	pin: (tile: MarzipanoTile) => number;
	query: (tile: MarzipanoTile) => MarzipanoTileState;
	source: () => MarzipanoSource;
	stage: () => MarzipanoStage;
	startFrame: () => void;
	unpin: (tile: MarzipanoTile) => number;
	// Events
	addEventListener: (name: MarzipanoTextureStoreEventName, fn: () => any) => void;
	removeEventListener: (name: MarzipanoTextureStoreEventName, fn: () => any) => void;
}

type MarzipanoViewerConstructor = new (domElement: any, opts: MarzipanoViewerOpts) => MarzipanoViewer;
export type MarzipanoStageType = null | 'webgl' | 'css' | 'flash';
export interface MarzipanoViewerOpts
{
	stageType?: MarzipanoStageType
	controls?: { controls?: MarzipanoControls, element?: any, opts?: any, mouseViewMode?: MarzipanoMouseViewMode }; // Options to be passed to registerDefaultControls.
	stage?: any; // Options to be passed to the Stage constructor.
	cursors?: {
		drag: any // Drag cursor options to be passed to the ControlCursor constructor.
	};
}
export interface MarzipanoViewerCreateEmptySceneOpts
{
	view: MarzipanoView,
}
export interface MarzipanoViewerCreateSceneOpts
{
	view: MarzipanoView,
	source: MarzipanoSource,
	geometry: MarzipanoGeometry,
	pinFirstLevel?: boolean,
	textureStoreOpts?: MarzipanoTextureStoreOpts,
	layerOpts?: MarzipanoLayerOpts
}
export type MarzipanoViewerEventName = 'sceneChange' | 'viewChange'
export interface MarzipanoViewer
{
	breakIdleMovement: () => void;
	controls: () => MarzipanoControls;
	createEmptyScene: (opts: MarzipanoViewerCreateEmptySceneOpts) => MarzipanoScene;
	createScene: (opts: MarzipanoViewerCreateSceneOpts) => MarzipanoScene;
	destroy: () => void;
	destroyAllScenes: () => void;
	destroyScene: (scene: MarzipanoScene) => void;
	domElement: () => Element;
	hasScene: (scene: MarzipanoScene) => boolean;
	listScenes: () => MarzipanoScene[];
	lookTo: (opts: MarzipanoSceneLookToOpts, done: () => any) => void;
	movement: () => () => any;
	renderLoop: () => MarzipanoRenderLoop;
	scene: () => MarzipanoScene;
	setIdleMovement(timeout: number, movement: () => any);
	stage: () => MarzipanoStage;
	startMovement: (fn: () => any, done: () => any) => any;
	stopMovement: () => void;
	switchScene: (
		newScene: MarzipanoScene,
		opts: {
			transitionDuration?: number,
			transitionUpdate?: number,
		},
		done: () => any
	) => void;
	updateSize: () => void;
	view: () => MarzipanoView;
	// Event
	addEventListener: (name: MarzipanoViewerEventName, fn: () => any) => void;
	removeEventListener: (name: MarzipanoViewerEventName, fn: () => any) => void;
}

/**
 * Interface
 */
export interface MarzipanoAsset
{
	element: () => any;
	height: () => number;
	isDynamic: () => boolean;
	timestamp: () => number;
	width: () => number;
	// Event
	addEventListener: (name: 'change', fn: () => any) => void;
	removeEventListener: (name: 'change', fn: () => any) => void;
}
export interface MarzipanoControlMethod
{
	// Events
	active: any;
	inactive: any;
	parameterDynamics: any;
}
export interface MarzipanoCoords
{
	x: number;
	y: number;
}
export interface MarzipanoEffects
{
	opacity: number;
	rect: MarzipanoRectSpec;
	colorOffset: any;
	colorMatrix: any;
	textureCrop: MarzipanoRect;
}
export interface MarzipanoFlatViewCoords
{
	x: number;
	y: number;
}
export interface MarzipanoFlatViewParams
{
	x: number;
	y: number;
	zoom: number;
	mediaAspectRatio: number
}
export interface MarzipanoGeometry
{
	type: string;
	visibleTiles: (view: MarzipanoView, level: number) => MarzipanoTile[];
	levelList?: any[];
}
export interface MarzipanoImageLoader
{
	loadImage: (url: string, rect: MarzipanoRect | null, done: () => any) => () => any;
}
export interface MarzipanoRect
{
	x: number;
	y: number;
	width: number;
	height: number
}
export interface MarzipanoRectilinearViewCoords
{
	yaw: number;
	pitch: number;
}
export interface MarzipanoRectilinearViewParams
{
	yaw: number;
	pitch: number;
	roll: number;
	fov: number;
}
export interface MarzipanoRectSpec
{
	relativeX: number;
	relativeY: number;
	relativeWidth: number;
	relativeHeight: number
	absoluteX: number;
	absoluteY: number;
	absoluteWidth: number
	absoluteHeight: number;
}
export interface MarzipanoRenderer
{
	endLayer: (layer: MarzipanoLayer, rect: MarzipanoRect) => void;
	renderTile: (tile: MarzipanoTile, texture: any, layer: MarzipanoLayer, layerZ: number) => void;
	startLayer: (layer: MarzipanoLayer, rect: MarzipanoRect) => void
}
export interface MarzipanoSize
{
	width: number;
	height: number
}
export interface MarzipanoSource
{
	loadAsset: (stage: MarzipanoStage, tile: MarzipanoTile, done: () => any) => () => any
}
export interface MarzipanoStage
{
	type: string; // "webgl", "css" and "flash"
	addLayer: (layer: MarzipanoLayer, i: number | undefined) => void;
	createTexture: (tile: MarzipanoTile, asset: MarzipanoAsset, done: () => any) => void;
	destroy: () => void;
	domElement: () => any;
	endFrame: () => any;
	hasLayer: (layer: MarzipanoLayer) => boolean;
	height: () => number;
	listLayers: () => MarzipanoLayer[];
	loadImage: (url: string, rect: MarzipanoRect, done: () => any) => () => any;
	moveLayer: (layer: MarzipanoLayer, i: number) => void;
	registerRenderer: (geometryType: string, viewType: string, Renderer: any) => void;
	removeAllLayers: () => void;
	removeLayer: (layer: MarzipanoLayer) => void;
	render: () => void;
	setSize: (size: MarzipanoSize) => void;
	setSizeForType: (size: MarzipanoSize) => void;
	size: (size?: MarzipanoSize) => void;
	startFrame: () => void;
	validateLayer: (layer: MarzipanoLayer) => void;
	width: () => number;
	// Events
	addEventListener: (name: 'renderComplete' | 'renderInvalid', fn: () => any) => void;
	removeEventListener: (name: 'renderComplete' | 'renderInvalid', fn: () => any) => void;
}
export interface MarzipanoTile
{
	cmp: (that: MarzipanoTile) => number;
	equals: (that: MarzipanoTile) => boolean;
	hash: () => number
}
export interface MarzipanoViewBase
{
	type: string;
	// Events
	addEventListener: (name: 'change' | 'resize', fn: (e?: any) => any) => void;
	removeEventListener: (name: 'change' | 'resize', fn: (e?: any) => any) => void;
}

/**
 * Global
 */
export interface MarzipanoAutorotateOpts
{
	yawSpeed?: number;
	pitchSpeed?: number;
	fovSpeed?: number;
	yawAccel?: number;
	pitchAccel?: number;
	fovAccel?: number;
	targetPitch?: number;
	targetFov?: number;
}
// Type Definitions
export type MarzipanoFlatViewLimiter = (params: MarzipanoFlatViewParams) => MarzipanoFlatViewParams
export type MarzipanoRectilinearViewLimiter = (params: MarzipanoRectilinearViewParams) => MarzipanoRectilinearViewParams
export interface MarzipanoTileState
{
	visible: boolean;
	previouslyVisible: boolean;
	hasAsset: boolean;
	hasTexture: boolean;
	pinned: boolean;
	pinCount: boolean;
}
