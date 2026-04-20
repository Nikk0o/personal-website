{ pkgs ? import <nixpkgs> {}, ... }:
	pkgs.stdenv.mkDerivation {
		name = "Niko's personal website";
		src = ./.;

		buildInputs = with pkgs; [ jekyll bundler ];
		buildPhase = ''
			jekyll build
		'';

		installPhase = ''
			mv ./_site/* $out
			jekyll serve -d $out -p 4000
		'';
	}
