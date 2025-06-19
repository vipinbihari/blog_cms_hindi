#!/bin/bash

# Script to update blog content from the separate content repository
# This script is used both for local development and CI/CD

# Debug output to help troubleshoot
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Check if we're in GitHub Actions environment
if [ -n "$GITHUB_ACTIONS" ]; then
    echo "Running in GitHub Actions environment"
fi

POSTS_DIR="src/content/posts"
UPLOADS_DIR="public/images/uploads"

# Ensure directories exist
mkdir -p $POSTS_DIR
mkdir -p $UPLOADS_DIR

# Check all possible content locations
if [ -d "content/posts" ]; then
    echo "Found content in ./content/posts"
    CONTENT_REPO_PATH="content"
    # Copy content from the checkout
    echo "Syncing posts from content repository..."
    rsync -av --delete "$CONTENT_REPO_PATH/posts/" "$POSTS_DIR/"
    
    if [ -d "content/uploads" ]; then
        echo "Syncing uploads from content repository..."
        rsync -av --delete "$CONTENT_REPO_PATH/uploads/" "$UPLOADS_DIR/"
    else
        echo "Warning: uploads directory not found in content repository"
    fi
    
    echo "Content updated successfully!"
    exit 0
elif [ -d "../blog_content_hindi/posts" ]; then
    echo "Found content in ../blog_content_hindi/posts"
    CONTENT_REPO_PATH="../blog_content_hindi"
    # Copy content from the local repo
    echo "Syncing posts from content repository..."
    rsync -av --delete "$CONTENT_REPO_PATH/posts/" "$POSTS_DIR/"
    
    if [ -d "$CONTENT_REPO_PATH/uploads" ]; then
        echo "Syncing uploads from content repository..."
        rsync -av --delete "$CONTENT_REPO_PATH/uploads/" "$UPLOADS_DIR/"
    else
        echo "Warning: uploads directory not found in content repository"
    fi
    
    echo "Content updated successfully!"
    exit 0
else
    echo "Warning: Content repository not found in expected locations"
    echo "Searched in: ./content/posts and ../blog_content_hindi/posts"
    
    # List contents of potential parent directories for debugging
    echo "\nContents of ./content (if exists):"
    ls -la content 2>/dev/null || echo "content directory doesn't exist"
    
    echo "\nContents of ../blog_content_hindi (if exists):"
    ls -la ../blog_content_hindi 2>/dev/null || echo "../blog_content_hindi directory doesn't exist"
    
    # In GitHub Actions, let's continue even if content repo is missing
    if [ -n "$GITHUB_ACTIONS" ]; then
        echo "GitHub Actions detected - continuing build with empty content directories"
        echo "This will create a site structure without blog posts"
        exit 0
    else
        echo "Error: Content repository required for local development"
        exit 1
    fi
fi
