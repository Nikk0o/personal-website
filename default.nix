{ pkgs ? import <nixpkgs> {} }:
pkgs.stdenv.mkDerivation {
	name = "lagarto-gay";
	dontUnpack = true;

	buildPhase = "";

	installPhase = ''
		mkdir -p $out
		cp frontend $out
		cp backend $out'';
}
