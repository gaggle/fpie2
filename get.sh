#!/usr/bin/env sh
set -e

BASE="https://github.com/gaggle/fpie2/releases/download"
VERSION=$VERSION
TO="${TO:-.}"
UNAME_OUT="${UNAME_OUT:-$(uname -s)}"

case "${UNAME_OUT}" in
Linux*)
  MACHINE=Linux
  FILENAME=fpie2-ubuntu
  ;;
Darwin*)
  MACHINE=Mac
  FILENAME=fpie2-macos
  ;;
CYGWIN*) MACHINE=Cygwin ;;
MINGW*) MACHINE=MinGw ;;
*)
  echo "Unknown machine: ${UNAME_OUT}"
  exit 1
  ;;
esac

URL="${BASE}/${VERSION}/${FILENAME}"
if [ -z "${DRYRUN}" ]; then
  curl -L "${URL}" -o "${TO}/fpie2" && chmod +x "${TO}/fpie2"
else
  echo "Downloading ${VERSION} of ${FILENAME} for ${MACHINE} from ${URL} to ${TO}"
fi
