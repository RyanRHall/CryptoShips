CURRENT_DIR="${PWD##*/}"
cd ../
for DIR in */; do
  DIR="${DIR%/}"
  if [ "$DIR" = "$CURRENT_DIR" ]; then
    continue;
  fi
  NEW_DIR="${DIR}/build/contracts"
  mkdir -p $NEW_DIR
  cp -f CryptoShips/build/contracts/* $NEW_DIR
done
