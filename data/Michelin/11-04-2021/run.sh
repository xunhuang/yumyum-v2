jq -s "map(.results[0] .hits| .[])  " *.json > ../global-11-04-2021.json 

