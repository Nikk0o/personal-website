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
		srvpkg = (pkgs.callPackage ./default.nix { inherit pkgs; });
	in
	lib.mkIf cfg.enable {

		# Node to run the backend
		environment.systemPackages = [
			pkgs.nodejs
			srvpkg
		];

		systemd.services.serverBackend = {
			after = [ "network.target" ];
			serviceConfig.ExecStart = "node ${srvpkg}/backend/index.js";
			serviceConfig.Type = "exec";
		};

		services.nginx = {
			enable = true;

			virtualHosts."leksu.sh" = {
				root = "${srvpkg}/frontend";
			};

			virtualHosts."api" = {
				locations."/api".proxyPass = "http://localhost:3000";
			};
		};
	};
}
