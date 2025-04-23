#!/bin/bash

echo "=== Iniciando servidor web para 'Madrid Musical XVIII' ==="
echo ""
echo "Tienes varias opciones para ejecutar el servidor web:"
echo ""
echo "1. Servidor Python (el más simple):"
echo "   cd /home/rafa/Descargas/madrid && python3 -m http.server 8000"
echo "   Accede a: http://localhost:8000"
echo ""
echo "2. Usando Docker (recomendado):"
echo "   cd /home/rafa/Descargas/madrid && docker-compose up -d"
echo "   Accede a: http://localhost:8080"
echo ""
echo "3. Instalando Nginx (instalación permanente):"
echo "   Sigue las instrucciones en el archivo instalar-nginx.sh"
echo ""
echo "Iniciando servidor Python ahora..."
echo "(Presiona Ctrl+C para detener el servidor cuando termines)"
echo ""

cd /home/rafa/Descargas/madrid && python3 -m http.server 8000