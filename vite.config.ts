import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths(), nodePolyfills()],
	// define: {
	// 	'process.env': process.env,
	// 	global: 'globalThis',
	// },
	// resolve: {
	// 	alias: {
	// 		// process: 'process/browser',
	// 		buffer: 'buffer',
	// 		// crypto: 'crypto-browserify',
	// 		// stream: 'stream-browserify',
	// 		// assert: 'assert',
	// 		// http: 'stream-http',
	// 		// https: 'https-browserify',
	// 		// os: 'os-browserify',
	// 		// url: 'url',
	// 		// util: 'util',
	// 	},
	// },
})
