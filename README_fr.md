# JSRUN

<div align="center">

<img src="src/jsrun.png" alt="JSRUN Logo" width="200" height="auto">

**L'outil CLI ultime pour exécuter facilement des scripts  `.jsr`, JavaScript, TypeScript.**

⚡ Concentrez-vous sur vos scripts et laissez JSRUN s'occuper du reste ! ⚡

[![npm version](https://badge.fury.io/js/jsrun-cli.svg)](https://badge.fury.io/js/jsrun-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/jsrun-cli.svg)](https://www.npmjs.com/package/jsrun-cli)

</div>

---

## ✨ Fonctionnalités

- **Gestion automatique des modules** : Installe automatiquement les dépendances manquantes.
- **Contrôle de version** : Spécifiez les numéros de version directement dans vos imports.
- **Mise en cache pour la vitesse** : Les modules mis en cache localement réduisent le temps d'installation.
- **Journalisation colorée** : Journaux clairs et colorés grâce à `chalk`.
- **Gestion des erreurs** : Messages d'erreur complets pour un dépannage facile.
- **Extensible** : Personnalisable et prêt pour l'expansion.

---

## 🔧 Installation

### Prérequis

- **Node.js** : Assurez-vous d'utiliser la version 14 ou supérieure de Node.js. [Obtenez Node.js ici](https://nodejs.org/).

### Installation via npm

```bash
npm install -g jsrun-cli
```

---

## 🚀 Utilisation

### Exécuter un script

Exécutez n'importe quel script pris en charge par JSRUN :

```bash
jsrun monscript.jsr
```

Extensions prises en charge : `.jsr`, `.js`, `.mjs`, `.ts`.

### Importer des modules avec des versions

```javascript
import express from "express@4.17.1";
import chalk from "chalk@4.1.2";

console.log(chalk.green("Démarrage du serveur..."));
const app = express();
app.get("/", (req, res) => res.send("Bonjour le monde!"));
app.listen(3000, () =>
  console.log(chalk.blue("Serveur en cours d'exécution sur le port 3000"))
);
```

**Exécutez le script :**

```bash
jsrun serveur.jsr
```

### Passer des arguments à votre script

```bash
jsrun monscript.jsr --port=4000 --env=production
```

Dans votre script :

```javascript
const args = process.argv.slice(2);
const port =
  args.find((arg) => arg.startsWith("--port="))?.split("=")[1] || 3000;
const env =
  args.find((arg) => arg.startsWith("--env="))?.split("=")[1] || "development";

console.log(`Exécution sur le port ${port} en mode ${env}.`);
```

---

## 🧹 Nettoyer les packages installés

```bash
jsrun --clean
```

---

## 🎯 Explication des fonctionnalités clés

- **Mise en cache des performances** : Met en cache les modules localement dans `~/.jsrun/node_modules` pour accélérer les exécutions ultérieures.
- **Journalisation colorée** : Utilise `chalk` pour des retours colorés (Vert pour le succès, Jaune pour les avertissements, Rouge pour les erreurs et Bleu pour le statut).
- **Gestion des erreurs** : Fournit des messages d'erreur détaillés, simplifiant le débogage et la résolution des problèmes.

---

## 📝 Pourquoi JSRUN ?

JSRUN a été créé pour faciliter l'exécution de scripts JavaScript et TypeScript avec des modules, sans les tracas de la gestion des `node_modules`. Au lieu d'installer manuellement des packages à chaque fois, JSRUN s'occupe de tout pour vous. Il installe automatiquement les dépendances nécessaires, vous permettant de créer et d'exécuter des scripts exécutables de n'importe où avec une configuration minimale.

Ne vous inquiétez plus de la gestion des `node_modules`, concentrez-vous simplement sur l'écriture et l'exécution de vos scripts, et laissez JSRUN s'occuper du reste !

---

## 📂 Exemples

Explorez le répertoire `/examples` pour des cas d'utilisation et des exemples de scripts `.jsr`.

## 🛠️ Dépannage

### Problèmes courants

1. **Module non trouvé** : Assurez-vous que les noms et versions des modules sont corrects.
2. **Permission refusée** : Utilisez des privilèges élevés ou ajustez la propriété du dossier `~/.jsrun`.
3. **Erreurs de syntaxe** : Vérifiez que votre syntaxe JavaScript/TypeScript est correcte. Utilisez la version appropriée de Node.js.
4. **Problèmes de réseau** : Vérifiez votre connexion réseau ou essayez d'installer manuellement le module.

---

## ❓ FAQ

1. **Pourquoi `.jsr` ?**  
    `.jsr` met en évidence les scripts spécifiquement conçus pour `jsrun`.

2. **Puis-je utiliser des fichiers `.js` ?**  
    Oui, les fichiers `.js` sont pris en charge, mais `.jsr` est recommandé pour plus de clarté.

3. **Où sont installés les modules ?**  
    Dans le répertoire de cache `~/.jsrun/node_modules`.

4. **Comment mettre à jour `jsrun` ?**  
    Exécutez `npm update -g jsrun-cli`.

---

## 🤝 Contribuer

1. **Forkez le dépôt**
2. **Créez une nouvelle branche**
3. **Apportez vos modifications**
4. **Poussez votre branche**
5. **Soumettez votre Pull Request**

---

## 📜 Licence

`jsrun` est sous licence [MIT License](LICENSE).

---

## ✉️ Contact

Des questions ou des commentaires ? [contactez-moi](https://github.com/benoitpetit/).

---

## 📚 Documentation in English

For the English documentation, please refer to [this link](/README.md).
