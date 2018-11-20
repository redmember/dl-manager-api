#!/bin/bash

env="production"
region="us-east-2"
bucket_path="s3://config.chekt.com/dl/log/awslogs.conf"

get_config() {
	aws --region ${region} s3 cp ${bucket_path} ./log.${env}.conf
}

set_config() {
	aws --region ${region} s3 cp ./log.${env}.conf ${bucket_path}
}

case $1 in
	get)
		get_config
		;;
	set)
		set_config
		;;
	*)
		echo "Usage: $0 {get|set}"
		exit 1;
		;;
esac
