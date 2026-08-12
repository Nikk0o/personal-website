{ pkgs ? import <nixpkgs> {} }:
pkgs.stdenv.mkDerivation {
	pname = "lagarto-gay-frontend";
	version = "1.0";
	src = ./.;

	buildPhase = "";

	installPhase = ''
		mkdir -p $out/
		cp * $out -r'';
}
