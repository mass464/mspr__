# Monitoring PayeTonKawa

Ce dossier contient la configuration complète du monitoring pour la plateforme PayeTonKawa.

## 🎯 Objectifs du Monitoring

Le monitoring permet aux administrateurs de visualiser en temps réel :

- **Nombre d'appels HTTP par API** : Toutes les requêtes vers chaque service
- **Codes de statut HTTP** : Répartition des codes 200, 400, 500, etc.
- **Temps moyens d'exécution** : Performance des appels HTTP
- **Messages RabbitMQ** : Nombre de messages échangés par file d'attente

## 🏗️ Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Auth Service│    │Product Svc  │    │Order Service│
│   :5000     │    │   :5001     │    │   :5002     │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌─────────────┐
                    │ Prometheus  │
                    │   :9090     │
                    └─────────────┘
                           │
                    ┌─────────────┐
                    │   Grafana   │
                    │   :3000     │
                    └─────────────┘
```

## 📊 Métriques Collectées

### Métriques HTTP (tous services)
- `http_requests_total` : Nombre total de requêtes par méthode, route et code
- `http_request_duration_seconds` : Temps de réponse par méthode, route et code

### Métriques RabbitMQ (service order)
- `rabbitmq_messages_published_total` : Messages publiés par file
- `rabbitmq_messages_consumed_total` : Messages consommés par file

## 🚀 Démarrage Rapide

### 1. Démarrer le monitoring
```bash
cd monitoring
chmod +x start-monitoring.sh
./start-monitoring.sh
```

### 2. Accéder aux interfaces
- **Grafana** : http://localhost:3000 (admin/admin)
- **Prometheus** : http://localhost:9090

### 3. Dashboard automatique
Le dashboard "PayeTonKawa - Dashboard Monitoring" est automatiquement créé dans Grafana.

## 📈 Dashboard Grafana

Le dashboard inclut les panneaux suivants :

1. **Requêtes HTTP par seconde** : Taux de requêtes en temps réel
2. **Temps de réponse 95e percentile** : Performance des services
3. **Codes de statut HTTP** : Répartition des codes de réponse
4. **Requêtes par route** : Trafic par endpoint
5. **Messages RabbitMQ publiés** : Activité de publication
6. **Messages RabbitMQ consommés** : Activité de consommation
7. **Requêtes par service** : Répartition par service

## 🔧 Configuration

### Prometheus
- **Fichier** : `prometheus.yml`
- **Port** : 9090
- **Rétention** : 200h

### Grafana
- **Port** : 3000
- **Utilisateur** : admin
- **Mot de passe** : admin
- **Dashboard** : Chargement automatique

## 🛑 Arrêt

```bash
cd monitoring
chmod +x stop-monitoring.sh
./stop-monitoring.sh
```

## 🔍 Vérification

### Vérifier les métriques Prometheus
```bash
# Vérifier que les services exposent leurs métriques
curl http://localhost:5000/metrics  # Auth service
curl http://localhost:5001/metrics  # Product service
curl http://localhost:5002/metrics  # Order service
```

### Vérifier Prometheus
- Aller sur http://localhost:9090
- Dans "Status" > "Targets", vérifier que tous les services sont "UP"

### Vérifier Grafana
- Aller sur http://localhost:3000
- Se connecter avec admin/admin
- Le dashboard PayeTonKawa devrait être visible

## 🐛 Dépannage

### Services non visibles dans Prometheus
1. Vérifier que les services sont démarrés
2. Vérifier la connectivité réseau
3. Vérifier les ports dans `prometheus.yml`

### Dashboard vide dans Grafana
1. Vérifier que Prometheus collecte des données
2. Vérifier la source de données Prometheus dans Grafana
3. Vérifier les requêtes PromQL dans les panneaux

### Métriques manquantes
1. Vérifier que `prom-client` est installé dans tous les services
2. Vérifier que le middleware de monitoring est actif
3. Vérifier les logs des services

## 📝 Logs

### Prometheus
```bash
docker logs prometheus
```

### Grafana
```bash
docker logs grafana
```

## 🔄 Mise à jour

Pour mettre à jour le monitoring :

1. Arrêter : `./stop-monitoring.sh`
2. Modifier les configurations
3. Redémarrer : `./start-monitoring.sh`

## 📚 Ressources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [prom-client Documentation](https://github.com/siimon/prom-client) 