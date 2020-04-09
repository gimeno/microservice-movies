#!/bin/bash

echo "===> Building ..."
npm run build

echo "===> Running ... "
exec serve -s build