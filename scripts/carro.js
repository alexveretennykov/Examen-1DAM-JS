(function () { //IIFE
    window.addEventListener('load', function () {
        //Recorre los 5 articulos 
        for (let i = 1; i < 6; i++) {
            document.getElementById('i' + i).addEventListener('dblclick', function () {
                if (getStock('i' + i)) {
                    // Añade al carrito el articulo de la id indicada
                    setAnyadirArticulo('i' + i);
                }
            });
        }

        //Posicion ventana carrito original
        const posOriginal = document.getElementById('cart_items').getBoundingClientRect();

        //Evento boton "Vaciar" carrito
        document.getElementById('btn_clear').addEventListener('click', function () {
            setVaciarCarrito();
        });

        //Evento boton "Izquierda" carrito
        document.getElementById('btn_prev').addEventListener('click', function () {
            setDesplazarCarrito(false, posOriginal);
        });

        //Evento boton "Derecha" carrito
        document.getElementById('btn_next').addEventListener('click', function () {
            setDesplazarCarrito(true, posOriginal);
        });

        // Intervalo para cambio de color de fondo del carrito
        let cambioColor = true;
        const intervalCol = setInterval(function () {
            let articulos = document.getElementById('cart_items').getElementsByClassName('title');
            let camiseta = false;
            let i = 0;

            do {
                if (articulos.length > 0) {
                    let art = articulos[i].textContent + "";
                    art = art.slice(0, 8);
                    console.log(art);
                    if (art == "Camiseta") {
                        camiseta = true;
                    }
                    i++
                }
            } while (i < articulos.length);

            let temp = document.getElementById('cart_items');
            if (!camiseta) {
                if (cambioColor) {
                    temp.style.background = 'red';
                    cambioColor = false;
                }
                else {
                    temp.style.background = 'yellow';
                    cambioColor = true;
                }
            }
        }, 1000);

        //Evento boton "Mostrar" mensajes
        document.getElementById('mostrar').addEventListener('click', function () {
            let i = 0

            const intervalCol1 = setInterval(() => {
                let temp = document.getElementById('mensajes');
                let temp2 = temp.getElementsByTagName("p");
                temp2[i].style.display = 'block';
                i++;

                if (i >= temp2.length) {
                    clearInterval(intervalCol1);
                }
            }, 1000);
        });

        //Evento boton "Ocultar" mensajes
        document.getElementById('ocultar').addEventListener('click', function () {
            let i = 0

            const intervalCol = setInterval(() => {
                let temp = document.getElementById('mensajes');
                let temp2 = temp.getElementsByTagName("p");
                temp2[i].style.display = 'none';
                i++;

                if (i >= temp2.length) {
                    clearInterval(intervalCol);
                }
            }, 1000);
        });
    });
})();

function setAnyadirArticulo(id) {
    //Hace una copia del articulo anadiendo una 'c' al principio de id.
    let articulo = getCopiaId(id);

    //Oculta la clase 'stock' de articulo añadido al carrito
    setOcultarClase('stock', articulo);

    //Cambia la propiedad css cursor del elemento y de todos sus hijos al valor indicado.
    setCurssor('default');

    //Añade un enlace de clase 'delete' al articulo del carrito. IMPORTANTE: Debe ir despues de setCurssor().
    setAnyadirEnlace(articulo, '', 'delete');

    //Añade el articulo en carrito
    setAddArtCarrito(articulo);

    //False = Resta -1 y True = Suma +1 al stock de articulo añadido
    setEditStock(id, false);

    // Añade evento al boton de eliminar articulo
    setBorrarArt(articulo);

    setAnchoCarrito();
}

function getCopiaId(id) {
    articulo = document.getElementById(id).cloneNode(true);
    articulo.setAttribute('id', 'c' + id);
    return articulo;
}

function setOcultarClase(clase, object) {
    let temp = object.getElementsByClassName(clase);
    for (let i = 0; i < temp.length; i++) {
        temp[i].style.display = 'none';
    }
}

function setCurssor(valor) {
    articulo.style.cursor = valor;
    if (articulo.childNodes != null) {
        let temp = articulo.childNodes;
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].nodeType != Node.TEXT_NODE)
                temp[i].style.cursor = valor;
        }
    }
}

function setAnyadirEnlace(articulo, href, clas) {
    let a = document.createElement('a');
    a.href = href;
    a.className = clas;
    articulo.insertBefore(a, articulo.firstChild);
}

function setAddArtCarrito(articulo) {
    //agrega el articulo
    document.getElementById('cart_items').appendChild(articulo);
    setSumUdsCarrito(true);
    setSumPrecioCarrito(articulo, true);

    let titulo = articulo.getElementsByClassName('title');
    let numStock = articulo.getElementsByClassName('stock');
    let num = parseInt(new String(numStock[0].textContent).substr(6, 10)) - 1;
    let texto = "Se ha añadido el artículo " + titulo[0].firstChild.textContent + ". Stock restante " + num + ".";
    let parrafo = document.createElement('p');
    parrafo.appendChild(document.createTextNode(texto));
    document.getElementById('mensajes').appendChild(parrafo);
}

