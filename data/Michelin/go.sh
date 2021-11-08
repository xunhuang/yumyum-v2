pages=`seq 0 15`
for p in $pages 
do 
   echo "page: " $p
   sh download.sh $p > page$p.json
done 
