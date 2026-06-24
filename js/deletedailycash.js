function deleteDailyCash(id){

if(confirm("Delete this record?")){

fetch("php/deleteDailyCash.php",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({id:id})
})
.then(res=>res.text())
.then(data=>{
alert(data);
loadDailyCash();
});

}

}