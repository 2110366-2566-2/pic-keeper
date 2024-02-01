while [ "`docker inspect -f {{.State.Running}} postgresql`" != "true" ]; do     sleep 2; done
