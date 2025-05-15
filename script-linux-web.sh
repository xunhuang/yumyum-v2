mkdir -p /tmp/tmate
sudo apt-get update
sudo apt-get install -y openssh-client xz-utils
wget https://github.com/tmate-io/tmate/releases/download/2.4.0/tmate-2.4.0-static-linux-i386.tar.xz
tar x -C /tmp/tmate  -f  tmate-2.4.0-static-linux-i386.tar.xz --strip-components=1
/tmp/tmate/tmate -S /tmp/tmate.sock  new-session -d

echo "tmate session created - wait 5 seconds for session to be ready "
sleep 5

url=`/tmp/tmate/tmate -S /tmp/tmate.sock display -p '#{tmate_web}'`
echo "web url is $url"

echo "callback_url is $callback_url"
echo "response_id is $response_id"

if [ -n "$response_id" ] && [ -n "$callback_url" ]; then
  url_encoded=`echo "$url" | jq -sRr @uri | sed 's/%0A$//'`
  curl_url="$callback_url/set?key=$response_id&value=$url_encoded"
  echo $curl_url
  curl -X GET $curl_url
fi