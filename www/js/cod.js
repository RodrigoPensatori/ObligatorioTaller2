const URL_BASE = "https://crypto.develotion.com/";
const URL_IMG = "https://crypto.develotion.com/imgs/";
let UsuarioId = 0
let monedas = []


function dqs(selector) {
	return document.querySelector(selector);
}

function Ocultar() {
	dqs("#pantalla-login").style.display = "none";
	dqs("#registro").style.display = "none";
}

function Mostrar(componente) {
	dqs(componente).style.display = "block";
}


function Registrarse() {
	Ocultar();

	CargarDepartamentos();
	//CargarCiudad(id);
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
				localStorage.setItem("ApiKey", resjson.apiKey);
				UsuarioId = resjson.id;
				Ocultar();
				document.getElementById("Tab").classList.remove("ion-hide");
				await CargarMonedas()
				await CargarTransaccionesUsuario()
				await CargarComboMoneda()
                break;
            case 409:
                Alerta('Error','Usuario o Contraseña invalido.');

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
            document.getElementById("Tab").classList.remove('ion-hide');
            
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

async function CargarComboMoneda(){
	console.log(`cargando combo monedas ${JSON.stringify(monedas)}`);
	monedas.forEach(moneda => {
		dqs("#slcMoneda").innerHTML +=   `<ion-select-option value="${moneda.id}">${moneda.nombre}</ion-select-option>`
	});
   
}

async function CargarTransaccionesUsuario() {
	try {
		const res = await fetch(`${URL_BASE}/transacciones.php?idUsuario=${UsuarioId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"apikey":`${localStorage.getItem("ApiKey")}`
			},
		});
		const resjson = await res.json();
		console.log(resjson);
		let listaTransacciones = ``
		if (resjson.codigo == 200) {
			//si el select tiene un filtro, hacer el filtro de la lista de transacciones
			let transaccionesFiltradas = []
			if (dqs("#slcMoneda").value) {
				transaccionesFiltradas = resjson.transacciones.filter(transaccion=>transaccion.moneda == dqs("#slcMoneda").value)
			}else{
				transaccionesFiltradas = resjson.transacciones
			}
			
			transaccionesFiltradas.forEach(transaccion => {
				listaTransacciones += ` 
						<ion-item>
							<ion-label>
								<div style="display:flex">
									<div  style="width:80px">
										<h2>Id</h2>
										<p style="margin-left:5px;">${transaccion.id}</p>
									</div>
									<div  style="width:80px">
										<h2>Tipo de Operacion</h2>
										<p style="margin-left:5px;">${transaccion.tipo_operacion}</p>
									</div>
								</div>
								<div style="display:flex"> 
									<div style="width:80px">
										<h2>moneda</h2>
										<p style="margin-left:5px;">${transaccion.moneda}</p>
									</div>
									<div style="width:80px">
										<h2>Cantidad</h2>
										<p style="margin-left:5px;">${transaccion.cantidad}</p>
									</div>
									<div style="width:80px">
										<h2>Valor actual</h2>
										<p style="margin-left:5px;">${transaccion.valor_actual}</p>
									</div>
								</div>
							</ion-label>
						</ion-item>`
			});
		}

		dqs('#listaTransacciones').innerHTML = listaTransacciones;
	} catch (error) {
		console.log(error);
	}
}


async function CargarMonedas() {
	try {
		const res = await fetch(`${URL_BASE}monedas.php`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"apikey":`${localStorage.getItem("ApiKey")}`
			},
		});
		const resjson = await res.json();
		console.log(resjson);
		let listaMonedas = ``
		if (resjson.codigo == 200) {
			monedas = resjson.monedas
			resjson.monedas.forEach(moneda => {
				listaMonedas += ` 
						<ion-item>
							<ion-avatar slot="start">
								<img src="${URL_IMG}${moneda.imagen}" />
							</ion-avatar>
							<ion-label>
								<h2>${moneda.nombre}</h2>
								<div style="display:flex"> 
									<h3>Cotizacion:</h3>
									<p style="margin-left:5px;">${moneda.cotizacion}</p>
								</div>
							</ion-label>
						</ion-item>`
			});
		}

		dqs('#listaMonedas').innerHTML = listaMonedas;
	} catch (error) {
		console.log(error);
	}
}

function CerrarSesion() {
	console.log("Cerrar sesion");
	localStorage.clear()
	document.getElementById("Tab").classList.add("ion-hide");
	Ocultar()
	Mostrar("#pantalla-login");
}
