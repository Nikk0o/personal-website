{ pkgs ? import <nixpkgs> {} }:
pkgs.buildNpmPackage {
	name = "lagarto-gay-backend";
	src = ./.;

	installPhase = ''
		mkdir -p $out/backend
		cp * $out/backend -r'';
}
