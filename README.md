# Latency Benchmark

Serves a site, pings a target device and reports those latencies to prometheus. Generated data 
is visualized with grafana.

## Prerequisites

- Install prometheus (use config from `/configs/prometheus.yml` in this repo) and run it
- Install & run grafana, add prometheus as a data source
- Import the dashboard from `/configs/grafana-dashboard.json`

## How to use

The server has to be run on the machine that's supposed to be the origin of pings.

- Go to the grafana dashboard, select "last 5 minutes" for the time range and enable 5 sec. auto-refresh
- Clone this repo and run with node
- Visit via browser at port `2000` - ideally from the target device
- Start benchmark in web interface
- After a few seconds, you should see the graph forming in grafana. Just stop whenever you've had enough. 🙂

## Notes

Not designed to keep data around by labeling it (because while it is possible to look at recent days 
using grafana, trying to browse test results across months would probably not work well). Instead, one 
should benchmark, then take a screenshot of the resulting curve, then label and archive that somewhere.
