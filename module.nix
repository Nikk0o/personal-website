{ lib, pkgs, config, ... }:
let cfg = config.services.lagarto-gay; in
{
	options = {

    services.lagarto-gay = {

			enable = lib.mkEnableOption "Run the server";

			rootPath = lib.mkOption {
				description = "The directory where the server will be installed";
				type = lib.types.str;
			};
		};
	};

	config = lib.mkIf cfg.enable {

		# Node to run the backend
		systemPackages = [
			nodejs
			./default.nix { inherit cfg.rootPath pkgs }
		];

		systemd.services.serverBackend = {
			ExecStart = "node ${cfg.rootPath}/backend/index.js";
			Type = "exec";
		};

		services.nginx = {
			enable = true;

			virtualHosts."leksu.sh" = {
				root = "${cfg.rootPath}/frontend";

				locations."/api".proxyPass = "http://localhost:3000";
			};
		};
	};
}
