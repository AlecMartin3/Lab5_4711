window.onload = function() {
    document.body.className += " loaded";
    var AddArtistBut = document.getElementById('AddArtistBut');
    var customFields = document.getElementById('customFields'); 
    var ul = document.getElementById("list");
    var li = document.createElement("li");
    ul.insertBefore(li, ul.firstChild);
    function display(){
        fetch("/json", {
        }).then((response) => {
            return response.json();
        }).then((json) => {
            for(var obj in json){
                createList(json[obj].URL, json[obj].Name, json[obj].About, json[obj].ID);
            }
        });
    }
    function AddArtistName(){
        var ArtName = document.createElement('Input');
        ArtName.type = 'text';
        ArtName.id = "Inputs"
        ArtName.placeholder = "Artist Name"
        return ArtName;
    }
    function AddArtistInfo(){
        var ArtInfo = document.createElement('Input');
        ArtInfo.type = 'text';
        ArtInfo.id = "Inputs";
        ArtInfo.placeholder = "Artist Info"
        return ArtInfo;
    }
    function AddArtistPic(){
        var ArtPic = document.createElement('Input');
        ArtPic.type = 'text';
        ArtPic.id = "Inputs"
        ArtPic.placeholder = "Artist Picture"
        return ArtPic;
    }
    function AddAddBut(){
        var AddBut = document.createElement('Button');
        AddBut.type = 'button';
        AddBut.id = "AddBut"
        AddBut.textContent = "Add"
            AddBut.addEventListener('click', function(e){
                var Name = "";
                var About = "";
                var URL = "";
                var x = document.getElementById("customFields").elements;
                Name = x[0].value;
                About = x[1].value;
                URL = x[2].value; 
                if(Name.length == 0){
                    Name = "No Name Given";
                }
                if(About.length == 0){
                    About = "No About Given";
                }
                if(URL.length == 0){
                    URL = "https://i.ytimg.com/vi/JrQkgLLL9XQ/hqdefault.jpg";
                }
                if(Name.length > 40){
                    Name = "Name too long";
                }
                if(About.length > 40){
                    About = "About too long";
                }
                else{
                    var Id = Date.now();
                    createList(URL, Name, About, Id);
                    Store(URL, Name, About, Id)
                }
            });
        return AddBut;
    }
    AddArtistBut.addEventListener('click', function(e) {
        const inputs = document.getElementById("customFields");
        if(document.getElementById("Inputs")){
            while (inputs.firstChild) {
                inputs.removeChild(inputs.firstChild);
              }
        }
        else{
            customFields.appendChild(AddArtistName());
            customFields.appendChild(AddArtistInfo());
            customFields.appendChild(AddArtistPic());
            customFields.appendChild(AddAddBut());
        }
    });
    display();
}
function noImg(image){
    image.src = "https://i.ytimg.com/vi/JrQkgLLL9XQ/hqdefault.jpg";
}
function Delete(btn){
    (btn.parentNode.parentNode.parentNode).removeChild(btn.parentNode.parentNode);
    var id = {
        ID: btn.parentNode.lastChild.textContent
    }
    json = JSON.stringify(id)
    fetch('/delete', {method: 'POST',headers: {
        'Content-Type': 'application/json; charset=utf-8'
        }, body: json})
        .then((response) => response.json())
        .catch((err) => console.log(err))
}
function Store(URL, Name, About, Id){
    var obj = {URL: URL,
    Name: Name,
    About: About,
    ID: Id}
    json = JSON.stringify(obj)
    fetch('/store', {method: 'POST',headers: {
        'Content-Type': 'application/json; charset=utf-8'
        }, body: json})
        .then((response) => response.json())
        .catch((err) => console.log(err))
}
function Search(){
    var searchBar = document.getElementById("search")
    var filter = searchBar.value.toUpperCase();
    var word = {
        words: filter
    }
    fetch('/search', {method: 'POST',headers: {
        'Content-Type': 'application/json; charset=utf-8'
        }, body: JSON.stringify(word)})
        .then((response) => response.json())
        .then((data)=> {
        clearList();
        Load(data);
        }
        )
        .catch((err) => console.log(err));
}
function Load(arr){
    for (let index = 1; index < arr.length+1; index++) {
        Get(arr[arr.length-index])
    }
}
function Get(Artist){
    createList(Artist.URL, Artist.Name, Artist.About, Artist.ID);
}
function clearList(){
    var x = document.getElementById('list');
    var child = x.lastElementChild;  
    while (child) { 
        x.removeChild(child); 
        child = x.lastElementChild; 
    } 
}
function createList(URL, Name, About, ID){
    var ul = document.getElementById("list");
    var li = document.createElement("li");
    ul.insertBefore(li, ul.lastChild);
    var person = document.createElement("div");
    person.setAttribute("id", "person");
    li.appendChild(person);
    var img = document.createElement("img");
    person.appendChild(img);
    img.setAttribute("onError","noImg(this)");
    img.setAttribute("id", "img");
    img.setAttribute("alt", Name);
    img.setAttribute("src", URL);
    var info = document.createElement("div");
    info.setAttribute("class", "info");
    person.appendChild(info);
    var name = document.createElement("p");
    name.setAttribute("class", "name");
    var about = document.createElement("p");
    info.appendChild(name);
    info.appendChild(about);
    name.appendChild(document.createTextNode(Name));
    about.appendChild(document.createTextNode(About));
    var del = document.createElement("button");
    del.setAttribute("class", "del");
    del.setAttribute("onClick", "Delete(this)");
    person.appendChild(del);
    del.appendChild(document.createTextNode("Delete"));  
    var ID =  document.createElement("p");
    ID.setAttribute("class", "idP");
    person.appendChild(ID);
    ID.appendChild(document.createTextNode(ID));
}