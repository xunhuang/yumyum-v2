import React from 'react';

import { useBayAreaQuery } from '../generated/graphql';

// const FrontPageFindLocation = () => {
//   const [county_fips_code, setCountyFipsCode] = React.useState<
//     undefined | string
//   >(undefined);

//   React.useEffect(() => {
//     fetchApproximatePoliticalLocation().then((location) => {
//       setCountyFipsCode(location.county_fips_code);
//     });
//   }, []);

//   if (county_fips_code) {
//     return <Redirect to={`/county/${county_fips_code}`}></Redirect>;
//   }

//   return <FullDiv>Determining location</FullDiv>;
// };

// export const FrontPage = () => {
//   const last = getLastCountyLocation();
//   if (last) {
//     if (last.county_fips_code) {
//       console.log("found list location " + last.county_fips_code);
//       return <Redirect to={`/county/${last.county_fips_code}`}></Redirect>;
//     }
//   }
//   return <FrontPageFindLocation />;
// };

export const FrontPage = () => {
  const { data, loading } = useBayAreaQuery();
  if (loading) {
    return loading;
  }
  return (
    <div>
      YUMYUM
      {data?.allVenues?.nodes.map((node) => {
        return (
          <div>
            {node?.name}, {node?.stars}
          </div>
        );
      })}
    </div>
  );
};
