#!/bin/bash

echo "🧹 Nettoyage du projet..."

# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# # Arrêter et supprimer les containers, volumes et orphelins
# docker-compose down -v --remove-orphans

# Reconstruire sans cache
# echo "⚙️  Reconstruction des images..."
# docker-compose build --no-cache

# # Lancer les services
# echo "🚀 Démarrage des services..."
# docker-compose up
