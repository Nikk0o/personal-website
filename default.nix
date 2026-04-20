{ pkgs ? import <nixpkgs> {}, ... }:
let jekyll = pkgs.jekyll;
    bundler = pkgs.bundler;
in
	pkgs.stdenv.mkDerivation {
		name = "Niko personal website";
		src = ./src;

		nativeBuildInputs = [ jekyll bundler ];

		buildPhase = ''
			jekyll build
		'';

		installPhase = ''
			mkdir $out -p
			cp ./_site/* $out -r

			mkdir $out/bin
			echo -e "#!/bin/bash\n${jekyll}/bin/jekyll serve --destination $out --port 4000 --skip-initial-build" > $out/bin/run
			chmod +777 $out/bin/run
		'';
	}
