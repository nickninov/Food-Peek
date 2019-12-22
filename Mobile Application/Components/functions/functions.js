// A method that will display items based on the dropdown values
export const dropdownSort = (price, cusine, diet) => {

    // Wait for 5 seconds
    setTimeout(() => {
      this.sortOptions(price,cusine, diet);
    }, 1000)
    
  }

  sortOptions = (price, cusine, diet) => {

    // Temporary hold all of the data
    var tempArr = this.state.dataHolder;

    // Access the food of the restaurant and the restaurant's details
    for(var restaurant of tempArr){
      console.log(restaurant)
    }
    // Sort by price
    if(price != null && cusine == null && diet == null){
      console.log("Sort by price");
    }
    // Sort by cusine
    else if(price == null && cusine != null && diet == null) {
      console.log("Sort by cusine");
    }
    // Sort by diet
    else if(price == null && cusine == null && diet != null) {
      console.log("Sort by diet");
    }
    // Sort by price and cusine
    else if(price != null && cusine != null && diet == null) {
      console.log("Sort by price and cusine");
    }
    // Sort by price and diet
    else if(price != null && cusine == null && diet != null) {
      console.log("Sort by price and diet");
    }
    // Sort by cusine and diet
    else if(price == null && cusine != null && diet != null) {
      console.log("Sort by cusine and diet");
    }
    // Sort by price, cusine and diet
    else if(price != null && cusine != null && diet != null) {
      console.log("Sort by price cusine and diet");
    }
  }
