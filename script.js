const grid = document.getElementById("grid");
grid.className = "grid";

let vals = {};

function evaluate(exp){

    if(exp==="") return 0;

    try{
        return Function("return "+exp)();
    }
    catch{
        return 0;
    }
}

function cell(n){

    let d=document.createElement("div");
    d.className="cell num";
    d.textContent=n;

    let i=document.createElement("input");
    i.type="text";
    i.value="";

    i.className="cell val";

    i.onchange = function () {

    let ans = evaluate(i.value);

    vals[n] = ans;

    // Replace the expression with its result
    i.value = ans;

    if (ans > 1000)
        i.classList.add("high");
    else
        i.classList.remove("high");

    calc();
    };

    i.id="cell"+n;

    grid.append(d,i);

    vals[n]=0;
}

for(let r=0;r<10;r++)
    for(let c=1;c<=10;c++)
        cell(r*10+c);

[111,222,333,444,555,666,777,888,999,1110].forEach(cell);

const headRow=document.getElementById("headRow");
const valueRow=document.getElementById("valueRow");

for(let i=1;i<=10;i++){

    let th=document.createElement("th");
    th.innerText="Col "+i;
    headRow.appendChild(th);

    let td=document.createElement("td");
    td.id="col"+i;
    valueRow.appendChild(td);

}

function calc(){

    for(let c=1;c<=10;c++){

        let sum=0;

        for(let r=0;r<10;r++)
            sum+=vals[r*10+c]||0;

        sum+=vals[c*111]||0;

        document.getElementById("col"+c).innerHTML=sum;
    }

    let totalD=0;

    for(let i=1;i<=100;i++)
        totalD+=vals[i]||0;

    document.getElementById("totalD").innerHTML=totalD;

    let totalA=0;

    [111,222,333,444,555,666,777,888,999,1110].forEach(x=>{
        totalA+=vals[x]||0;
    });

    document.getElementById("totalA").innerHTML=totalA;

    document.getElementById("totalAD").innerHTML = totalA + totalD;
}

calc();

function newTable(){

    if(!confirm("Clear current table?"))
        return;

    document.querySelectorAll(".val").forEach(x=>{
        x.value="";
        x.classList.remove("high");
    });

    for(let k in vals)
        vals[k]=0;

    calc();
}

function saveTable(){

    let name=prompt("Table Name");

    if(!name) return;

    let data={};

    document.querySelectorAll(".val").forEach(input=>{
        data[input.id]=input.value;
    });

    localStorage.setItem(name,JSON.stringify(data));

    refreshTables();

    // alert("Saved");
}

function refreshTables(){

    let s=document.getElementById("savedTables");

    s.innerHTML="<option value=''>Saved Tables</option>";

    for(let i=0;i<localStorage.length;i++){

        let k=localStorage.key(i);

        let op=document.createElement("option");
        op.value=k;
        op.innerHTML=k;

        s.appendChild(op);

    }

}

function loadTable(name){

    if(name=="") return;

    let data=JSON.parse(localStorage.getItem(name));

    document.querySelectorAll(".val").forEach(input=>{

        input.value=data[input.id]||"";

        vals[input.id.replace("cell","")]=evaluate(input.value);

        if(vals[input.id.replace("cell","")]>1000)
            input.classList.add("high");
        else
            input.classList.remove("high");

    });

    calc();
}

function deleteTable(){

    let select = document.getElementById("savedTables");
    let name = select.value;

    if(name === ""){
        alert("Please select a saved table.");
        return;
    }

    if(confirm("Are you sure you want to delete '" + name + "' ?")){

        localStorage.removeItem(name);

        refreshTables();

        newTable();

        alert("Table deleted successfully.");
    }
}

refreshTables();