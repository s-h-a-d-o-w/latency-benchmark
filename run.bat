copy /Y configs\prometheus.yml prometheus

cd prometheus
start prometheus
cd ..

cd grafana\bin
start grafana-server
cd ..\..

node .
