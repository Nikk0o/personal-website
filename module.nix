{ lib, pkgs, config, ... }:
let cfg = config.services.lagarto-gay; in
{
	options = {

    services.lagarto-gay = {

			enable = lib.mkEnableOption "Run the server";
		};
	};

	config =
	let
		front = (pkgs.callPackage ./frontend/default.nix { inherit pkgs; });
		back  = (pkgs.callPackage ./backend/default.nix { inherit pkgs; });
	in
	lib.mkIf cfg.enable {

		# Node to run the backend
		environment.systemPackages = [
			pkgs.nodejs
			front
			back
		];

		systemd.services.runBackend = {
			after = [ "network.target" ];
			serviceConfig.ExecStart = ''
				cd ${back}
				${pkgs.npm}/bin/npm i
				${pkgs.nodejs}/bin/node ${back}/index.js
			'';

			serviceConfig.Type = "exec";
		};

		services.nginx = {
			enable = true;

			virtualHosts."leksu.sh" = {
				locations."/".root = "${front}";
				locations."/api/".proxyPass = "http://localhost:3000/";
			};
		};
	};
}
