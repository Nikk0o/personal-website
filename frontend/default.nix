{ pkgs ? import <nixpkgs> {} }:
pkgs.buildNpmPackage {
	pname = "lagarto-gay";
	version = "1.0";
	src = ./.;

	buildPhase = "";

	npmDepsHash = "sha-256";

	installPhase = ''
		mkdir -p $out/
		cp * $out -r'';
}
