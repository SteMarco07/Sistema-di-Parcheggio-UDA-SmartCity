import { SearchBox } from '@mapbox/search-js-react';

const search = () => {
  return (
    <div>
    <SearchBox
      accessToken='pk.eyJ1IjoiZmFiaW9zMDciLCJhIjoiY21tcTU2aDNoMHRuMDMxc2RycHZqZ2Z2OCJ9._GIagSs30ZeuZRHeLw02pA'
      options={{
        language: 'en',
        country: 'US'
      }}
    />
    </div>
  )
}

export default search
