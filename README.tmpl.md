# File Packer Include/Exclude 2
![build](https://github.com/gaggle/fpie2/workflows/build/badge.svg?branch=master)

\`\`\`
$($FPIE2 --help)
\`\`\`

## Why?
FPIE2 is designed to generate optimal contexts for Docker building 
when you want to pull code in from outside current working directory.

Consider the following folder-structure:
\`\`\`
src/
    project/
        .includefile
        Dockerfile
        index.js
        node_modules/
            <thousands of files>
    lib/
        index.js
        node_modules/
            <thousands of files>
\`\`\`

We want to build \`project\`, but also include \`lib\` in the context. 
We don't want the \`node_modules\` folders to be included.

We build \`project\` by piping the output of FPIE2 into Docker, like this: 

\`\`\`
src/project$ cat .includefile
project/
lib/
!**/node_modules/
src/project$ fpie .. .includefile | docker build -f project/Dockerfile -
\`\`\`

## Contributing
This project relies on \`nexe\`
and as such is sensitive to what version of node.js you're running.

I run:
\`\`\`
$ node --version
v.12.16.2
\`\`\`

## Cut a new release
Run \`npm version <major|minor|patch>\` and push, then create a new release in GitHub.
CI will automatically populate the release with binaries.