function setEditStock(id, sumar) {
    let temp;
    let num;
    if (sumar) {
        temp = document.getElementById(id).getElementsByClassName('stock');
        num = parseInt(new String(temp[0].textContent).substr(6, 10)) + 1;

        temp[0].replaceChild(document.createTextNode('Stock ' + num), temp[0].firstChild);
    }
    else {
        temp = document.getElementById(id).getElementsByClassName('stock');
        num = parseInt(new String(temp[0].textContent).substr(6, 10)) - 1;

        temp[0].replaceChild(document.createTextNode('Stock ' + num), temp[0].firstChild);
    }

    if (num < 1) {
        temp[0].classList.add('agotado');
    } else {
        temp[0].classList.remove('agotado');
    }
}

//Comprueba si queda stock
function getStock(id) {
    let temp = document.getElementById(id).getElementsByClassName('stock');
    let num = parseInt(new String(temp[0].textContent).substr(6, 10));

    if (num > 0) {
        return true;
    } else {
        return false;
    }
}

//Añade evento al boton de eliminar articulo
function setBorrarArt(articulo) {
    articulo.getElementsByClassName('delete')[0].addEventListener('click', function (event) {

        if (document.getElementById('cart_items').children.length > 4) {
            const anchoArt = 120;
            const desplazamiento = anchoArt / 2;
            let carro = document.getElementById('cart_items');
            let width = getComputedStyle(carro, null).getPropertyValue('width');
            let ancho = Number(width.substr(0, width.length - 2));
            let left = getComputedStyle(carro, null).getPropertyValue('left');
            let posleft = Number(left.substr(0, left.length - 2));

            //Resta al ancho del carrito el ancho del articulo
            document.getElementById('cart_items').style.width = (ancho - anchoArt).toFixed() + 'px';

            //Evita hueco vacio al eliminar primer articulo cuando se visualiza solo la mitad de este
            if (posleft == -desplazamiento) {
                document.getElementById('cart_items').style.left = (posleft + desplazamiento).toFixed() + 'px';
            }
            //Evita que aparezcan huecos vacios si no se han realizado movimientos
            else if (posleft != 0) {
                document.getElementById('cart_items').style.left = (posleft + anchoArt).toFixed() + 'px';
            }
        }

        //Elimina articulo y resetea contadores de precio y unidades
        let idArtMenu = this.parentNode.id.substr(1, 2);
        setEditStock(idArtMenu, true);
        setSumUdsCarrito(false);
        setSumPrecioCarrito(articulo, false);
        articulo.remove();

        //Cancela el evento del enlace (se puede pulsar pero no redirecciona)
        event.preventDefault();

        let titulo = articulo.getElementsByClassName('title');
        let numStock = articulo.getElementsByClassName('stock');
        let num = parseInt(new String(numStock[0].textContent).substr(6, 10));
        let texto = "Se ha eliminado el artículo " + titulo[0].firstChild.textContent + ". Stock restante " + num + ".";
        let parrafo = document.createElement('p');
        parrafo.appendChild(document.createTextNode(texto));
        document.getElementById('mensajes').appendChild(parrafo);
    });
}

//Suma o resta value de cantidad de articulos en carrito
function setSumUdsCarrito(sumar) {
    if (sumar) {
        document.getElementById('citem').value++;
    }
    else {
        if (document.getElementById('citem').value > 0) {
            document.getElementById('citem').value--;
        }
    }
}

function setSumPrecioCarrito(articulo, sumar) {
    let temp = articulo.getElementsByClassName('price');
    let precioArticulo = parseInt(temp[0].textContent.substr(0, temp[0].textContent.length - 2));
    let temp2 = document.getElementById('cprice').value;
    let precioCarrito = parseInt(temp2.substr(0, temp2.length - 2));

    if (sumar) {
        document.getElementById('cprice').value = precioCarrito + precioArticulo + ' €';
    }
    else {
        document.getElementById('cprice').value = precioCarrito - precioArticulo + ' €';
    }
}

function setVaciarCarrito() {
    let temp = document.getElementById('cart_items').getElementsByClassName('delete');

    //Elimina los articulos uno a uno	
    while (temp.length > 0) {
        temp[0].click();
    }
}

function setAnchoCarrito() {
    let cantArt = document.getElementById('cart_items').children.length;
    let carro = document.getElementById('cart_items');
    let width = getComputedStyle(carro, null).getPropertyValue('width');
    let ancho = Number(width.substr(0, width.length - 2));
    const anchoArt = 120;

    if (cantArt > 4) {
        document.getElementById('cart_items').style.width = (ancho + anchoArt).toFixed() + 'px';
    }
}

function setDesplazarCarrito(derecha, posOriginal) {
    let carro = document.getElementById('cart_items');
    let left = getComputedStyle(carro, null).getPropertyValue('left');
    let leftNum = Number(left.substr(0, left.length - 2));
    const posActual = carro.getBoundingClientRect();
    const desplazamiento = 60;

    if (derecha && Math.round(posOriginal.left) <= Math.round(posActual.left) + (posActual.width - posOriginal.width) - desplazamiento) {
        document.getElementById('cart_items').style.left = (leftNum - desplazamiento) + 'px';
    }
    else if (!derecha && Math.round(posActual.left) + desplazamiento <= Math.round(posOriginal.left)) {
        document.getElementById('cart_items').style.left = (leftNum + desplazamiento) + 'px';
    }

    /*En vez de realizar los movimientos de 50px, los realizo de 60px, que es la mitad de la caja del articulo. 
    Así los movimientos son mas precisos y nunca se cortara la imagen, ni tampoco habran huecos vacios*/
}