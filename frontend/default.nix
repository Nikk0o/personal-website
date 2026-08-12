{ pkgs ? import <nixpkgs> {} }:
pkgs.stdenv.mkDerivation {
	name = "lagarto-gay-frontend";
	src = ./.;

	buildPhase = "";

	installPhase = ''
		mkdir -p $out/frontend
		cp * $out/frontend -r'';
}
