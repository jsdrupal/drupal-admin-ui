#!/bin/sh
set -e

# If a user or group exists at the specified IDs, move them to something else.
NEW_UID=${HOST_UID}
NEW_GID=${HOST_GID}

if grep -q ${NEW_UID} /etc/passwd
then
  # Get next available ID
  NEW_UID=$((HOST_UID + 1))
  while grep -q ${NEW_UID} /etc/passwd
  do
    NEW_UID=$((NEW_UID + 1))
  done
  USERNAME=$(id -nu ${HOST_UID})
  usermod -u ${NEW_UID} ${CONTAINER_USERNAME}
  find / -user ${HOST_UID} -exec chown -h ${CONTAINER_USERNAME} {} \;
fi

if grep -q ":${HOST_GID}:" /etc/group
then
  # Get next available ID
  NEW_GID=$((HOST_GID + 1))
  while grep -q ":${NEW_GID}:" /etc/group
  do
    NEW_GID=$((NEW_GID + 1))
  done
  GROUPNAME=$(grep ":${HOST_GID}:" /etc/group | cut -f1 -d:)
  groupmod -g ${NEW_GID} ${GROUPNAME}
  find / -group ${HOST_GID} -exec chgrp -h ${GROUPNAME} {} \;
fi

# Adds a user and a corresponding group, and adds the user to sudoers.
groupadd -g ${HOST_GID} ${NAME}
useradd -u ${HOST_UID} -d /var/www -g ${HOST_GID} ${NAME}
usermod -a -G wheel ${NAME}
