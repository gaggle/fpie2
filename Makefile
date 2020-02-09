.PHONY: start
start:
	npm run compile
	eval "echo \"`sed 's/"/\\"/g' README.tmpl.md`\"" > README.md

.PHONY: clean
clean:
	rm -rf dist/
