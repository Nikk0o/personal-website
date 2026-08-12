{ pkgs ? import <nixpkgs> {} }:
pkgs.buildNpmPackage {
	name = "lagarto-gay-backend";
	src = ./.;

	npmDepsHash = "sha256-lGFoCr749mnqWKG0vVvfP5R1ZjTc6/i0h5U69v9izB4=";

	dontNpmBuild = true;

	installPhase = ''
		mkdir -p $out/backend
		cp * $out/backend -r'';
}
