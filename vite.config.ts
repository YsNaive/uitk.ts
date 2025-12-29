// vite.config.ts

import { defineConfig } from 'vite';
import { SrcExport } from './plugins/SrcExport';

export default defineConfig({
    plugins: [SrcExport()]
});
