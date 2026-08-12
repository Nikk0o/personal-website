{ pkgs ? import <nixpkgs> {} }:
pkgs.stdenv.mkDerivation {
	name = "lagarto-gay-frontend";
	src = ./.;

	installPhase = ''
		mkdir -p $out/frontend
		cp * $out/frontend -r'';
}
