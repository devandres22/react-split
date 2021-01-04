import React from 'react';
import CodePreview, { CodePreviewProps } from '@uiw/react-code-preview';

const regxOpts = /^;\{\{\/\*\*(.+?)\*\*\/\}\};/g;

export interface CodeProps {
  language: string;
  value: string;
  dependencies: any;
}

export default function Code({ language, value, dependencies, ...other }: CodeProps) {
  const props: CodePreviewProps = {};
  let onlyPreview: boolean = false;
  if(/\^(js|jsx)/.test(language) || !regxOpts.test(value)) {
    onlyPreview = true;
  }
  props.code = value.replace(regxOpts, '');
  const propsStr = value.match(regxOpts);
  if (propsStr && propsStr[0] && RegExp.$1) {
    try {
      const propsArr: CodePreviewProps[] = JSON.parse(RegExp.$1);
      propsArr.forEach((item) => {
        Object.keys(item).forEach((keyName) => {
          if (keyName === 'codeSandbox') {
            props['codeSandboxOption'] = {
              files: {
                'sandbox.config.json': {
                  content: `{
                "template": "node",
                "container": {
                  "startScript": "start",
                  "node": "14"
                }
              }`,
                },
                'public/index.html': {
                  content: `<div id="container"></div>`,
                },
                'src/index.js': {
                  content: props.code!.replace(
                    '_mount_',
                    'document.getElementById("container")',
                  ),
                },
                '.kktrc.js': {
                  content: `import webpack from "webpack";\nimport lessModules from "@kkt/less-modules";\nexport default (conf, env, options) => {\nconf = lessModules(conf, env, options);\nreturn conf;\n};`,
                },
                'package.json': {
                  content: {
                    name: 'uiw-demo',
                    description: `uiw split - demo`,
                    dependencies: {
                      react: 'latest',
                      'react-dom': 'latest',
                      '@uiw/react-split': 'latest',
                      'uiw': '4.7.2',
                    },
                    devDependencies: {
                      '@kkt/less-modules': '6.0.x',
                      kkt: '6.0.11',
                      typescript: '4.1.3',
                    },
                    license: 'MIT',
                    scripts: {
                      start: 'kkt start',
                      build: 'kkt build',
                      test: 'kkt test --env=jsdom',
                    },
                    browserslist: [
                      '>0.2%',
                      'not dead',
                      'not ie <= 11',
                      'not op_mini all',
                    ],
                  },
                },
              },
            }
            return;
          }
          if (keyName === 'codePen') {
            props['codePenOption'] = {
              title: `uiw - demo`,
              includeModule: ['uiw'],
              js: props.code!.replace('_mount_', 'document.getElementById("container")'),
              html: '<div id="container" style="padding: 24px"></div>',
              css_external: `https://unpkg.com/uiw@4.7.2/dist/uiw.min.css`,
              js_external: `https://unpkg.com/react@16.x/umd/react.development.js;https://unpkg.com/react-dom@16.x/umd/react-dom.development.js;https://unpkg.com/classnames@2.2.6/index.js;https://unpkg.com/uiw@4.7.2/dist/uiw.min.js;https://unpkg.com/@uiw/codepen-require-polyfill@1.0.2/index.js`,
            };
            return;
          }
          props[keyName as keyof CodePreviewProps] = item[keyName as keyof CodePreviewProps];
        })
      });
    } catch (error) {}
  }
  if (onlyPreview) {
    const className = language ? `language-${language}` : '';
    return (
      <pre className={className}>
        {props.code && <code className={className}>{props.code}</code>}
      </pre>
    );
  }
  console.log('props>>>>', props)
  return (
    <CodePreview {...props} language={language} dependencies={dependencies} />
  );
}
