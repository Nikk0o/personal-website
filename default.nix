{ pkgs ? import <nixpkgs> {} }:
pkgs.stdenv.mkDerivation {
	name = "lagarto-gay";
	src = ./.;

	buildPhase = "";

	installPhase = ''
		mkdir -p $out
		cp frontend $out
		cp backend $out'';
}
