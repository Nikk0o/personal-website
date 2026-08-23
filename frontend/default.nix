{ pkgs ? import <nixpkgs> {} }:
pkgs.buildNpmPackage {
	pname = "lagarto-gay";
	version = "1.0";
	src = ./.;

	buildPhase = "";

	npmDepsHash = "sha256-IFF8nCEWutMeefA6hcjwNbkytb+2nRyJY2+iXBsvBEY=";

	installPhase = ''
		mkdir -p $out/
		cp * $out -r'';
}
