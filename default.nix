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
		'';
	}
