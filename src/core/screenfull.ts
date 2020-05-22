/**
 * Refrernce: https://www.marzipano.net/demos/common/screenfull.js
 */
export interface IScreenFull
{
	request: (elem?: any) => Promise<unknown>;
	exit: () => Promise<unknown>;
	toggle: (elem?: any) => any;
	onchange: (callback: any) => void;
	onerror: (callback: any) => void;
	on: (event: any, callback: any) => void;
	off: (event: any, callback: any) => void;
	raw: any;
	isFullscreen: boolean;
	element: any;
	enabled: boolean;
}
export default (function ()
{
	const document = window.document; // typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};
	const keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;

	const fn: any = (function ()
	{
		let val;

		const fnMap = [
			[
				'requestFullscreen',
				'exitFullscreen',
				'fullscreenElement',
				'fullscreenEnabled',
				'fullscreenchange',
				'fullscreenerror'
			],
			// New WebKit
			[
				'webkitRequestFullscreen',
				'webkitExitFullscreen',
				'webkitFullscreenElement',
				'webkitFullscreenEnabled',
				'webkitfullscreenchange',
				'webkitfullscreenerror'

			],
			// Old WebKit (Safari 5.1)
			[
				'webkitRequestFullScreen',
				'webkitCancelFullScreen',
				'webkitCurrentFullScreenElement',
				'webkitCancelFullScreen',
				'webkitfullscreenchange',
				'webkitfullscreenerror'

			],
			[
				'mozRequestFullScreen',
				'mozCancelFullScreen',
				'mozFullScreenElement',
				'mozFullScreenEnabled',
				'mozfullscreenchange',
				'mozfullscreenerror'
			],
			[
				'msRequestFullscreen',
				'msExitFullscreen',
				'msFullscreenElement',
				'msFullscreenEnabled',
				'MSFullscreenChange',
				'MSFullscreenError'
			]
		];

		let i = 0;
		const l = fnMap.length;
		const ret = {};

		for (; i < l; i++)
		{
			val = fnMap[i];
			if (val && val[1] in document)
			{
				for (i = 0; i < val.length; i++)
				{
					ret[fnMap[0][i]] = val[i];
				}
				return ret;
			}
		}

		return false;
	})();

	const eventNameMap = {
		change: fn.fullscreenchange,
		error: fn.fullscreenerror
	};

	const screenfull: any = {
		request(elem?: any)
		{
			return new Promise((resolve) =>
			{

				const request = fn.requestFullscreen;

				const onFullScreenEntered = () =>
				{
					this.off('change', onFullScreenEntered);
					resolve();
				};

				elem = elem || document.documentElement;

				// Work around Safari 5.1 bug: reports support for
				// keyboard in fullscreen even though it doesn't.
				// Browser sniffing, since the alternative with
				// setTimeout is even worse.
				if (/ Version\/5\.1(?:\.\d+)? Safari\//.test(navigator.userAgent))
				{
					elem[request]();
				} else
				{
					const E: any = Element
					elem[request](keyboardAllowed ? E.ALLOW_KEYBOARD_INPUT : {});
				}

				this.on('change', onFullScreenEntered);
			});
		},
		exit()
		{
			return new Promise((resolve) =>
			{
				const onFullScreenExit = () =>
				{
					this.off('change', onFullScreenExit);
					resolve();
				};

				document[fn.exitFullscreen]();

				this.on('change', onFullScreenExit);
			});
		},
		toggle(elem?: any)
		{
			return this.isFullscreen ? this.exit() : this.request(elem);
		},
		onchange(callback)
		{
			this.on('change', callback);
		},
		onerror(callback)
		{
			this.on('error', callback);
		},
		on(event, callback)
		{
			const eventName = eventNameMap[event];
			if (eventName)
			{
				document.addEventListener(eventName, callback, false);
			}
		},
		off(event, callback)
		{
			const eventName = eventNameMap[event];
			if (eventName)
			{
				document.removeEventListener(eventName, callback, false);
			}
		},
		raw: fn,
	};

	Object.defineProperties(screenfull, {
		isFullscreen: {
			get()
			{
				return Boolean(document[fn.fullscreenElement]);
			}
		},
		element: {
			enumerable: true,
			get()
			{
				return document[fn.fullscreenElement];
			}
		},
		enabled: {
			enumerable: true,
			get()
			{
				// Coerce to boolean in case of old WebKit
				return Boolean(document[fn.fullscreenEnabled]);
			}
		}
	});

	const reault: IScreenFull = screenfull

	return reault
})();
