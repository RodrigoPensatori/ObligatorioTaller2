const URL_BASE = "https://crypto.develotion.com/";
const URL_IMG = "https://crypto.develotion.com/imgs/";
let UsuarioId = 0


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

async function Login() {
	let Usr = document.querySelector("#UsrLogin").value;
	let Psw = document.querySelector("#UsrPsw").value;

	try {
		const res = await fetch(`${URL_BASE}login.php`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				usuario: Usr,
				password: Psw,
			}),
		});
		const resjson = await res.json();

		if (resjson.codigo == 200) {
			localStorage.setItem("ApiKey", resjson.apiKey);
			UsuarioId = resjson.id;
			Ocultar();
			document.getElementById("Tab").classList.remove("ion-hide");
			CargarMonedas()
			CargarTransaccionesUsuario()
		}
	} catch (error) {
		console.log(error);
	}
}

function Registrarse() {
	Ocultar();

	CargarDepartamentos();
	//CargarCiudad(id);

	Mostrar("#registro");
}

async function CargarDepartamentos() {
	try {
		const res = await fetch(`${URL_BASE}departamentos.php`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const resjson = await res.json();
		console.log(resjson);
		if (resjson.codigo == 200) {
			resjson.departamentos.forEach((departamento) => {
				dqs(
					"#SelDep"
				).innerHTML += `<ion-select-option value="${departamento.id}">${departamento.nombre}</ion-select-option>`;
			});
			//dqs('#SelDep').addEventListener('change',CargarDepartamentos())
		}
	} catch (error) {
		console.log(error);
	}
}

async function CargarDepartamentos(id) {
	try {
		const res = await fetch(`${URL_BASE}ciudades.php?idDepartamento=${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const resjson = await res.json();
		console.log(resjson);
		if (resjson.codigo == 200) {
			resjson.ciudades.forEach((ciudades) => {
				dqs(
					"#SelCiudad"
				).innerHTML += `<ion-select-option value="${ciudad.id}">${ciudad.nombre}</ion-select-option>`;
			});
		}
	} catch (error) {
		console.log(error);
	}
}

async function CrearUsr() {
	let Usr = document.querySelector("#RegUsr").value;
	let Psw = document.querySelector("#RegPsw").value;
	let Departamento = document.querySelector("#RegDep").value;
	let City = document.querySelector("#RegCiudad").value;

	try {
		const res = await fetch(`${URL_BASE}usuarios.php`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				usuario: Usr,
				password: Psw,
				idDepartamento: 1,
			}),
		});
		const resjson = await res.json();
		console.log(resjson);
		if (resjson.codigo == 200) {
			localStorage.setItem("ApiKey", resjson.apiKey);
			Ocultar();
			document.getElementById("Tab").classList.remove("ion-hide");
		}
	} catch (error) {
		console.log(error);
	}

	Ocultar();
	Mostrar("#pantalla-login");
}


function CerrarSesion() {
	console.log("Cerrar sesion");
	localStorage.clear()
	document.getElementById("Tab").classList.add("ion-hide");
	Ocultar()
	Mostrar("#pantalla-login");
}

function setCurrentTab(e) {
	console.log(`e: ${e}`);
}


Eventos()

function Eventos() {
	dqs('#Tab').addEventListener("ionRouteDidChange", Navegar);
  }
  
function Navegar(evt) {
console.log(evt);
const ruta = evt.detail.to;
console.log(`first: ${ruta}`);

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
			
			resjson.transacciones.forEach(transaccion => {
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