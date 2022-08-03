const URL_BASE = "https://crypto.develotion.com/";
const URL_IMG = "https://crypto.develotion.com/imgs/";
const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const HOME = document.querySelector("#pantalla-home");
const LOGIN = document.querySelector("#pantalla-login");
const REGISTRO = document.querySelector("#pantalla-registro");
const MONEDAS = document.querySelector("#pantalla-monedas");
const TRANSACCIONES = document.querySelector("#pantalla-transacciones");
const INFO = document.querySelector("#pantalla-info");
const NAV = document.querySelector("ion-nav");
const MAPAUSR = document.querySelector("#MapaUsr");
const MONTOFINAL = document.querySelector('#MontoFinal');
const MONTOPORMONEDA = document.querySelector('#montopormoneda');
let arrDepartamentos = [];
let arrMonedas = [];
let transaccionesUsr = [];
let loading = null;
Inicio();


var createLoading = async () => {
	loading  = await loadingController.create({
	
	});
	
	loading.present();
  }

  var showLoading = async () => {
	
		loading  = await loadingController.create({
	
		});	
		loading.present();
	}
	
  var DismissLoading = async () => {
	
	loading.dismiss();
  }


function Inicio() {
	  
	Eventos();
  ArmarMenuOpciones();
}

function ArmarMenuOpciones() {
  let hayToken = localStorage.getItem("ApiKey");
  let opciones = ` <ion-item href="/" onclick="cerrarMenu()">Home</ion-item>`;
  if (hayToken != null) {
    opciones += `<ion-item href="/monedas" onclick="cerrarMenu()">Monedas</ion-item>
				 <ion-item href="/transacciones" onclick="cerrarMenu()">Transacciones</ion-item>
				 <ion-item href="/info" onclick="cerrarMenu()">Info</ion-item>
                 <ion-item href="#" onclick="CerrarSesion()">Logout</ion-item>`;
  } else {
    opciones += `<ion-item href="/login" onclick="cerrarMenu()">Login</ion-item>
                 <ion-item href="/registro" onclick="cerrarMenu()">Registro</ion-item>`;
  }
  dqs("menu-opciones").innerHTML = opciones;
}
function Eventos() {
  ROUTER.addEventListener("ionRouteDidChange", Navegar);
  dqs("btn-login").addEventListener("click", tdLogin);
  //dqs("slc-sucursales").addEventListener('ionChange', setSucursalElegida)
}

function tdLogin() {
  let u = dqs("txtUsuario").value;
  let p = dqs("txtPassword").value;

  Loguear(u, p);
}

async function Loguear(usuario, password) {
	if(usuario && password)
    {
	showLoading();
	let dto = new Object();
	dto.usuario = usuario;
	dto.password = password;

		try {
            const res = await fetch(`${URL_BASE}login.php`,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(dto)       
        }) 
        const resjson = await res.json(); 
        
        switch (resjson.codigo) {
            case 200:
				localStorage.setItem("ApiKey", resjson.apiKey);
				localStorage.setItem("UsuarioId", resjson.id);
				ArmarMenuOpciones();
				await toast('success','Logeado con éxito.')
				NAV.push("page-monedas");
				DismissLoading();
                break;
            case 409:
				DismissLoading();
                toast('warning','Usuario o Contraseña invalido.');

            default:
				DismissLoading();
                toast('warning','Error Inesperado.')
                break;
        }

        
        } catch (error) {
            console.log(error);
        }

	}else{
 		 toast('warning',"Datos inválidos",'Ingrese Todos los Datos.')
	}
}




function CerrarSesion() {
  localStorage.clear();
  ArmarMenuOpciones();
  cerrarMenu();
}

async function Navegar(evt) {
  console.log(evt);
  const ruta = evt.detail.to;
  OcultarPantallas();

  if (ruta == "/") {
    HOME.style.display = "block";
  } else if (ruta == "/login") {
    LOGIN.style.display = "block";
  } else if (ruta == "/registro") {
	await verPantallaRegistro()
    REGISTRO.style.display = "block";
  } else if (ruta == "/monedas") {
	await verPantallaMonedas()
    MONEDAS.style.display = "block";
  }else if (ruta == "/transacciones") {
	await verPantallaTransacciones()
    TRANSACCIONES.style.display = "block";
  }else if (ruta == "/info") {
	//await verPantallaTransacciones()
    INFO.style.display = "block";
  }else if(ruta == '/info/mapausr')
  {
	MostrarMapaUsr();
	MAPAUSR.style.display = 'block';
  }else if (ruta=='/info/montofinal')
  {
	await MostrarMontoFinal();
	MONTOFINAL.style.display = 'block';
  }
  else if (ruta == '/info/montopormoneda')
  {
	
	await MostrarMontoPorMoneda();
	MONTOPORMONEDA.style.display='block'
	
  }


}

function OcultarPantallas() {
	HOME.style.display = "none";
	LOGIN.style.display = "none";
	REGISTRO.style.display = "none";
	MONEDAS.style.display = "none";
	TRANSACCIONES.style.display = "none";
	INFO.style.display = "none";
	MAPAUSR.style.display='none';
	MONTOFINAL.style.display='none';
	MONTOPORMONEDA.style.display = 'none';
}
  
