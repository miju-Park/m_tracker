const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.2bpsavtW.js","app":"_app/immutable/entry/app.DxHPVC8b.js","imports":["_app/immutable/entry/start.2bpsavtW.js","_app/immutable/chunks/entry.Cs_RBm1p.js","_app/immutable/chunks/scheduler.V_dLXim4.js","_app/immutable/chunks/index.D9EdNdi9.js","_app/immutable/entry/app.DxHPVC8b.js","_app/immutable/chunks/scheduler.V_dLXim4.js","_app/immutable/chunks/index.GUsb2XqM.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-BiTHKYpS.js')),
			__memo(() => import('./chunks/1-MQLU8W_o.js')),
			__memo(() => import('./chunks/2-jiugCxYs.js')),
			__memo(() => import('./chunks/3-C2cRMOD3.js')),
			__memo(() => import('./chunks/4-BArEoSQ4.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/input",
				pattern: /^\/input\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
