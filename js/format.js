
document.querySelectorAll(".money").forEach(input=>{
    input.addEventListener("input",function(){
        let value=this.value.replace(/,/g,"");

        this.value=value.replace(/\B(?=(\d{3})+(?!\d))/g,",");
    });
});

