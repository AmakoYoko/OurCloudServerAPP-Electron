# OurCloud Server APP Electron 

Application serveur pour le projet OurCloud, basée sur ElectronJS, cette application capture l'image du serveur et l'a met à disposition sur un P2P WRTC


# Installation
## Dépendances 
* OpenSSL
* VS 2017 (Windows)
* NodeJS & npm

>git clone https://github.com/AmakoYoko/OurCloudServerAPP
>npm init

Vous devez éditer le fichier "node_modules/robotjs/src/keypress.c" et remplacer le contenu par ce qui est dans "/keypress_source.c"
>Set-ExecutionPolicy -ExecutionPolicy Bypass 
>npm rebuild --runtime=electron --target=17.0.0 --disturl=https://atom.io/download/atom-shell --abi=101 
>npm start "APP NAME"

