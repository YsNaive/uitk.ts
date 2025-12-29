
import { defineConfig } from 'vite';
import { SrcExport } from './plugins/SrcExport';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'uitk',
            fileName: (format) => `uitk.${format}.js`
        },
        outDir: 'dist/lib',
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: [],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {}
            }
        }
    },
    plugins: [
        SrcExport(),
        dts({
            insertTypesEntry: true,
            rollupTypes: true
        })
    ]
});
