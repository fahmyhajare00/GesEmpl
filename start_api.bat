@echo off
echo Fermeture des anciens processus PHP...
wsl -e bash -c "killall php"
echo Nettoyage du cache et demarrage de l'API Laravel...
echo L'API va demarrer, NE FERMEZ PAS CETTE FENETRE !
wsl -e bash -c "cd /mnt/c/Users/hp/gesempl/cmc-data-api/cmc-data-api && php artisan optimize:clear && php artisan serve --host=0.0.0.0 --port=8000" > C:\Users\hp\gesempl\api_debug_log.txt 2>&1
pause
