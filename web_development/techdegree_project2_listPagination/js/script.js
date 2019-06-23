/* techdegree project 2 - List Pagination and Filtering  */
/* December 12, 2018					                           */
/*                                                       */
/* Using HTML5, CSS, and Javascript to create a webpage  */
/* that divides one list into digestible chunks.         */

//Object for manipulating HTML nodes
const DOM_elements_tools = {
  create : (element, property, value) => {
    let tempEl = document.createElement(element);

    tempEl[property] = value;
    return tempEl;
  },
  append : (element, destination) => {
    destination.appendChild(element);
    return destination;
  }
}
    
const pageDiv = document.querySelector('.page');
const studentListParent = document.querySelector('.student-list');
const studentList = studentListParent.children;
const entriesPerPage = 10;

//Setting up the "No matches found..." tooltip...
const searchNotFound = DOM_elements_tools.create('p', 'textContent', 'No matches found...');
searchNotFound.style.display = 'none';
pageDiv.insertBefore(searchNotFound, studentListParent);


//Sets the css 'display' property to 'none' for all list entries
function hideList(list) {
  let i = 0;

  while (list[i]){
    list[i].style.display = 'none';
    i++;
  }
}

//Sets the css 'display' property to show for all appropriate entries
const showPage = (list, page) => {
  let pageCeiling = page * entriesPerPage;
  let pageFloor = pageCeiling - entriesPerPage;

  hideList(studentList);

  while (list[pageFloor] && pageFloor < pageCeiling){ //Conditional that makes sure the loop doesn't access
    list[pageFloor].style.display = '';               //out of bound array && doesn't overshoot number of entries per page
    pageFloor++;
  } 

}

//Dynamically creates navigation links for the parameter(list) then sets a 'click' listener to wait for page navigation
const appendPageLinks = list => {
  if (document.querySelector('div[class=pagination]')) //If pagination links are already setup, remove them
    pageDiv.removeChild(document.querySelector('div[class=pagination]'));
  
  if (!list.length > 0){ //If the list has no entries, exit the function
    return console.log("Your list is empty!!!");
  }else{
    const numberOfPages = Math.ceil(list.length / entriesPerPage);
    let currentPage = 0;
  
    //Setting up the skeleton for page navigation links
    const node_paginationDIV = DOM_elements_tools.create('div', 'className', 'pagination');
    const node_paginationUL = DOM_elements_tools.create('ul');
    DOM_elements_tools.append(node_paginationUL, node_paginationDIV);
    DOM_elements_tools.append(node_paginationDIV, pageDiv);
    
    //Adding the appropriate number of page links
    for (let i = 1; i <= numberOfPages; i++){
      let li = DOM_elements_tools.create('li');
      let a = DOM_elements_tools.create('a', 'href', '#');
  
      a.textContent = i;
      DOM_elements_tools.append(DOM_elements_tools.append(a, li), node_paginationUL);
    }
    node_paginationUL.children[0].firstElementChild.className = 'active'; //Turning first navigation link 'blue'
    
    //Activate a listener for the navigation links
    node_paginationUL.addEventListener('click', (e) => {
      showPage(list, e.target.textContent);

      if (e.target.className != 'active'){
        e.target.className = 'active'; //Turning the current page link 'blue'
        node_paginationUL.children[currentPage].firstElementChild.className = ''; //Turning the previous page link "colorless"
        currentPage = (e.target.textContent - 1);
      }
    });
  }
}

const searchFunction = () => {
  const studentListNames = document.querySelectorAll('div[class=student-details] h3');

  //Setting up the skeleton for the search functionality...
  const pageHeaderDiv = document.querySelector('.page-header.cf');
  const searchButton = DOM_elements_tools.create('Button', 'textContent', 'Search');
  const searchInput = DOM_elements_tools.create('Input', 'placeholder', 'Search for students...');
  const searchDiv = DOM_elements_tools.create('div', 'className', 'student-search');
  DOM_elements_tools.append(searchInput, searchDiv);
  DOM_elements_tools.append(searchButton, searchDiv);
  DOM_elements_tools.append(searchDiv, pageHeaderDiv);

  const list_searcher = userSearch => {
    const searchResultsList = new Array();
    let found = false;

    for (let i = 0; i < studentList.length; i++){
      let studentName = studentListNames[i].textContent.toLowerCase();
  
      if (studentName.includes(userSearch)){ 
        found = true;
        searchNotFound.style.display = 'none';
        searchResultsList.push(studentList[i]);
      }
    }
    if (!found) searchNotFound.style.display = '';

    showPage(searchResultsList, 1);
    appendPageLinks(searchResultsList);
  }
    
  searchButton.addEventListener('click', e => {
    list_searcher(searchInput.value.toLowerCase());
  });
  
  searchInput.addEventListener('keyup', e => {
    list_searcher(searchInput.value.toLowerCase());
  });
}

showPage(studentList, 1);
appendPageLinks(studentList);
searchFunction();

