VERSION=`node -p -e "require('./package.json').version"`

.PHONY: default
default:
	@echo clean fix test

.PHONY: clean
clean:
	rm -rf dist/

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