function cerrarMenu() {
	MENU.close();
}

function dqs(id) {
	return document.querySelector("#" + id);
}

async function verPantallaRegistro() {
	dqs('btnRegistrarse').addEventListener('click', CrearUsr)

	CargarDepartamentos();
	dqs('SelDep').addEventListener('click',async ()=>{
        dqs('SelCiudad').innerHTML = '';
    })

	dqs('SelCiudad').addEventListener('click',async ()=>{

        try {
            dqs("SelCiudad").innerHTML ='';
            let id = dqs('SelDep').value;
            
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
                
                dqs("SelCiudad").innerHTML +=   `<ion-select-option value="${ciudades.id}">${ciudades.nombre}</ion-select-option>`
                
            });
            
            
        }
        } catch (error) {
            console.log(error);
        }
    
    })
}

async function verPantallaMonedas() {
	await CargarMonedas()
}

async function verPantallaTransacciones() {
	await CargarMonedas()
	await CargarTransaccionesUsuario()
	await CargarComboMoneda('slcMoneda')
	await CargarComboMoneda('slcMonedaNuevaTransaccion')
}


function Alertar(header, subheader, mensaje) {
  const alert = document.createElement("ion-alert");
  alert.header = header;
  alert.subHeader = subheader;
  alert.message = mensaje;
  alert.buttons = ["OK"];
  document.body.appendChild(alert);
  alert.present();
}

async function toast(color,msg) {
	const toast = await toastController.create({
		color,
		duration: 3000,
		message: msg,
		showCloseButton: true,
	  });

	await toast.present();
}



async function CargarMonedas() {
	if (arrMonedas.length ==0) {
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
					arrMonedas = resjson.monedas
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
		
				dqs('listaMonedas').innerHTML = listaMonedas;
			} catch (error) {
				console.log(error);
			}
	}
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
        arrDepartamentos = resjson.departamentos 
        resjson.departamentos.forEach(departamento => {
            
            dqs("SelDep").innerHTML +=   `<ion-select-option value="${departamento.id}">${departamento.nombre}</ion-select-option>`
            
        });
       
        
    }
    } catch (error) {
        console.log(error);
    }

    
}


async function CrearUsr()
{

    let Usr = dqs("txtUser").value;
    let Psw = dqs("txtPass").value;
    let Departamento = dqs("SelDep").value;
    let City = dqs("SelCiudad").value;

	const dto = new Object()
	dto.usuario = Usr;
	dto.password = Psw;
	dto.idDepartamento = Departamento;
	dto.idCiudad = City;
    
    
    if(Usr && Psw && Departamento && City )
    {
        try {
			showLoading();
            const res = await fetch(`${URL_BASE}usuarios.php`,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(dto)       
        }) 
        const resjson = await res.json(); 
        console.log(resjson);
        if(resjson.codigo == 200)
        {
			DismissLoading();
            toast("success",'Usuario creado con éxito.');
			NAV.push('page-login')
        }
		else
		{
			DismissLoading()
			toast("warning",resjson.mensaje)
			
		}
        } catch (error) {
            console.log(error);
        }
    
        
    }
    else
    {
        toast('warning','Ingrese Todos los Datos');
    }

    
} 


async function CargarComboMoneda(slc){
	console.log(`cargando combo monedas ${JSON.stringify(arrMonedas)}`);
	dqs(slc).innerHTML = ``;
	arrMonedas.forEach(moneda => {
		dqs(slc).innerHTML +=   `<ion-select-option value="${moneda.id}">${moneda.nombre} $${moneda.cotizacion}</ion-select-option>`
	});
}

