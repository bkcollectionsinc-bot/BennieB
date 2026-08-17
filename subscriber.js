// show popup after 5 seconds
setTimeout(function(){
document.getElementById("mc_embed_shell").style.display="flex"
},5000);

// close popup when X is clicked
document.querySelector(".close-btn").addEventListener("click",function(){
document.getElementById("mc_embed_shell").style.display="none";
})

// close when clicking outside content
document.getElementById("mc_embed_shell").addEventListener("click",function(e){
 if(e.target=== this){
  this.style.display="none";
 }
});