.PHONY: start
start:
	npm run compile -- --output dist/fpie
	FPIE=dist/fpie eval "echo \"`sed 's/"/\\"/g' README.tmpl.md`\"" > README.md

.PHONY: clean
clean:
	rm -rf dist/
