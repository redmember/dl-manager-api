#!/bin/bash

common_path="/var/alarm/scripts/common.sh"

if [ ! -f "${common_path}" ]; then
	logger "[CHEKT] common script file not found(slack)"
	exit 0
fi

source "${common_path}"

message "$1"

slack_message "$1"

exit 0
