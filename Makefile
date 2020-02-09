.PHONY: start
start:
	npm run compile
	eval "echo \"`sed 's/"/\\"/g' README.tmpl.md`\"" > README.md
