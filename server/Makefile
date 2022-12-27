CWD := $(abspath $(patsubst %/,%,$(dir $(abspath $(lastword $(MAKEFILE_LIST))))))
RELEASE_DIR := $(CWD)/target/release
build:
	cargo build --release
install: 
	# Really scuffed way to create the service file
	rm watchwithfriends.service -f
	touch watchwithfriends.service
	echo "[Service]" >> watchwithfriends.service
	echo "ExecStart=$(RELEASE_DIR)/watchwithfriends-4" >> watchwithfriends.service
	echo "Type=simple" >> watchwithfriends.service
	echo "WorkingDirectory=$(RELEASE_DIR)" >> watchwithfriends.service
	echo "Restart=Always" >> watchwithfriends.service
	echo "RestartSec=5" >> watchwithfriends.service
	echo "StandardOutput=syslog" >> watchwithfriends.service
	echo "StandardError=syslog" >> watchwithfriends.service
	echo "SyslogIdentifier=%n" >> watchwithfriends.service
	echo "\n[Install]\nWantedBy=multi-user.target" >> watchwithfriends.service
	cp watchwithfriends.service /etc/systemd/system
	# Reload daemons and restart server
	systemctl daemon-reload
	systemctl enable watchwithfriends.service
	systemctl restart watchwithfriends.service	
clean:
	rm watchwithfriends.service -f
	cargo clean
