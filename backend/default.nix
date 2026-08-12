{ pkgs ? import <nixpkgs> {} }:
pkgs.buildNpmPackage {
	pname = "lagarto-gay-backend";
	version = "1.0";
	src = ./.;

	npmDepsHash = "sha256-lGFoCr749mnqWKG0vVvfP5R1ZjTc6/i0h5U69v9izB4=";

	installPhase = ''
		mkdir -p $out/backend
		cp * $out/backend -r'';
}
