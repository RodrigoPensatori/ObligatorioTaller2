
const URL_BASE = "https://crypto.develotion.com/";
const URL_IMG = "https://crypto.develotion.com/imgs/"

function dqs(selector)
{
    return document.querySelector(selector);
}

function Ocultar()
{
    dqs("#pantalla-login").style.display='none';
    dqs("#registro").style.display='none';
}

function Mostrar(componente)
{
    dqs(componente).style.display='block';
}


async function Login()
{
    let Usr = document.querySelector("#UsrLogin").value;
    let Psw = document.querySelector("#UsrPsw").value;

    try {
        const res = await fetch(`${URL_BASE}login.php`,
    {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            "usuario":Usr,
            "password":Psw
        })       
    }) 
    const resjson = await res.json(); 
    
    if(resjson.codigo == 200)
    {
        localStorage.setItem("ApiKey",resjson.apiKey);
        Ocultar();
        document.getElementById("Tab").classList.remove('ion-hide');
        
    }
    } catch (error) {
        console.log(error);
    }

    
    
    



} 

function Registrarse()
{
   
    Ocultar();

    CargarDepartamentos();
    //CargarCiudad(id);

    Mostrar('#registro');
} 


async function CargarDepartamentos()
{

    try {
        const res = await fetch(`${URL_BASE}departamentos.php`,
    {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
        },
               
    }) 
    const resjson = await res.json(); 
    console.log(resjson);
    if(resjson.codigo == 200)
    {
        
        resjson.departamentos.forEach(departamento => {
            
            dqs("#SelDep").innerHTML +=   `<ion-select-option value="${departamento.id}">${departamento.nombre}</ion-select-option>`
            
        });
        //dqs('#SelDep').addEventListener('change',CargarDepartamentos())
        
    }
    } catch (error) {
        console.log(error);
    }

    
}



async function CargarDepartamentos(id)
{

    try {
        const res = await fetch(`${URL_BASE}ciudades.php?idDepartamento=${id}`,
    {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
        },
               
    }) 
    const resjson = await res.json(); 
    console.log(resjson);
    if(resjson.codigo == 200)
    {
        
        resjson.ciudades.forEach(ciudades => {
            
            dqs("#SelCiudad").innerHTML +=   `<ion-select-option value="${ciudad.id}">${ciudad.nombre}</ion-select-option>`
            
        });
        
        
    }
    } catch (error) {
        console.log(error);
    }

    
}


async function CrearUsr()
{
   
    

    let Usr = document.querySelector("#RegUsr").value;
    let Psw = document.querySelector("#RegPsw").value;
    let Departamento = document.querySelector("#RegDep").value;
    let City = document.querySelector("#RegCiudad").value;
    

    try {
        const res = await fetch(`${URL_BASE}usuarios.php`,
    {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            "usuario":Usr,
            "password":Psw,
            "idDepartamento":1
        })       
    }) 
    const resjson = await res.json(); 
    console.log(resjson);
    if(resjson.codigo == 200)
    {
        localStorage.setItem("ApiKey",resjson.apiKey);
        Ocultar();
        document.getElementById("Tab").classList.remove('ion-hide');
        
    }
    } catch (error) {
        console.log(error);
    }

    Ocultar();
    Mostrar('#pantalla-login');
} 

