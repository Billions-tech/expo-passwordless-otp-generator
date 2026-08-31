#!/bin/bash
echo "Patching dynamically generated Gradle configurations..."
if [ -d "android" ]; then
  echo 'org.gradle.kotlin.dsl.all.compiler.arguments=-Xskip-metadata-version-check' >> android/gradle.properties
  echo "Gradle properties successfully updated with metadata skip flag."
else
  echo "Error: android directory not found yet."
fi
