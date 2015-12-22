# Gulp-Project

#Prérequis
- Installer nodejs
- Installer les modules nécessaires (package.json)

 > npm install

#Tâche principale
- Lancer le projet (synchronisation browser)

 > gulp ou gulp default

#Autres tâches
- Builder la version prod du projet (supprime tout avant de recréer) 
 > gulp build 

- Supprimer le répertoire de prod
> gulp clean

- Supprimer le répertoire de prod sauf les images
> gulp clean:dist

#Note
- Rajouter les html à inclure dans gulpfile.js (au niveau de la tâche fileinclude)
