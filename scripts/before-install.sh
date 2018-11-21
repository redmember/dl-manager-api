#!/bin/bash

script_full_path=$(realpath "$0")
common_path=$(dirname "${script_full_path}")
common_filename="${common_path}/common.sh"
config_filename="${common_path}/../config/config.json"

if [ ! -f "${common_filename}" ]; then
	logger "[CHEKT] common script file not found - pwd : $(pwd), path: ${common_filename}"
	exit 1
fi

source "${common_filename}"

message "before-install start ${config_filename}"

slack_message "Service Deploy Starting" "${config_filename}"

pm2 stop "${PM2_CONF_PATH}"

[ -d "${APP_DIR}" ] && rm -rf "${APP_DIR}"

message "before-install end"

exit 0
