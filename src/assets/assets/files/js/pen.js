function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it


function myFunction2() {
  // document.getElementById("sibdebarnav").classList.toggle("open");

  document.querySelectorAll('.menu').forEach((menu) => {
    const items = menu.querySelector('.sidebar');

    menu.addEventListener('click', (e) => {
        items.classList.add("open");
        menu.focus(); // Probably redundant but just in case!
    });

    menu.addEventListener('mouseleave', () => {
        items.classList.remove("open");
    });
});

}



 


// let menu_icon_box = document.querySelector(".scroll");
// function clickevent(){

//   document.getElementById("act").classList.toggle("active");

// }
        //     menu_icon_box.classList.toggle("active");
        // }


function closeNavBAr(){
  document.body.addEventListener("click", e => document.getElementById("sibdebarnav").classList.replace("open" ,""))
}
 

function previewFile() {
  const preview = document.querySelector("img");
  const file = document.querySelector("input[type=file]").files[0];
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    () => {
      // convert image file to base64 string
      preview.src = reader.result;
    },
    false,
  );

  if (file) {
    reader.readAsDataURL(file);
  }
}


 


function tester(unBouton) {
  // ici tu testes ton bouton
  if(trim(unBouton.value)=="")
     alert("problème!!");
}

function trim(string) 
{ 
return string.replace(/(^\s*)|(\s*$)/g,''); 
} 

 