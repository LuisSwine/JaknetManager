const conexion = require('../database/db')
const {promisify} = require('util')
const { query } = require('../database/db')
const { nextTick } = require('process')

function calculateRuta(flag, cotizacion, proyecto, ubicacion, cliente){
    let ruta = '';
    switch(parseInt(flag)){
        case 0: ruta = `cotizacionMain?cotizacion=${cotizacion}&proyecto=${proyecto}&flag=0`; break;
        case 1: ruta = `cotizacionMain?cotizacion=${cotizacion}&proyecto=${proyecto}&cliente=${cliente}&flag=1`; break;
        case 2: ruta = `cotizacionMain?cotizacion=${cotizacion}&proyecto=${proyecto}&ubicacion=${ubicacion}&cliente=${cliente}&flag=${flag}`;break;
        case 3: ruta = `cotizacionMain?cotizacion=${cotizacion}&proyecto=${proyecto}&ubicacion=${ubicacion}&cliente=${cliente}&flag=${flag}`;break;
        case 4: ruta = `cotizacionMain?cotizacion=${cotizacion}&ubicacion=${ubicacion}&flag=4`; break;
        case 5: ruta = `cotizacionMain?cotizacion=${cotizacion}&ubicacion=${ubicacion}&cliente=${cliente}&flag=5`; break;
        case 6: ruta = `cotizacionMain?cotizacion=${cotizacion}&cliente=${cliente}&flag=6`;break;
    }
    return ruta;
}

