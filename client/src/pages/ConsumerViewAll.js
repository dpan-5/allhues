import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import MultiKit from "../components/MultiKit/MultiKit";
import API from "../utils/API";
import AuthContext from "../utils/AuthContext";
import Select from "react-select";
import { options, hueOptions, sortOptions } from "../utils/selectOptions";
import RoleContext from "../utils/roleContext";

const ConsumerViewAll = () => {
  // Array of all kits, this is used to true up the filterKits array when filter is cleared
  const [kits, setKits] = useState([]);

  // Array of filtered kits, this is used to render the kits on the page
  const [filterKits, setFilterKits] = useState([]);

  const [selectedFilterProducts, setSelectedFilterProducts] = useState([]);
  const [selectedFilterHue, setSelectedFilterHue] = useState("");
  const [selectedSort, setSelectedSort] = useState("");




  //TODO: We can probably get rid of JWT here since it's not being used anywhere on the page, and the page is not going to be protected
  const { jwt } = useContext(AuthContext);
  const { role } = useContext(RoleContext);
  const history = useHistory();

  //Makes an api call to get all saved image urls so we can show em all
  const findAll = () => {
    API.getKits()
      .then((res) => {
        console.log(res.data);
        setKits(res.data);
        setFilterKits(res.data);
      })
      .catch((err) => {
        localStorage.clear();
        history.push("/login");
      });
  };

  // Component on mount, retrieve all kits from DB
  useEffect(() => {
    findAll();
  }, []);

  // Filters kits based on products selected
  const handleCategoryFilterChange = (event) => {
    // Check to see if event is null or event array is empty, if so (this means that user cleared filters) setFilterKits back to original kits array that was retrieved on component mount
    if (!event || event.length === 0) {
      if(selectedFilterHue.length) {
        filterByHue(undefined, kits);
      } else {
        setFilterKits(kits);
      }
      setSelectedFilterProducts([]);
    } else {
      // Returns an array of products that user selected
      const selectedFilters = event.map((category) => category.value);
      setSelectedFilterProducts(selectedFilters);
      // Filter logic
      filterByProduct(selectedFilters);
      
    }
  };

  // Function that filters by product and sets filterKit to a filtered array
  // If no argument is passed in, the function will use the state array of selectedFilterProducts
  const filterByProduct = (selectedFilters = selectedFilterProducts, kitsArray = filterKits) => {
    // Don't even try asking me how I got this to work....
    return new Promise((resolve, reject) => {
      const results = [];
      for (let i = 0; i < kitsArray.length; i++) {
        let match = 0;
        for (let j = 0; j < kitsArray[i].kitItems.length; j++) { 
          for (let k = 0; k < selectedFilters.length; k++) {
            if (kitsArray[i].kitItems[j].makeupCategory === selectedFilters[k]) {
              match++;
            }
          }
        }
        if (match >= selectedFilters.length) {
          results.push(kitsArray[i]);
        }
      }
      setFilterKits(results);
    })
  };






  // Filters kits based on hue type selected
  const handleHueFilterChange = (event) => {
    // Check to see if event is null, if so (this means that the user cleared filters) 
    if (!event) {
      // Now check to see if selectedFilterProducts is empty or not - if not empty, call filterByProduct(), otherwise setFilterKits back to OG kits
      if (selectedFilterProducts.length) {
        filterByProduct(undefined, kits);
      } else {
        setFilterKits(kits);
      }
      setSelectedFilterHue("");
    } else {
      // Returns value of selected hue
      const selectedHue = event.value;
      setSelectedFilterHue(selectedHue);

      filterByHue(selectedHue);
      
    }
  };


  const filterByHue = (selectedHue = selectedFilterHue, kitArray = filterKits) => {
    return new Promise((resolve, reject) => {
      setFilterKits(kitArray.filter(kit => kit.hueType === selectedHue));
    })
  }



  const handleSortChange = (e) => {
    console.log(e);
    if (!e) {
      if (selectedFilterProducts.length && selectedFilterHue.length) {

        const go = async () => {
          await filterByProduct(undefined, kits);
          console.log("Done filtering by product")
          await filterByHue();
          console.log("Done filtering by hue")
        }
      
        go();

      } 
        
       else if (selectedFilterProducts.length) {
        filterByProduct(undefined, kits);
      } else if (selectedFilterHue.length) {
        filterByHue(undefined, kits);
      } else {
        setFilterKits(kits);
      }
    } else if (e.value === "Popularity") {
      const newSortedArray = [...filterKits].sort(
        (a, b) => b.uniqueVisits - a.uniqueVisits
      );
      setFilterKits(newSortedArray);
    } else if (e.value === "Trending") {
      // TODO: figure out what to do here instead of same as popularity
      const newSortedArray = [...filterKits].sort(
        (a, b) => b.uniqueVisits - a.uniqueVisits
      );
      setFilterKits(newSortedArray);
    } else if (e.value === "New") {
      // const arr = [...fil];

      const newSortedArray = [...filterKits]
        .sort((a, b) => {
          return (
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
          );
        })
        .reverse();

      setFilterKits(newSortedArray);
    } //else if ((e.target = "Yours")) {
    //   console.log(e.target);
    // }
  };

  return (
    <div>
      <div
        className="container"
        style={{ marginBottom: "1%", fontSize: "0.82rem" }}
      >
        <div className="row mt-3">
          <div className="col-sm-4">
            <Select
              options={sortOptions}
              onChange={handleSortChange}
              placeholder="Sort by..."
              isClearable
            />
          </div>
          <div className="col-sm-4">
            <Select
              options={options}
              onChange={handleCategoryFilterChange}
              placeholder="Filter by Product"
              isClearable
              isMulti
            />
          </div>
          <div className="col-sm-4">
            <Select
              options={hueOptions}
              onChange={handleHueFilterChange}
              placeholder="Filter by Hue"
              isClearable
            />
          </div>
        </div>
      </div>

      <div className="container-fluid">
        {/* <div className="row row-cols-6">
          <Select
            options={sortOptions}
            onChange={handleSortChange}
            placeholder="Sort by..."
            isClearable
          />
        </div> */}

        {/* <div className="row"></div> */}
        <div className="row row-cols-1 row-cols-md-3">
          {filterKits.map((i) => (
            <MultiKit key={i._id} src={i.imageUrl} class={i._id} info={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsumerViewAll;
