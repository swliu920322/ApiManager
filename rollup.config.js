import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import less from 'rollup-plugin-less';

export default {
    input: {
        apiManager: 'entry/reducer/index.tsx',
        sdk: 'configs/sdk.ts'
    },
    output: {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].js',
    },
    external: ['react'],
    plugins: [
        resolve({
            browser: true
        }),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            useTsconfigDeclarationDir: true,
            clean: true,
        }),
        less({
            output: 'dist/styles.css', // 输出的 CSS 文件路径
            insert: true // 将生成的 CSS 插入到 HTML 文件中
        }),
    ]
};