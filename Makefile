VERSION=`node -p -e "require('./package.json').version"`

.PHONY: default
default:
	@echo clean docker-build docker-publish fix test

.PHONY: clean
clean:
	rm -rf dist/

.PHONY: docker-build
docker-build:
	docker pull jonlauridsen/node-nexe:10-alpine || true
	docker build -f docker-images/node-nexe-10-alpine.Dockerfile --cache-from jonlauridsen/node-nexe:10-alpine -t jonlauridsen/node-nexe:10-alpine .

.PHONY: docker-publish
docker-publish:
	docker push jonlauridsen/node-nexe:10-alpine

.PHONY: fix
fix: _readme-fix

.PHONY: test
test: _readme-check
	npm test

_readme-check:
	tmp=`mktemp -d /tmp/fpie2.XXXXXX`;\
	  (npm run compile -- --output $${tmp}/fpie2\
	  && FPIE2=$${tmp}/fpie2 eval "echo \"`sed 's/"/\\"/g' README.tmpl.md`\"" > $${tmp}/README.md)\
	  && cmp --silent $${tmp}/README.md README.md || (echo "README.md is out of date, run \"make fix\"" && exit 1)

_readme-fix:
	tmp=`mktemp -d /tmp/fpie2.XXXXXX`;\
	  npm run compile -- --output $${tmp}/fpie2\
	  && FPIE2=$${tmp}/fpie2 eval "echo \"`sed 's/"/\\"/g' README.tmpl.md`\"" > README.md
