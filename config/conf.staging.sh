#!/bin/bash

env="staging"
region="ap-northeast-2"
bucket_path="s3://config.chektdev.com/dl/manager/config.json"

get_config() {
	aws --region ${region} s3 cp ${bucket_path} ./config.${env}.json
}

set_config() {
	aws --region ${region} s3 cp ./config.${env}.json ${bucket_path}
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
