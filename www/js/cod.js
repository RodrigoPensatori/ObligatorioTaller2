
const URL_BASE = "https://crypto.develotion.com/";
const URL_IMG = "https://crypto.develotion.com/imgs/"


//FUNCIONES GENERALES
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


async function Alerta(header,msg) {
    const alert = document.createElement('ion-alert');
    alert.header = header;
    alert.message = msg;
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    await alert.present();
  }

//---------//




async function Login()
{
    let Usr = document.querySelector("#UsrLogin").value;
    let Psw = document.querySelector("#UsrPsw").value;

    if(Usr != '' && Psw !='')
    {
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
        
        switch (resjson.codigo) {
            case 200:
              
                localStorage.setItem("ApiKey",resjson.apiKey);
                localStorage.setItem("UserId",resjson.id);
                Ocultar();
                document.getElementById("Tab").classList.remove('ion-hide');
                break;
            case 409:
                Alerta('Error','Usuario o Contraseña invalido.');
                break;
            default:
                Alerta('Error','Error Inesperado.')
                break;
        }

        
        } catch (error) {
            console.log(error);
        }
    }

   
    else
    {
        Alerta('Error','Ingrese Todos los Datos.')
    }

} 

function Registrarse()
{
   
    Ocultar();

    CargarDepartamentos();
    dqs('#SelDep').addEventListener('click',async ()=>{
        
        dqs('#SelCiudad').innerHTML = '';
    })

    dqs('#SelCiudad').addEventListener('click',async ()=>{

        try {
            dqs("#SelCiudad").innerHTML ='';
            let id = dqs('#SelDep').value;
            
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
                
                dqs("#SelCiudad").innerHTML +=   `<ion-select-option value="${ciudades.id}">${ciudades.nombre}</ion-select-option>`
                
            });
            
            
        }
        } catch (error) {
            console.log(error);
        }
    
    })

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
       
        
    }
    } catch (error) {
        console.log(error);
    }

    
}

async function CrearUsr()
{

    let Usr = dqs("#RegUsr").value;
    let Psw = dqs("#RegPsw").value;
    let Departamento = dqs("#SelDep").value;
    let City = dqs("#SelCiudad").value;
    
    
    if(Usr !='' && Psw !='' && Departamento != undefined && City != undefined )
    {
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
                "idDepartamento":Departamento,
                "idCiudad":City
            })       
        }) 
        const resjson = await res.json(); 
        console.log(resjson);
        if(resjson.codigo == 200)
        {
            
            localStorage.setItem("ApiKey",resjson.apiKey);
            
            Ocultar();
            Mostrar('#pantalla-login');
            
        }
        else
        {
            Alerta('Error',resjson.mensaje);
        }
        } catch (error) {
            console.log(error);
        }
    
        
    }
    else
    {
        Alerta('Error','Ingrese Todos los Datos');
    }

    
} 

