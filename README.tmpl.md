# File Packer Include/Exclude 2

\`\`\`
$(./$FPIE --help)
\`\`\`

## Why?
FPIE is designed to generate optimal contexts for Docker building 
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

We build \`project\` by piping the output of FPIE into Docker, like this: 

\`\`\`
src/project$ cat .includefile
project/
lib/
!**/node_modules/
src/project$ fpie .. .includefile | docker build -f-
\`\`\`
