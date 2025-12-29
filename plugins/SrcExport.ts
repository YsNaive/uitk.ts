import { Plugin } from 'vite';
import * as fs from 'fs';
import * as path from 'path';

export function SrcExport(): Plugin {
    let srcDir: string;
    let indexFile: string;

    const excludeFiles = ['index.ts', 'main.ts', 'main.js'];

    function generateIndex() {
        const exportEntries: string[] = [];

        function walk(dir: string) {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                const relativePath = path.relative(srcDir, fullPath).replace(/\\/g, '/');

                if (entry.isDirectory()) {
                    walk(fullPath);
                } else if (
                    (entry.name.endsWith('.ts') || entry.name.endsWith('.js')) &&
                    !excludeFiles.includes(entry.name)
                ) {
                    const withoutExt = relativePath.replace(/\.(ts|js)$/, '');
                    exportEntries.push(`export * from \'./${withoutExt}\';`);
                }
            }
        }

        walk(srcDir);

        fs.writeFileSync(indexFile, exportEntries.join('\n'), 'utf8');
    }

    return {
        name: 'src-export',
        apply: 'serve', // 僅在 dev 時啟用監聽
        configResolved(config) {
            srcDir = path.resolve(config.root, 'src');
            indexFile = path.join(srcDir, 'index.ts');
        },
        buildStart() {
            generateIndex();
        },
        configureServer(server) {
            // 監聽 src 目錄檔案新增、刪除、改名事件
            server.watcher.add(srcDir);
            server.watcher.on('add', pathChanged);
            server.watcher.on('unlink', pathChanged);
            server.watcher.on('addDir', pathChanged);
            server.watcher.on('unlinkDir', pathChanged);

            function pathChanged(filePath: string) {
                if (!filePath.startsWith(srcDir)) return;
                generateIndex();
            }
        }
    };
}
