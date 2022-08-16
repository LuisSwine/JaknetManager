const conexion = require('../database/db')
const {promisify} = require('util')
const { query } = require('../database/db')
const { nextTick } = require('process')

//CRUD DE PRODUCTOS
    //Registrar un tipo de producto
    exports.createTipoProducto = async(req, res, next) =>{
        try {
            let data = {
                nombre: req.params.nombre
            }
            let insert = "INSERT INTO cat018_tipo_producto SET ?"
            conexion.query(insert, data, function(error, results){
                if(error){
                    throw error
                }else{
                    res.redirect('/adminproductos')
                    return next()    
                }
            })    
        } catch (error) {
            console.log(error)
            return next()
        }
    }
    exports.selectTipoProducto = async(req, res, next) =>{
        try {
            conexion.query("SELECT * FROM cat018_tipo_producto", (error, filas)=>{
                if(error){
                    throw error;
                }else{
                    req.tipos = filas
                    return next()
                }
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }
    //Registrar una categoria de producto
    exports.createCategoriaProducto = async(req, res, next) =>{
        try {
            let data = {
                nombre: req.params.nombre
            }
            let insert = "INSERT INTO cat017_categoria_producto SET ?"
            conexion.query(insert, data, function(error, results){
                if(error){
                    throw error
                }else{
                    res.redirect('/adminproductos')
                    return next()    
                }
            })    
        } catch (error) {
            console.log(error)
            return next()
        }
    }
    exports.selectCategoriasProduct = async(req, res, next) =>{
        try {
            conexion.query("SELECT * FROM cat017_categoria_producto", (error, filas)=>{
                if(error){
                    throw error;
                }else{
                    req.categorias = filas
                    return next()
                }
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }
    //Registrar producto
    exports.createProduct = async(req, res, next) =>{
        try {
            let data = {
                sku: req.body.sku,
                descripcion: req.body.descripcion,
                categoria: req.body.categoria,
                tipo: req.body.tipo,
                marca: req.body.marca,
                precio: req.body.precio,
                enlace: req.body.enlace
            }
            let insert = "INSERT INTO cat016_productos SET ?"
            conexion.query(insert, data, function(error, results){
                if(error){
                    throw error
                }else{
                    res.redirect('/adminproductos')
                    return next()    
                }
            })    
        } catch (error) {
            console.log(error)
            return next()
        }
    }
    exports.selectProducts = async(req, res, next) =>{
        try {
            conexion.query("SELECT * FROM productos_view001", (error, filas)=>{
                if(error){
                    throw error;
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
    exports.selectProduct = async(req, res, next) =>{
        try {
            conexion.query("SELECT * FROM cat016_productos WHERE folio = ?", [req.params.folio], (error, fila)=>{
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
    exports.editProduct = async(req, res, next) =>{
        try {
            let folio       = req.body.folio
            let descripcion = req.body.descripcion
            let categoria   = req.body.categoria
            let tipo        = req.body.tipo
            let marca       = req.body.marca
            let precio      = req.body.precio
            let enlace      = req.body.enlace

            let sql = "UPDATE cat016_productos SET descripcion = ?, categoria = ?, tipo = ?, marca = ?, precio = ?, enlace = ? WHERE folio = ?"

            conexion.query(sql, [descripcion, categoria, tipo, marca, precio, enlace, folio], function(error, results){
                if(error){
                    throw error
                }else{
                    res.redirect('/adminproductos')
                    return next()
                }
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }
    exports.deleteProduct = async(req, res, next) =>{
        try {
            conexion.query("DELETE FROM cat016_productos WHERE folio = ?", [req.params.folio], function(error, filas){
                if(error){
                    throw error
                }else{
                    res.redirect('/adminproductos')
                    return next()
                }
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }
//FIN DEL CRUD DE PRODUCTOS

//INVENTARIO PERSONAL
    exports.selectInventarioUser = async(req, res, next)=>{
        try {
            conexion.query("SELECT * FROM material_usuario_view001 WHERE folio_usuario = ?", [req.query.usuario], (error, fila)=>{
                if(error){
                    throw error
                }else{
                    req.productos = fila
                    return next()
                }
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }