#!/usr/bin/env sh
set -e

BASE="https://github.com/gaggle/fpie2/releases/download"
VERSION=$VERSION
TO="${TO:-.}"

UNAME_OUT="${UNAME_OUT:-$(uname -s)}"
case "${UNAME_OUT}" in
Linux*)
  MACHINE=Linux
  FILENAME=fpie2-linux
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

if [ ${MACHINE} = "Linux" ]; then
  RELEASE_PRETTY_NAME="${RELEASE_PRETTY_NAME:-$(cat /etc/*-release | grep "PRETTY_NAME" | sed 's/PRETTY_NAME=//g')}"
  case "${RELEASE_PRETTY_NAME}" in
  *Alpine*)
    MACHINE=Alpine
    FILENAME=fpie2-alpine
    ;;
  *Ubuntu*)
    MACHINE=Ubuntu
    FILENAME=fpie2-ubuntu
    ;;
  *)
    echo "Unknown Linux: ${RELEASE_PRETTY_NAME}"
    exit 1
    ;;
  esac
fi

URL="${BASE}/${VERSION}/${FILENAME}"
if [ -z "${DRYRUN}" ]; then
  curl -L "${URL}" -o "${TO}/fpie2" && chmod +x "${TO}/fpie2"
else
  echo "Would download ${FILENAME} for ${MACHINE} from ${URL} to ${TO}"
fi
