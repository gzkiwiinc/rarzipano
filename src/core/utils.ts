import { MarzipanoImageUrlSourceFromTile, MarzipanoFlatViewParams, MarzipanoFlatViewLimiter, IMarzipano, MarzipanoRectilinearViewParams, MarzipanoRectilinearViewLimiter, MarzipanoLevelPropertiesListItem, MarzipanoViewer, MarzipanoScene, MarzipanoLayer, MarzipanoHotspotContainer } from '../marzipanoTypes';
const Marzipano: IMarzipano = require('marzipano');
export const defaultMaxResolution = 8192;
export const defaultMaxVFov = 130 * Math.PI / 180;
export const defaultRectilinearViewParams: MarzipanoRectilinearViewParams = {
	yaw: 0,
	pitch: 0,
	roll: 0,
	fov: 110 * Math.PI / 180// Math.PI / 4,
}
export const defaultRectilinearViewLimiter: MarzipanoRectilinearViewLimiter = Marzipano.RectilinearView.limit.traditional(defaultMaxResolution, defaultMaxVFov);
export const defaultLevelPropertiesList = [
	{ tileSize: 256, size: 256, fallbackOnly: true },
	{ tileSize: 256, size: 512 },
	{ tileSize: 256, size: 1024 },
	{ tileSize: 256, size: 2048 },
	{ tileSize: 256, size: 4096 },
	{ tileSize: 256, size: 8192 },
]

export function generateSourceFromTile(urlPrefix: string): MarzipanoImageUrlSourceFromTile
{
	const previewUrl = urlPrefix + "/preview.jpg";
	const tileUrl = function (f, z, x, y)
	{
		return urlPrefix + `/${f}/l${z}/${y}/l${z}_${f}_${y}_${x}.jpg`
	};
	return (tile) =>
	{
		if (tile.z === 0)
		{
			const mapY = 'lfrbud'.indexOf(tile.face) / 6;
			return { url: previewUrl, rect: { x: 0, y: mapY, width: 1, height: 1 / 6 } };
		} else
		{
			return { url: tileUrl(tile.face, tile.z + 1, tile.x + 1, tile.y + 1) };
		}
	}
}

export function createFlatView(params: MarzipanoFlatViewParams, limiter?: MarzipanoFlatViewLimiter)
{
	const view = limiter ? new Marzipano.FlatView(params, limiter) : new Marzipano.FlatView(params);
	return view
}

export function createRectilinearView(params: MarzipanoRectilinearViewParams = defaultRectilinearViewParams, limiter: MarzipanoRectilinearViewLimiter = defaultRectilinearViewLimiter)
{
	const view = limiter ? new Marzipano.RectilinearView(params, limiter) : new Marzipano.RectilinearView(params);
	return view
}

export function createCubeGeometry(levelPropertiesList: MarzipanoLevelPropertiesListItem[] = defaultLevelPropertiesList)
{
	// Create geometry
	const geometry = new Marzipano.CubeGeometry(levelPropertiesList);
	return geometry
}

export function createImageUrlSource(sourceFromTile: MarzipanoImageUrlSourceFromTile)
{
	// Create source
	const source = new Marzipano.ImageUrlSource((tile) =>
	{
		return sourceFromTile && sourceFromTile(tile)
	});
	return source
}

export function layerExist(layer: MarzipanoLayer | null): boolean
{
	return !!(layer && layer.source() && layer.geometry())
}

export function sceneExist(scene: MarzipanoScene | null): boolean
{
	return !!(scene && scene.view())
}

export function viewerExist(viewer: MarzipanoViewer | null): boolean
{
	return !!(viewer && viewer.domElement())
}

export function hotspotContainerExist(hotspotContainer: MarzipanoHotspotContainer | null)
{
	return !!(hotspotContainer && hotspotContainer.domElement())
}

/**
 * 设置全景Layer清晰度
 * @param layer Marzipano Layer
 * @param level 允许加载的最大level(为null/undefined时允许zoom到最高level, 即最高清)
 */
export function setFixedLevel(layer: MarzipanoLayer, level?: number)
{
	const geometry = layer.geometry();
	const levelList: any[] = geometry && geometry.levelList || [];
	if (!layer)
	{
		console.warn('SetFixedLevel failed, layer does not exist')
		return;
	}
	if (level === undefined || level === null || level >= levelList.length)
	{
		if (layer.fixedLevel() !== undefined && layer.fixedLevel() !== null)
		{
			layer.setFixedLevel(null);
		}
	} else
	{
		if (layer.fixedLevel() !== level)
		{
			layer.setFixedLevel(level);
		}
	}
}
