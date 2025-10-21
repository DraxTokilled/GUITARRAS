import { db } from './guitarras.js';

// for(let i=0; i < db.length; i++) {
//     console.log(db[i].nombre);
// }
const divContainer = document.querySelector('main div');
const carritoContainer=document.querySelector('#carrito')

const carrito = []


const createDiv = (guitar) => {
    const div = document.createElement('div');
    div.className = 'col-md-6 col-lg-4 my-4 row align-items-center'
    const html =  ` <div class="col-4">
                    <img class="img-fluid" src="./img/${guitar.imagen}.jpg" alt="imagen guitarra">
                </div>
                <div class="col-8">
                    <h3 class="text-black fs-4 fw-bold text-uppercase">${guitar.nombre}</h3>
                    <p>${guitar.descripcion}</p>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit quae labore odit magnam in autem nesciunt, amet deserunt</p>
                    <p class="fw-black text-primary fs-3">$${guitar.precio}</p>
                    <button 
                        data-id="${guitar.id}"
                        type="button"
                        class="btn btn-dark w-100 "
                    >Agregar al Carrito</button>
                </div>`
    div.innerHTML = html
    return div
}

const createCart = (carrito)=>{
    const p='<p class="text-center">El carrito esta vacio</p>'
    let total = 0
    let html =` <table class="w-100 table">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>`
                    carrito.forEach(g => {
                        total += g.precio * g.cantidad
                        html += `<tr>
                    
                            <td>
                                <img class="img-fluid" src="./img/${g.imagen}.jpg" alt="imagen guitarra">
                            </td>
                            <td>${g.nombre}</td>
                            <td class="fw-bold">
                                    $${g.precio}
                            </td>
                            <td class="flex align-items-start gap-4">
                                <button
                                    type="button"
                                    class="btn btn-dark"
                                >-</button>
                                    ${g.cantidad}
                                <button
                                    type="button"
                                    class="btn btn-dark"
                                >+</button>
                            </td>
                            <td>
                                <button
                                    class="btn btn-danger"
                                    type="button"
                                >
                                    X
                                </button>
                            </td>
                        </tr>`})
                        html += ` </tbody>
                </table>

                            <p class="text-end">Total pagar: <span class="fw-bold">$${total}</span></p>
                            <button class="btn btn-dark w-100 mt-3 p-2">Vaciar Carrito</button>`
    if(carrito.length === 0){
        carritoContainer.innerHTML=p
    }else{
        carritoContainer.innerHTML=html
    }
}
//utilizando interadores
db.forEach( guitar => {
   divContainer.appendChild(createDiv(guitar))
})

const cardClicked = (e) => {
    if(e.target.classList.contains('btn')){
        //console.log('le diste al botón', e.target.getAttribute('data-id'));
        const idGuitar = e.target.getAttribute('data-id');
        //const indexdb = db.findIndex( guitar => guitar.id === Number(idGuitar));
        //si la guitarra ya existe en el carrito, solo aumentamos la cantidad en 1
        //en caso contrario, la agregamos al carrito con cantidad 1
        const idxGuitars = db.findIndex(g=> g.id === idGuitar);
        if( idxGuitars === -1){
            carrito.push({
            ...db[idGuitar - 1],
            cantidad: 1
        })
        } else {
            carrito[idxGuitars].cantidad++
        }
        createCart(carrito);
    }
}
createCart(carrito)

divContainer.addEventListener('click', cardClicked)