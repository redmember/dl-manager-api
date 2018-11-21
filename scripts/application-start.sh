#!/bin/bash

script_full_path=$(realpath "$0")
script_path=$(dirname "${script_full_path}")
common_path="${script_path}/common.sh"

if [ ! -f "${common_path}" ]; then
	logger "[CHEKT] common script file not found"
	exit 1
fi

source "${common_path}"

message "application-start start ${common_path}"

dir_cleanup() {
	[ "$1" == "" ] && return
	[ -d "$1" ] || mkdir -p "$1"
	rm -f "$1/*"
}

batch_exec() {
  local batch_file_path="${script_path}/batch.sh"

  [ ! -f "${batch_file_path}" ] && return

  chmod 755 "${batch_file_path}"
  ${batch_file_path} 2>&1 &
}

dir_cleanup "${LOG_DIR}"

pm2 restart "${PM2_CONF_PATH}"
pm2 save

message "application-start end"

slack_message "Service Deploy Completed"

batch_exec

exit 0
