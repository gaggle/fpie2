# File Packer Include/Exclude 2
![build](https://github.com/gaggle/fpie2/workflows/build/badge.svg?branch=master)

```
Usage: fpie2 [OPTIONS] <CONTEXTDIR> <INCLUDEFILE>

FPIE2 tarballs a directory based on glob-patterns in an include/exclude-file

Options:
  --print-files		Print files to be included instead of emitting tarball

INCLUDEFILE syntax:
  Each line is a rule to include or exclude filepath(s) in CONTEXTDIR,
  and paths are defined relative to the context path.
  You can include a file:
    > some-file
  Or all files in a folder:
    > some-dir/
  (you can also use a trailing * to specify a directory, i.e. "some-dir/*")
  Prepend "!" for exclusions:
    > !some-file-to-exclude
  Or exclude an entire directory:
    > !some-dir-to-exclude/
  All entries are expanded as glob patterns, e.g.:
    > **/package.json
    > !**/node_modules
  Comments are lines that start with "#":
    > # This is a comment
```

## Why?
FPIE2 is designed to generate optimal contexts for Docker building 
when you want to pull code in from outside current working directory.

Consider the following folder-structure:
```
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
```

We want to build `project`, but also include `lib` in the context. 
We don't want the `node_modules` folders to be included.

We build `project` by piping the output of FPIE2 into Docker, like this: 

```
src/project$ cat .includefile
project/
lib/
!**/node_modules/
src/project$ fpie .. .includefile | docker build -f project/Dockerfile -
```

## Contributing
This project relies on `nexe`
and as such is sensitive to what version of node.js you're running.

I run:
```
$ node --version
v.12.16.2
```

## Cut a new release
Run `npm version <major|minor|patch>` and push, then create a new release in GitHub.
CI will automatically populate the release with binaries.
