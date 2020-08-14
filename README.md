# Latency Benchmark

Serves a site, pings a target device and reports those latencies to prometheus. Generated data 
is visualized with grafana.

Plus: A timestamped `.csv` is generated in the root of this repo after every benchmark.

## Prerequisites

The following outlines how to use this on Windows but on Linux, it should work almost the same.
Note that all of this has to be run on the machine that's supposed to be the origin of the pings 
that are used for this benchmark.

- Ports 2000 (this server), 3000 (grafana) and 9090 (prometheus) must be available
- Install things required by `node-gyp`: https://github.com/nodejs/node-gyp#on-windows
- Clone this repo
- Unzip prometheus into `prometheus` at the repo's root
- Unzip grafana into `grafana` at the repo's root
- Run `run.bat`, visit grafana at `localhost:3000` (its default credentials are admin/admin),
 add prometheus as a data source in grafana (setting the scrape interval to `1s`) and import the dashboard from 
 `configs/grafana-dashboard.json`

## How to use

- Go to the grafana dashboard, select "last 5 minutes" for the time range and enable 5 sec. auto-refresh
- Clone this repo and run with node
- Visit via browser at port `2000` - ideally from the target device
- Start benchmark in web interface
- After a few seconds, you should see the graph forming in grafana. Just stop whenever you've had enough. 🙂

## TODO (Contributions welcome)

- Create a docker-compose file as an alternative to manually downloading and configuring 
prometheus and grafana

## Notes

Not designed to keep data around by labeling it (because while it is possible to look at recent days 
using grafana, trying to browse test results across days or weeks would probably not be convenient). Instead, one 
should benchmark, then take a screenshot of the resulting curve, then label and archive that somewhere.

