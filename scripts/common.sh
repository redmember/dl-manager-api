#!/bin/bash

PATH=/sbin:/usr/sbin:/bin:/usr/bin:/usr/local/bin
APP_DIR="/var/dlapi"
# shellcheck disable=SC2034
PM2_CONF_PATH="${APP_DIR}/pm2/process.json"
# shellcheck disable=SC2034
LOG_DIR="/var/log/dlapi"
APP_CONF_DIR="${APP_DIR}/config"
APP_CONF_PATH="${APP_CONF_DIR}/config.json"
# shellcheck disable=SC2034
APP_NAME="DL API"
# shellcheck disable=SC2034
AWSLOGS_GROUP_NAME="/chekt/dlapi"
SYSLOG_PREFIX="[CHEKT]"

eval "$(wget -q -O - http://169.254.169.254/latest/user-data)"

message() {
	logger "${SYSLOG_PREFIX} ${NODE_ENV} $1"
}

slack_message() {
	local conf_path=${APP_CONF_PATH}

	[ ! -z "${2}" ] && conf_path=${2}

	if [ ! -f "${conf_path}" ]; then
		message "salck config file not found"
		return
	fi

	local url
	local sendTime
	local timestamp

  url=$(jq -r .notification.slack.webhookUrl "${conf_path}")
	sendTime=$(date +%Y-%m-%dT%H:%M:%S%:z)
	timestamp=$(date +%s)

	local project="{\"title\":\"Project\",\"value\":\"CHeKT\",\"short\":true}"
	local env="{\"title\":\"Environment\",\"value\":\"${NODE_ENV}\",\"short\":true}"
	local hostname="{\"title\":\"Hostname\",\"value\":\"${HOSTNAME}\",\"short\":true}"
	local starttime="{\"title\":\"StartTime\",\"value\":\"${sendTime}\",\"short\":true}"
	local fields="[${project},${env},${hostname},${starttime}]"
	local payload="{\"text\": \"$1\",\"color\":\"#FF8000\",\"ts\":\"${timestamp}\",\"fields\":${fields}}"
	local body="{\"attachments\": [${payload}]}"

	curl -s -d "${body}" "${url}" > /dev/null 2>&1
}