async function CargarTransaccionesUsuario() {
	showLoading()
	try {
		const res = await fetch(`${URL_BASE}/transacciones.php?idUsuario=${localStorage.getItem('UsuarioId')}`, {
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
			transaccionesUsr = resjson.transacciones;
			if (dqs("slcMoneda")?.value) {
				transaccionesFiltradas = resjson.transacciones.filter(transaccion=>transaccion.moneda == dqs("slcMoneda").value)
			}else{
				transaccionesFiltradas = resjson.transacciones
			}
			
			transaccionesFiltradas.forEach(transaccion => {
				listaTransacciones += ` 
						<ion-item>
							<ion-label>
								<div style="display:flex">
									<div  style="width:110px">
										<h2>Id</h2>
										<p style="margin-left:5px;">${transaccion.id}</p>
									</div>
									<div  style="width:110px">
										<h2>Tipo de Operacion</h2>
										<p style="margin-left:5px;">#${transaccion.tipo_operacion} ${transaccion.tipo_operacion == 1 ? 'Compra' : 'Venta'}</p>
									</div>
								</div>
								<div style="display:flex"> 
									<div style="width:110px">
										<h2>Moneda</h2>
										<p style="margin-left:5px;">#${transaccion.moneda} ${arrMonedas.filter(moneda=>moneda.id == transaccion.moneda)[0]?.nombre}</p>
									</div>
									<div style="width:110px">
										<h2>Cantidad</h2>
										<p style="margin-left:5px;">${transaccion.cantidad}</p>
									</div>
									<div style="width:110px">
										<h2>Valor actual</h2>
										<p style="margin-left:5px;">${transaccion.valor_actual}</p>
									</div>
								</div>
							</ion-label>
						</ion-item>`
			});
			DismissLoading();
		}

		dqs('listaTransacciones').innerHTML = listaTransacciones;
	} catch (error) {
		console.log(error);
	}
}


/*MODAL */
let modal = document.querySelector("ion-modal");


function cancel() {
  modal.dismiss(null, "cancel");
}

function CrearTransaccion() {
	modal.present();
}

async function confirm() {
	//dqs de formulario y confirmar
	let tipoOperacion = dqs("SelTipoOperacion").value;
	let monedaNuevaTransaccion = dqs("slcMonedaNuevaTransaccion").value;
	let cantidad = dqs("txtCantidad").value;

	
	if (tipoOperacion && monedaNuevaTransaccion && cantidad) {
		showLoading();
		const dto = new Object()
		dto.idUsuario = localStorage.getItem("UsuarioId");
		dto.tipoOperacion = tipoOperacion
		dto.moneda = monedaNuevaTransaccion
		dto.cantidad = cantidad
		dto.tipoOperacion = tipoOperacion
		dto.valorActual = arrMonedas.filter(moneda=>moneda.id == monedaNuevaTransaccion)[0]?.cotizacion

		try {
            const res = await fetch(`${URL_BASE}transacciones.php`,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
				"apikey":`${localStorage.getItem("ApiKey")}`
            },
            body:JSON.stringify(dto)       
        }) 
        const resjson = await res.json(); 
        console.log(resjson);
        if(resjson.codigo == 200)
        {
            toast("success",'Transacción creada con éxito.');
			modal.dismiss()
			dqs('listaTransacciones').innerHTML = '';
			CargarTransaccionesUsuario();
			DismissLoading();

        }
        } catch (error) {
            console.log(error);
        }
    }else{
        toast('warning','Ingrese Todos los Datos');
    }

}

async function MostrarMapaUsr()
{
	showLoading();
	await CargarDepartamentos()
	const usuarios = await CargarUsrDepartamentos();
	


	var map = L.map('mapa').setView([-34.90364050627812, -56.190527957423214], 7);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: 19
	}).addTo(map);

	arrDepartamentos.forEach(departamento => {
		const cantUsr = usuarios.filter(usuario => usuario.id ==departamento.id)[0].cantidad_de_usuarios
		L.marker([departamento.latitud, departamento.longitud]).addTo(map)
		.bindPopup(`Departamento ${departamento.nombre} tiene ${cantUsr} Usuarios.`)
		.openPopup(); 
	});

	DismissLoading();


}




async function MostrarMontoFinal()
{
	dqs("MontoFinalTitulo").innerHTML = '';
	await CargarTransaccionesUsuario();
	let MontoFinal = 0;
	transaccionesUsr.forEach(transaccion => {
		if(transaccion.tipo_operacion == 1)
		{
			MontoFinal -= (transaccion.cantidad * transaccion.valor_actual);
		}
		else
		{
			MontoFinal += (transaccion.cantidad * transaccion.valor_actual);
		}
	});

	dqs("MontoFinalTitulo").innerHTML += ' Monto Final : '+MontoFinal;
}

async function CargarUsrDepartamentos()
{

    try {
        const res = await fetch(`${URL_BASE}usuariosPorDepartamento.php`,
    {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
			"apikey":`${localStorage.getItem("ApiKey")}`
        },
               
    }) 
    const resjson = await res.json(); 
    console.log(resjson);
    if(resjson.codigo == 200)
    {
       
       return resjson.departamentos;
        
    }
    } catch (error) {
        console.log(error);
    }
	return []

}


async function MostrarMontoPorMoneda()
{
	
	await CargarTransaccionesUsuario();
	dqs('ListaMonedas').innerHTML = '';
	console.log(arrMonedas)
	arrMonedas.forEach(moneda => {
		
		let MontoFinal = 0;
		
		transaccionesUsr.filter(transaccion => transaccion.moneda == moneda.id && transaccion.tipo_operacion == 1).forEach(transaccionmon => {
		
			
			MontoFinal += (transaccionmon.cantidad * transaccionmon.valor_actual);
		
		
		});
		document.querySelector('#ListaMonedas').innerHTML += ` 
		<ion-item>
			<ion-avatar slot="start">
				<img src="${URL_IMG}${moneda.imagen}" />
			</ion-avatar>
			<ion-label>
				<h2>${moneda.nombre}</h2>
				<div style="display:flex"> 
					<h3>TotalInvertido:</h3>
					<p style="margin-left:5px;">${MontoFinal}</p>
				</div>
			</ion-label>
		</ion-item>`
	});

}

