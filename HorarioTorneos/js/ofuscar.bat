@echo off
echo ================================
echo   OFUSCANDO ARCHIVOS JS...
echo ================================
echo.

REM --- Lista de archivos a ofuscar ---
set FILES=anuncios.js comentarios.js funcionesAdministradores.js index.js partidos-clasificaciones.js sorteos.js

for %%F in (%FILES%) do (
    echo Ofuscando %%F ...

    REM Generamos archivo temporal asegurando que sea .js real
    javascript-obfuscator "%%F" --config obfuscator-config.json --output "%%~nF.temp.js"

    if exist "%%~nF.temp.js" (
        del "%%F"
        ren "%%~nF.temp.js" "%%F"
        echo ✓ %%F ofuscado correctamente.
    ) else (
        echo ❌ Error: no se generó archivo temporal para %%F
    )
    echo.
)

echo ================================
echo     PROCESO COMPLETADO
echo ================================
pause