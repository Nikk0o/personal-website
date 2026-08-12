{ pkgs ? import <nixpkgs> {} }:
pkgs.buildNpmPackage {
	name = "lagarto-gay-backend";
	src = ./.;

	npmDepsHash = "sha256-rAopIuxC5ShPv3QvYAFgdeXBL+VMAdbx1WcMWAQculc=";

	installPhase = ''
		mkdir -p $out/backend
		cp * $out/backend -r'';
}