//COTIZACIONES
exports.selectCotizaciones = async(req, res, next)=>{
    try {
        if(req.query.proyecto){
            conexion.query("SELECT * FROM cotizaciones_view001 WHERE folio_proyecto = ?", [req.query.proyecto], (error, fila)=>{
                if(error){
                    throw error;
                }else{
                    req.cotizaciones = fila
                    return next()
                }
            })
        }else if(req.query.ubicacion){
            conexion.query("SELECT * FROM cotizaciones_view001 WHERE folio_ubicacion = ?", [req.query.ubicacion], (error, fila)=>{
                if(error){
                    throw error;
                }else{
                    req.cotizaciones = fila
                    return next()
                }
            })
        } 
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.selectCotizacionesCliente = async(req, res, next)=>{
    try {
        conexion.query("SELECT * FROM cotizaciones_view001 WHERE folio_cliente = ?", [req.query.cliente], (error, fila)=>{
            if(error){
                throw error;
            }else{
                req.cotizaciones = fila
                return next()
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.createCotizacion = async(req, res, next)=>{
    try {
        let cliente = req.query.cliente
        let ubicacion = req.query.ubicacion
        let flag = req.query.flag
        let proyecto = req.query.proyecto

        conexion.query("SELECT folio FROM cat006_contactos WHERE cliente = ? LIMIT 1", [cliente], (error2, fila)=>{
            if(error2){
                throw error2
            }else{
                let data = {
                    proyecto: req.params.folio,
                    contacto: fila[0].folio 
                }
                let insert = "INSERT INTO cat013_cotizaciones SET ?"
                conexion.query(insert, data, (error3, fila2)=>{
                    if(error3){
                        throw error3
                    }else{
                        let ruta = `/profileProyect/${req.params.folio}` 
                        res.redirect(ruta)
                        return next()  
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.selectCotizacion = async(req, res, next)=>{
    try {
        let cotizacion = req.query.cotizacion
        conexion.query("SELECT * FROM cotizaciones_view001 WHERE folio = ?", [cotizacion], (error, fila)=>{
            if(error){
                throw error;
            }else{
                //Seleccionamos los valores de los productos
                conexion.query("SELECT SUM(costo_base) as subtotal_producto, SUM(subtotal_tecnicos) as subtotal_tecnicos, SUM(subtotal_supervisores) as subtotal_supervisores FROM productos_cotizacion_view001 WHERE cotizacion = ?", [cotizacion], (err2, fila2)=>{
                    if(err2){
                        throw err2
                    }else{
                        conexion.query("SELECT SUM(costo_servicio) as subtotal_servicio, SUM(subtotal_tecnicos) as subtotal_tecnicos, SUM(subtotal_supervisores) as subtotal_supervisores FROM servicios_cotizacion_view001 WHERE cotizacion = ?", [cotizacion], (err3, fila3)=>{
                            if(err3){
                                throw err3
                            }else{
                                let costoPersonal = 0 +fila2[0].subtotal_tecnicos + fila2[0].subtotal_supervisores + fila3[0].subtotal_tecnicos + fila3[0].subtotal_supervisores
                                let subtotal_productos = 0 + fila2[0].subtotal_producto
                                let subtotal_servicios = 0 + fila3[0].subtotal_servicio
                                let subtotal = 0 + costoPersonal + subtotal_productos + subtotal_servicios
                                let total = 0 + subtotal + (subtotal * (fila[0].rendimiento/100))+(subtotal * (fila[0].intereses/100))
                                req.costoPersonal = costoPersonal
                                req.subtotal_productos = subtotal_productos
                                req.subtotal_servicios = subtotal_servicios
                                req.subtotal = subtotal
                                req.total = total
                                req.cotizacion = fila
                                return next()
                            }
                        })
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.definirTasa = async(req, res, next)=>{
    try {
        let cotizacion = req.query.cotizacion
        let tasa = req.query.tasa

        let ruta = calculateRuta(req.query.flag, req.query.cotizacion, req.query.proyecto, req.query.ubicacion, req.query.cliente) 

        conexion.query("UPDATE cat013_cotizaciones SET rendimiento = ? WHERE folio = ?", [tasa, cotizacion], (error, fila)=>{
            if(error){
                throw error
            }else{
                res.redirect(`/${ruta}`)
                return next()
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.definirTecnico = async(req, res, next)=>{
    try {
        let cotizacion = req.query.cotizacion
        let costo = req.query.costo

        let ruta = calculateRuta(req.query.flag, req.query.cotizacion, req.query.proyecto, req.query.ubicacion, req.query.cliente) 

        conexion.query("UPDATE cat013_cotizaciones SET costo_tecnico = ? WHERE folio = ?", [costo, cotizacion], (error, fila)=>{
            if(error){
                throw error
            }else{
                res.redirect(`/${ruta}`)
                return next()
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.definirSupervisor = async(req, res, next)=>{
    try {
        let cotizacion = req.query.cotizacion
        let costo = req.query.costo

        let ruta = calculateRuta(req.query.flag, req.query.cotizacion, req.query.proyecto, req.query.ubicacion, req.query.cliente) 

        conexion.query("UPDATE cat013_cotizaciones SET costo_supervisor = ? WHERE folio = ?", [costo, cotizacion], (error, fila)=>{
            if(error){
                throw error
            }else{ 
                res.redirect(`/${ruta}`)
                return next()
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.definirIntereses = async(req, res, next)=>{
    try {
        let cotizacion = req.query.cotizacion
        let valor = req.query.valor

        let ruta = calculateRuta(req.query.flag, req.query.cotizacion, req.query.proyecto, req.query.ubicacion, req.query.cliente) 

        conexion.query("UPDATE cat013_cotizaciones SET intereses = ? WHERE folio = ?", [valor, cotizacion], (error, fila)=>{
            if(error){
                throw error
            }else{
                res.redirect(`/${ruta}`)
                return next()
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.addProducto = async(req, res, next) =>{
    try {
        let data = {
            producto: req.body.producto,
            cotizacion: req.body.cotizacion,
            costo: req.body.precio,
            cantidad: req.body.cantidad,
            tecnicos: req.body.tecnicos,
            supervisores: req.body.supervisores,
            dias: req.body.dias
        }

        let ruta = calculateRuta(req.body.flag, req.body.cotizacion, req.body.proyecto, req.body.ubicacion, req.body.cliente) 

        let insert = "INSERT INTO op008_lista_productos SET ?"
        conexion.query(insert, data, (error, result)=>{
            if(error){
                throw error
            }else{
                res.redirect(`/${ruta}`)
                return next() 
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.selectProductosCotizacion = async(req, res, next)=>{
    try {
        conexion.query("SELECT * FROM productos_cotizacion_view001 WHERE cotizacion = ?", [req.query.cotizacion], (error, filas)=>{
            if(error){
                throw error
            }else{
                req.productos = filas
                return next()
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.editarProductoCoti = async(req, res, next)=>{
    try {
        let folio        = req.body.folio
        let cantidad     = req.body.cantidad
        let tecnicos     = req.body.tecnicos
        let supervisores = req.body.supervisores
        let costo        = req.body.precio
        let dias         = req.body.dias

        let sql = "UPDATE op008_lista_productos SET cantidad = ?, tecnicos = ?, supervisores = ?, costo = ?, dias = ? WHERE folio = ?"

        let ruta = calculateRuta(req.body.flag, req.body.cotizacion, req.body.proyecto, req.body.ubicacion, req.body.cliente)

        conexion.query(sql, [cantidad, tecnicos, supervisores, costo, dias, folio], function(error, results){
            if(error){
                throw error
            }else{
                res.redirect(`/${ruta}`)
                return next()
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.selectProductoCoti = async(req, res, next)=>{
    try {
        conexion.query("SELECT * FROM productos_cotizacion_view001 WHERE folio = ?", [req.query.producto], (error, fila)=>{
            if(error){
                throw error;
            }else{
                req.producto = fila
                return next()
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.deleteProductCot = async(req, res, next)=>{
    try {
        let folio = req.query.folio
        let ruta = calculateRuta(req.query.flag, req.query.cotizacion, req.query.proyecto, req.query.ubicacion, req.query.cliente) 

        conexion.query("DELETE FROM op008_lista_productos WHERE folio = ?", [folio], (error, fila)=>{
            if(error){
                throw error
            }else{
                res.redirect(`/${ruta}`)
                return next() 
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.addService = async(req, res, next) =>{
    try {
        let data = {
            servicio: req.body.servicio,
            cotizacion: req.body.cotizacion,
            costo: req.body.precio,
            tecnicos: req.body.tecnicos,
            supervisores: req.body.supervisores,
            dias: req.body.dias
        }

        let ruta = calculateRuta(req.body.flag, req.body.cotizacion, req.body.proyecto, req.body.ubicacion, req.body.cliente) 

        let insert = "INSERT INTO op009_lista_servicios SET ?"
        conexion.query(insert, data, (error, result)=>{
            if(error){
                throw error
            }else{
                res.redirect(`/${ruta}`)
                return next() 
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.selectServiciosCotizacion = async(req, res, next)=>{
    try {
        conexion.query("SELECT * FROM servicios_cotizacion_view001 WHERE cotizacion = ?", [req.query.cotizacion], (error, filas)=>{
            if(error){
                throw error
            }else{
                req.servicios = filas
                return next()
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.editarServicioCoti = async(req, res, next)=>{
    try {
        let folio        = req.body.folio
        let tecnicos     = req.body.tecnicos
        let supervisores = req.body.supervisores
        let costo        = req.body.precio
        let dias         = req.body.dias

        let sql = "UPDATE op009_lista_servicios SET tecnicos = ?, supervisores = ?, costo = ?, dias = ? WHERE folio = ?"

        let ruta = calculateRuta(req.body.flag, req.body.cotizacion, req.body.proyecto, req.body.ubicacion, req.body.cliente)

        conexion.query(sql, [tecnicos, supervisores, costo, dias, folio], function(error, results){
            if(error){
                throw error
            }else{
                res.redirect(`/${ruta}`)
                return next()
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.selectServicioCoti = async(req, res, next)=>{
    try {
        conexion.query("SELECT * FROM servicios_cotizacion_view001 WHERE folio = ?", [req.query.servicio], (error, fila)=>{
            if(error){
                throw error;
            }else{
                req.servicio = fila
                return next()
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.deleteServiceCot = async(req, res, next)=>{
    try {
        let folio = req.query.folio
        let ruta = calculateRuta(req.query.flag, req.query.cotizacion, req.query.proyecto, req.query.ubicacion, req.query.cliente) 

        conexion.query("DELETE FROM op009_lista_servicios WHERE folio = ?", [folio], (error, fila)=>{
            if(error){
                throw error
            }else{
                res.redirect(`/${ruta}`)
                return next() 
            }
        })
    } catch (error) {
        console.log(error)
        return next()
    }
}
exports.deleteCotizacion = async(req, res, next)=>{
    try {
        let cotizacion = req.query.folio
        let ruta = calculateRuta(req.query.flag, req.query.cotizacion, req.query.proyecto, req.query.ubicacion, req.query.cliente)
        conexion.query("SELECT * FROM op008_lista_productos WHERE cotizacion = ?", [cotizacion], (err, fila)=>{
            if(err){
                throw err
            }else{
                if(fila.length === 0){
                    conexion.query("SELECT * FROM op009_lista_servicios WHERE cotizacion = ?", [cotizacion], (error2, fila2)=>{
                        if(error2){
                            throw error2
                        }else{
                            if(fila2.length === 0){
                                conexion.query("DELETE FROM cat013_cotizaciones WHERE folio = ?", [cotizacion], (error3, fila3)=>{
                                    if(error3){
                                        throw error3
                                    }else{ 
                                        res.redirect(`/${ruta}`)
                                        return next()  
                                    }
                                })
                            }else{
                                res.render('Error/showInfo', {
                                    title: 'Servicio(s) Cotizado(s)',
                                    alert: true,
                                    alertTitle: 'INFORMACION',
                                    alertMessage: `La cotizacion ${cotizacion} tiene almenos un servicio cotizado y no puede eliminarse`,
                                    alertIcon: 'info',
                                    showConfirmButton: true,
                                    timer: 8000,
                                    ruta: `${ruta}` 
                                })
                                return next()
                            }
                        }
                    })
                }else{
                    res.render('Error/showInfo', {
                        title: 'Producto(s) Cotizado(s)',
                        alert: true,
                        alertTitle: 'INFORMACION',
                        alertMessage: `La cotizacion ${cotizacion} tiene almenos un producto cotizado y no puede eliminarse`,
                        alertIcon: 'info',
                        showConfirmButton: true,
                        timer: 8000,
                        ruta: `${ruta}` 
                    })
                    return next()
                }
            }
        })
    }catch (error) {
        console.log(error)
        return next()
    }
}