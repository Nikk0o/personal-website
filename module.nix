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

		environment.systemPackages = [
			front
			back
		];

		systemd.services.runBackend = {
			after = [ "network.target" ];
			path = [ pkgs.nodejs ];
			serviceConfig.ExecStart = ''${pkgs.nodejs}/bin/node index.js'';

			serviceConfig = {
				Type = "exec";
				WorkingDirectory = "${back}";
			};
		};

		services.nginx = {
			enable = true;

			virtualHosts."leksu.sh" = {
				root = "${front}";

				locations."/api/".proxyPass = "http://localhost:3000/";
			};
		};
	};
}
