//Llamamos tambien al modulo de express
const express = require('express')

const router = express.Router()
const { authorized } = require('../database/db')

//INSTANCIACION A NUESTROS CONTROLADORES
const authController         = require('../controllers/authController')
const clientController       = require('../controllers/clientController')
const ubicacionesController  = require('../controllers/ubicacionesController') 
const proveedoresController  = require('../controllers/proveedoresControllers')
const marcasController       = require('../controllers/marcasController')
const unidadesController     = require('../controllers/unidadesController')
const serviciosController    = require('../controllers/serviciosController')
const productosController    = require('../controllers/productosController')
const contactosController    = require('../controllers/contactsController')
const areasController        = require('../controllers/areasController')
const tareasController       = require('../controllers/tareasController')
const cotizacionesController = require('../controllers/cotizacionesController')
const proyectosController    = require('../controllers/proyectosController')
const viaticosController     = require('../controllers/viaticosController')
const usuarioController      = require('../controllers/usuarioController')

//DASHBOARDS 
    router.get('/', authController.isAuthenticated, authController.selectLatsMoves, usuarioController.proyectosAsistencia, tareasController.selectInfoTareasUserDashboard, (req, res)=>{
        res.render('superadminindex', {userName: req.user, depositos: req.depositos, proyectosAsist: req.proyectosAsist, tareas: req.tareas})
    })
    router.get('/registrarAsistencia', usuarioController.resgistrarAsistencia)
    router.get('/misTareas', authController.isAuthenticated, tareasController.selectInfoTareasUser, tareasController.obtenerReportes, (req, res)=>{
        res.render('Tareas/misTareas', {user: req.user, tareas: req.tareas, reportes: req.reportes})
    })
    router.get('/entregarTarea', tareasController.entregarTarea)
    router.get('/subirReporteTarea', tareasController.subirReporteTarea)
    //Asistencias 
    router.get('/misAsistencias', authController.isAuthenticated, authController.reporteAsistencia, (req, res)=>{
        res.render('reporteAsistencia', {user: req.user, asistencias: req.asistencias, flag: req.query.flag})
    })
    router.get('/reporteAsistencia', authController.isAuthenticated, authController.reporteAsistencia, (req, res)=>{
        res.render('reporteAsistencia', {user: req. user, asistencias: req.asistencias, flag: req.query.flag})
    })
    router.get('/generarReporteAsistencia', authController.isAuthenticated, authController.reporteGeneralAsistencia, (req, res)=>{
        res.render('Usuarios/reporteAsistencia', {user: req.user, asistencias: req.asistencias})
    })
    router.get('/miInventario', authController.isAuthenticated, authController.selectUser, productosController.selectInventarioUser, (req, res)=>{
        res.render("Minventario/miInventario", {user: req.user, usuario: req.usuario, productos: req.productos, flag: req.query.flag})
    })
    router.get('/moverInventUser', authController.isAuthenticated, authController.selectUser, authController.selectInvent, unidadesController.selectUnits, (req, res)=>{
        res.render('Minventario/formAddElements', {user: req.user, usuario: req.usuario, productos: req.inventario, unidades: req.unidades, flag: req.query.flag})
    })
    router.get('/returnAll2Invent', usuarioController.returnAll2Invent)
    router.get('/modificarPersonalInvent', usuarioController.modificarInventPersonal)
    router.post('/addProduct2User', usuarioController.addInvent2User)
//FIN DE DASHBOARDS

//LOGIN, LOGOUT & REGISTRO
    //DEFINIMOS LA RUTA PARA EL LOGIN
    router.get('/login', (req, res)=>{
        res.render('login', {alert: false})
    })
    router.get('/register', (req, res)=>{
        res.render('register')
    })
    router.get('/logout', authController.logout)
    router.post('/login', authController.login)
//FIN DE SECCION

//Mi perfil
    router.get('/miPerfil', authController.isAuthenticated, (req, res)=>{
        res.render('miPerfil', {user: req.user})
    })
//


//DEFINICION DE RUTAS DE ACCION DE CRUD DE USUARIOS
//DEFINIMOS LA RUTA PARA LA GESTION DE USUARIOS DE ADMIN & SUPERADMIN
    router.get('/adminusers', authController.isAuthenticated, authController.selectUsers, (req, res)=>{
        res.render('Usuarios/usersAdmin', {user: req.user, usuarios: req.usuarios})
    })
    router.get('/formcreateusers', authController.isAuthenticated, (req, res)=>{
        res.render('Usuarios/formCreateUser', {user: req.user})
    })
    router.get('/editarusuario', authController.isAuthenticated, authController.selectUser, (req, res)=>{
        res.render('Usuarios/editUser', {user: req.user, usuario: req.usuario})
    })
    router.get('/selectUsers', authController.selectUsers)
    router.get('/selectUser/:folio', authController.selectUser)
    router.get('/deleteUser/:folio', authController.deleteUser)
    router.post('/createUser', authController.createUser)
    router.post('/editUser', authController.editUser)
//FIN DE LAS RUTAS PARA LA GESTION DE USUARIOS

//DEFINIMOS LAS RUTAS DE ACCION PARA EL CRUD DE CLIENTES
//DEFINIMOS LA RUTA PARA LA GESTION DE CLIENTES DE ADMIN & SUPERADMIN
    router.get('/adminclients', authController.isAuthenticated, clientController.selectClients, (req, res)=>{
        res.render('Clientes/clientsAdmin', {user: req.user, clientes: req.clientes})
    })
    router.get('/perfilCliente', authController.isAuthenticated, clientController.selectClient, ubicacionesController.selectUbicaciones, contactosController.selectContacts, authController.selectProyectos, cotizacionesController.selectCotizacionesCliente, clientController.selectTipoClientes, clientController.selectTipoServicios, (req, res)=>{
        res.render('Clientes/perfilCliente', {user: req.user, cliente: req.cliente, ubicaciones: req.ubicaciones, contactos: req. contactosCliente, proyectos: req.proyectos, cotizaciones: req.cotizaciones, tiposCliente: req.tipos, tiposServicios: req.servicios})
    })
    router.get('/formcreateclient', authController.isAuthenticated, clientController.selectTipoServicios, (req, res)=>{
        res.render('Clientes/formCreateClient', {user: req.user, servicios: req.servicios})
    })
    router.get('/deleteClient/:folio', clientController.deleteClient)
    router.get('/cambiarNombreCliente', clientController.editNameClient)
    router.get('/editServicioCliente', clientController.editServicioCliente)
    router.get('/editTipoCliente', clientController.editTipoCliente)
    router.get('/deleteUbicacionCliente', clientController.deleteUbicacionCliente)
    router.get('/deleteProyectoCliente', proyectosController.deleteProyectoClient)
    router.post('/createClient', clientController.createClient)
//FIN DE LAS RUTAS PARA LA GESTION DE CLIENTES

//DEFINIMOS LAS RUTAS DE ACCION PARA EL CRUD DE CONTACTOS
//DEFINIMOS LA RUTA PARA GESTION DE CONTACTOS DE ADMIN & SUPERADMIN
    router.get('/admincontactos', authController.isAuthenticated, contactosController.selectContacts, (req, res)=>{
        res.render('Contactos/contactsAdmin', {user: req.user, contactos: req.contactos, isCliente: false})
    })
    router.get('/contactsclient/:folio', authController.isAuthenticated, contactosController.selectContacts, clientController.selectClient, (req, res)=>{
        res.render('Contactos/contactsAdmin', {user: req.user, contactos: req.contactos, cliente: req.cliente, isCliente: true})
    })
    router.get('/formcreatecontact', authController.isAuthenticated, clientController.selectClients, (req, res)=>{
        res.render('Contactos/formCreateContact', {user: req.user, clientes: req.clientes, clienteSelected: req.query.cliente, flag: req.query.flag})
    })
    router.get('/editarcontacto', authController.isAuthenticated, clientController.selectClients, contactosController.selectContact, (req, res)=>{
        res.render('Contactos/editContact', {user: req.user, clientes: req.clientes, contacto: req.contacto, clienteSelected: req.query.cliente, flag: req.query.flag})
    })
    router.get('/deleteContact', contactosController.deleteContact)
    router.post('/createContact', contactosController.createContact)
    router.post('/editContact', contactosController.editContact) 
//FIN DE LAS RUTAS PARA LA GESTION DE CONTACTOS

//DEFINIMOS LAS RUTAS DE ACCION PARA EL CRUD DE LAS UBICACIONES
    router.get('/adminubicaciones', authController.isAuthenticated, ubicacionesController.selectUbicaciones, (req, res)=>{
        res.render('Ubicaciones/ubicacionesAdmin', {user: req.user, ubicaciones: req.ubicaciones, isCliente: false})
    })
    router.get('/ubicacionesclient/:folio', authController.isAuthenticated, ubicacionesController.selectUbicaciones, clientController.selectClient, (req, res)=>{
        res.render('Ubicaciones/ubicacionesAdmin', {user: req.user, ubicaciones: req.ubicaciones, cliente: req.cliente, isCliente: true})
    })
    router.get('/formcreateubicacion', authController.isAuthenticated, clientController.selectClients, (req, res)=>{
        res.render('Ubicaciones/formCreateUbi', {user: req.user, clientes: req.clientes, clienteSelected: req.query.cliente, flag: req.query.flag})
    })
    router.get('/editarubi/:folio', authController.isAuthenticated, clientController.selectClients, ubicacionesController.selectUbicacion, (req, res)=>{
        res.render('Ubicaciones/editUbi', {user: req.user, clientes: req.clientes, ubicacion: req.ubicacion})
    })
    router.get('/perfilUbicacion', authController.isAuthenticated, ubicacionesController.selectUbicacion, areasController.selectAreas, contactosController.selectContactsUbi, authController.selectProyectos, cotizacionesController.selectCotizaciones, (req, res)=>{
        res.render('Ubicaciones/perfilUbi', {user: req.user, ubicacion: req.ubicacion, areas: req.areas, contactos: req.contactos, proyectos: req.proyectos, cotizaciones: req.cotizaciones, clienteSelected: req.query.cliente, flag: req.query.flag})
    })
    router.get('/relacionConUbi', authController.isAuthenticated, ubicacionesController.selectUbicacion, contactosController.selectContacts, (req, res)=>{
        res.render('Ubicaciones/addContact', {user: req.user, ubicacion: req.ubicacion, contactos: req.contactosCliente, clienteSelected: req.query.cliente, flag: req.query.flag})
    })
    router.get('/formCotUbi', authController.isAuthenticated, authController.selectProyectos, (req, res)=>{
        res.render('Ubicaciones/fromCotUbi', {user: req.user, proyectos: req.proyectos, ubicacion: req.query.ubicacion, cliente: req.query.cliente, flag: req.query.flag})
    })
    router.get('/cambiarNombreUbi', ubicacionesController.editNombreUbicacion)
    router.get('/cambiarDireccionUbi', ubicacionesController.editDireccionUbicacion)
    router.get('/cambiarNombreMarca', marcasController.editNombreMarca)
    router.get('/deleteContOfUbi', authController.deleteContOfUbi)
    router.get('/deleteUbi/:folio', ubicacionesController.deleteUbicacion)
    router.get('/deleteProyectoUbi', proyectosController.deleteProyectoUbicacion)
    router.post('/addCotUbi', ubicacionesController.addCotUbi)
    router.post('/relacionarContactoUbicacion', authController.relateContWUbi)
    router.post('/createUbi', ubicacionesController.createUbicacion)
    router.post('/editUbi', ubicacionesController.editUbicacion)
//FIN DE LAS RUTAS PARA LA GESTION DE LAS UBICACIONES

//RUTAS PARA LA GESTION DE LAS AREAS
    router.get('/adminareas', authController.isAuthenticated, areasController.selectAreas, ubicacionesController.selectUbicacion, (req, res)=>{
        res.render('Areas/areasAdmin', {user: req.user, areas: req.areas, ubicacion: req.ubicacion, clienteSelected: req.query.cliente, flag: req.query.flag})
    })
    router.get('/formcreatearea', authController.isAuthenticated, ubicacionesController.selectUbicacion, (req, res)=>{
        res.render('Areas/formCreateArea', {user: req.user, ubicacion: req.ubicacion, clienteSelected: req.query.cliente, flag: req.query.flag})
    })
    router.get('/editararea', authController.isAuthenticated, areasController.selectArea, (req, res)=>{
        res.render('Areas/editArea', {user: req.user, area: req.area, ubicacion: req.query.ubicacion, clienteSelected: req.query.cliente, flag: req.query.flag})
    })
    router.get('/deleteArea', areasController.deleteArea)
    router.post('/createArea', areasController.createArea)
    router.post('/editArea', areasController.editArea)
//FIN DE LAS RUTAS PARA LA GESTION DE LAS AREAS

//RUTAS PARA LA GESTION DE PROVEEDORES
    router.get('/adminproveedores', authController.isAuthenticated, proveedoresController.selectProvs, (req, res) =>{
        res.render('Proveedores/provAdmin', {user: req.user, proveedores: req.proveedores})
    })
    router.get('/editarproveedor', authController.isAuthenticated, proveedoresController.selectProveedor, (req, res)=>{
        res.render('Proveedores/editProv', {user: req.user, proveedor: req.proveedor})
    })
    router.get('/formcreateprov', authController.isAuthenticated, (req, res)=>{
        res.render('Proveedores/formCreateProv', {user: req.user})
    })
    router.get('/perfilProveedor', authController.isAuthenticated, proveedoresController.selectProveedor, proveedoresController.selectMarcasProveedor, proveedoresController.selectProductosProveedor, (req, res)=>{
        res.render('Proveedores/profileProv', {user: req.user, proveedor: req.proveedor, marcas: req.marcas, productos: req.productos})
    })
    router.get('/relateMarcaProveedor', authController.isAuthenticated, marcasController.selectBrands, (req, res)=>{
        res.render('Proveedores/formRelateMarcaProveedor', {user: req.user, marcas: req.marcas, proveedor: req.query.proveedor})
    })
    router.get('/deleteProv/:folio', proveedoresController.deleteProv)
    router.get('/deleteMarcaProveedor', proveedoresController.deleteMarcaProveedor)
    router.post('/relacionarMarcaProveedor', proveedoresController.relateMarcaProveedor)
    router.post('/editProv', proveedoresController.editProv)
    router.post('/createProv', proveedoresController.createProv)
//FIN DE LAS RUTAS PARA LOS PROVEEDORES

//RUTAS PARA LAS MARCAS
    router.get('/adminmarcas', authController.isAuthenticated, marcasController.selectBrands, (req, res)=>{
        res.render('Marcas/marcasAdmin', {user: req.user, marcas: req.marcas})
    })
    router.get('/perfilMarca', authController.isAuthenticated, marcasController.selectBrand, marcasController.selectProveedoresMarca, marcasController.selectProductosMarca, (req, res)=>{
        res.render('Marcas/profileMarca', {user: req.user, marca: req.marca, proveedores: req.proveedores, productos: req.productos})
    })
    router.get('/relateProveedorMarca', authController.isAuthenticated, proveedoresController.selectProvs, (req, res)=>{
        res.render('Marcas/formRelateProveedorMarca', {user: req.user, proveedores: req.proveedores, marca: req.query.marca})
    })
    router.get('/formcreatemarca', authController.isAuthenticated, (req, res) =>{
        res.render('Marcas/formCreateBrand', {user: req.user})
    })
    router.get('/deleteProveedorMarca', marcasController.deleteProveedorMarca)
    router.get('/deleteMarca/:folio', marcasController.deleteBrand)
    router.post('/relacionarProveedorMarca', marcasController.relateProveedorMarca)
    router.post('/createBrand', marcasController.createBrand)
//FIN DE LAS RUTAS PARA LAS MARCAS

//RUTAS PARA LOS PRODUCTOS
    router.get('/adminproductos', authController.isAuthenticated, productosController.selectProducts, (req, res)=>{
        res.render('Productos/productAdmin', {user: req.user, productos: req.productos})
    })
    router.get('/formcreateproducts', authController.isAuthenticated, productosController.selectCategoriasProduct, productosController.selectTipoProducto, marcasController.selectBrands, (req, res)=>{
        res.render('Productos/formCreateProduct', {user: req.user, categorias: req.categorias, tipos: req.tipos, marcas: req.marcas})
    })
    router.get('/editarproducto/:folio', authController.isAuthenticated, productosController.selectProduct, productosController.selectCategoriasProduct, productosController.selectTipoProducto, marcasController.selectBrands, (req, res)=>{
        res.render('Productos/editProduct', {user: req.user, producto: req.producto, categorias: req.categorias, tipos: req.tipos, marcas: req.marcas})
    })
    router.get('/createTipo/:nombre', productosController.createTipoProducto)
    router.get('/createCategoria/:nombre', productosController.createCategoriaProducto)
    router.get('/deleteProduct/:folio', productosController.deleteProduct)
    router.post('/createProduct', productosController.createProduct)
    router.post('/editProduct', productosController.editProduct)
//FIN DE LAS RUTAS PARA LA GESTION DE SERVICIOS

//RUTAS PARA LOS SERVICIOS
    router.get('/adminservicios', authController.isAuthenticated, serviciosController.selectServicios, (req, res)=>{
        res.render('Servicios/serviciosAdmin', {user: req.user, servicios: req.servicios})
    })
    router.get('/formcreateservicios', authController.isAuthenticated, productosController.selectCategoriasProduct, (req, res)=>{
        res.render('Servicios/formCreateServicio', {user: req.user, categorias: req.categorias})
    })
    router.get('/editarservicio/:folio', authController.isAuthenticated, serviciosController.selectServicio, productosController.selectCategoriasProduct, (req, res)=>{
        res.render('Servicios/editServicio', {user: req.user, servicio: req.servicio, categorias: req.categorias})
    })
    router.get('/deleteServicio/:folio', serviciosController.deleteServicio)
    router.post('/editService', serviciosController.editServicio)
    router.post('/createService', serviciosController.createServicio)
//FIN DE LAS RUTAS DE LOS SERVICIOS

//RUTAS PARA EL INVENTARIO
    router.get('/admininventario', authController.isAuthenticated, authController.selectInvent, (req, res)=>{
        res.render('Inventario/inventAdmin', {user: req.user, inventario: req.inventario})
    })
    router.get('/adminunidades', authController.isAuthenticated, unidadesController.selectUnits, (req, res)=>{
        res.render('Unidades/unidadesAdmin', {user: req.user, unidades: req.unidades})
    })
    router.get('/formcreateunit', authController.isAuthenticated, (req, res)=>{
        res.render('Unidades/formCreateUnit', {user: req.user})
    })
    router.get('/editarunidad/:folio', authController.isAuthenticated, unidadesController.selectUnit, (req, res)=>{
        res.render('Unidades/editUnit', {user: req.user, unidad: req.unidad})
    })
    router.get('/formadd2invent', authController.isAuthenticated, productosController.selectProducts, unidadesController.selectUnits, (req, res)=>{
        res.render('Inventario/formMoveInvent', {user: req.user, productos: req.productos, unidades: req.unidades})
    })
    router.get('/deleteUnidad/:folio', unidadesController.deleteUnit)
    router.post('/editUnit', unidadesController.editUnit)
    router.post('/moverInventario', authController.moverInventario)
    router.post('/createUnit', unidadesController.createUnit)

//Rutas de viaticos
    router.get('/adminviaticos', authController.isAuthenticated, authController.selectViaticos, (req, res)=>{
        res.render('Viaticos/viaticosAdmin', {user: req.user, operaciones: req.operaciones})
    })

//RUTAS PROYECTOS
    router.get('/adminproyectos', authController.isAuthenticated, authController.selectProyectos, (req, res)=>{
        res.render('Proyectos/proyectosAdmin', {user: req.user, proyectos: req.proyectos, flag: req.flag})
    })
    router.get('/adminProject/:folio', authController.isAuthenticated, authController.selectProyectos, clientController.selectClient, (req, res) =>{
        res.render('Proyectos/proyectosAdmin', {user: req.user, proyectos: req.proyectos, flag: req.flag, cliente: req.cliente})
    })
    router.get('/formcreateproyect', authController.isAuthenticated, clientController.selectClient, ubicacionesController.selectUbicaciones, (req, res)=>{
        res.render('Proyectos/formCreateProyect', {user: req.user, cliente: req.cliente, ubicaciones: req.ubicaciones, ubicacion: req.query.ubicacion, flag: req.query.flag})
    })
    router.get('/profileProyect', authController.isAuthenticated, authController.selectProyect, authController.selectEtapasProyecto, authController.selectRolesProyecto, authController.selectContactsProyect, cotizacionesController.selectCotizaciones, (req, res) =>{
        res.render('Proyectos/profileProyect', {user: req.user, proyecto: req.proyecto, etapas: req.etapas, roles: req.roles, contactos: req.contactos, cotizaciones: req.cotizaciones, cliente: req.query.cliente, ubicacion: req.query.ubicacion, flag: req.query.flag})
    })
    router.get('/cambiarNombreProyecto', proyectosController.cambiarNombreProyecto)
    router.post('/createProject', authController.createProject)
//FIN DEL FRUD DE PROYECTOS 

//ETAPAS
    router.get('/formaddetapa', authController.isAuthenticated, authController.selectProyect, authController.selectAreasProyect, (req, res)=>{
        res.render('Proyectos/formAddEtapa', {user: req.user, proyecto: req.proyecto, areas: req.areas, cliente: req.query.cliente, ubicacion: req.query.ubicacion, flag: req.query.flag})
    })
    router.get('/editarEtapa', authController.isAuthenticated, proyectosController.selectEtapa, authController.selectAreasProyect, (req, res)=>{
        res.render('Proyectos/editarEtapa', {user: req.user, etapa: req.etapa, areas: req.areas, proyecto: req.query.proyecto, cliente: req.query.cliente, ubicacion: req.query.ubicacion, flag: req.query.flag})
    })
    router.get('/deleteEtapa', proyectosController.deleteEtapa)
    router.post('/editEtapa', proyectosController.editarEtapa)
    router.post('/addEtapa', proyectosController.addEtapa)
//FIN DEL CRUD DE ETAPAS 

//ROLES
    router.get('/formasignroles', authController.isAuthenticated, authController.selectProyect, authController.selectUsers, authController.selectRoles, (req, res)=>{
        res.render('Proyectos/formAsignRol', {user: req.user, proyecto: req.proyecto , usuarios: req.usuarios, roles: req.roles, ubicacion: req.query.ubicacion, cliente: req.query.cliente, flag: req.query.flag})
    })
    router.get('/deleteRol', proyectosController.deleteRol)
    router.post('/asignRol', proyectosController.asignRolProyect)
//FIN DEL CRUD DE ROLES

//TAREAS
    router.get('/tareasetapa', authController.isAuthenticated, proyectosController.selectEtapa, tareasController.selectTareasEtapa, (req, res)=>{
        res.render('Proyectos/Tareas/tareasAdmin', {user: req.user, etapa: req.etapa, tareas: req.tareas, proyecto: req.query.proyecto, cliente: req.query.cliente, ubicacion: req.query.ubicacion, flag: req.query.flag})
    })
    router.get('/formaddtask', authController.isAuthenticated, proyectosController.selectEtapa, tareasController.selectTiposTarea, (req, res)=>{
        res.render('Proyectos/Tareas/formAddTask', {user: req.user, etapa: req.etapa, tipos: req.tipos, proyecto: req.query.proyecto, cliente: req.query.cliente, ubicacion: req.query.ubicacion, flag: req.query.flag})
    })
    router.post('/createTarea', tareasController.createTarea)
    router.get('/asignarTarea', authController.isAuthenticated, tareasController.validateTarea, tareasController.usuariosAsignados, (req, res)=>{
        res.render('Proyectos/Tareas/asignTask', {user: req.user, tarea: req.tarea, usuarios: req.usuarios, etapa: req.query.etapa, proyecto: req.query.proyecto, cliente: req.query.cliente, ubicacion: req.query.ubicacion, flag: req.query.flag})
    })
    router.post('/asignTask', tareasController.asignarTarea)
    router.get('/editarTarea', authController.isAuthenticated, tareasController.selectTarea, tareasController.selectTiposTarea, (req, res)=>{
        res.render('Proyectos/Tareas/editarTarea', {user: req.user, tarea: req.tarea, tipos: req.tipos, etapa: req.query.etapa, proyecto: req.query.proyecto, cliente: req.query.cliente, ubicacion: req.query.ubicacion, flag: req.query.flag})
    })
    router.post('/editTarea', tareasController.editarTarea)
    router.get('/showInfoTarea', tareasController.showAsignTarea)
    router.get('/editarAsignacionTarea', authController.isAuthenticated, tareasController.selectAsignTask, tareasController.usuariosAsignados, (req, res)=>{
        res.render('Proyectos/Tareas/editarAsign', {user: req.user, asignacion: req.asignacion, usuarios: req.usuarios, etapa: req.query.etapa, proyecto: req.query.proyecto, cliente: req.query.cliente, ubicacion: req.query.ubicacion, flag: req.query.flag})
    })
    router.get('/deleteTask', tareasController.deleteTarea)
    router.post('/reasignTask', tareasController.editarAsignacion)

//COTIZACIONES
    router.get('/formCreateCotClient', authController.isAuthenticated, ubicacionesController.selectUbicaciones, authController.selectProyectos, (req, res)=>{
        res.render('Clientes/formCreateCot', {user: req.user, ubicaciones: req.ubicaciones, proyectos: req.proyectos, cliente: req.query.cliente})
    })
    router.get('/cotizacionMain', authController.isAuthenticated, clientController.selectClient, cotizacionesController.selectCotizacion, cotizacionesController.selectProductosCotizacion, cotizacionesController.selectServiciosCotizacion, (req, res)=>{
        res.render('Proyectos/Cotizaciones/mainCotizacion', {user: req.user, clienteSelected: req.cliente, cotizacion: req.cotizacion, costoPersonal: req.costoPersonal, subtotal_productos: req.subtotal_productos, subtotal_servicios: req.subtotal_servicios, subtotal: req.subtotal, total: req.total, productos: req.productos, servicios: req.servicios, proyecto: req.query.proyecto, flag: req.query.flag, cliente: req.query.cliente, ubicacion: req.query.ubicacion})
    })
    router.post('/addCotClient', clientController.addCotClient)
    router.get('/createcotizacionProyecto', proyectosController.createCotizacionProyecto)
    router.get('/deleteCotiProy', proyectosController.deleteCotizacion)
    router.get('/deleteCotiCliente', clientController.deleteCotizacion)
    router.get('/deleteCotiUbi', ubicacionesController.deleteCotizacion)

//VALORES COTIZACION
    router.get('/definirTasa', cotizacionesController.definirTasa)
    router.get('/definirTecnico', cotizacionesController.definirTecnico)
    router.get('/definirSupervisor', cotizacionesController.definirSupervisor)
    router.get('/definirIntereses', cotizacionesController.definirIntereses)

//PRODUCTOS COTIZACION
    router.get('/formaddproduct', authController.isAuthenticated, productosController.selectProducts, (req, res)=>{
        res.render('Proyectos/Cotizaciones/addProduct', {user: req.user, productos: req.productos, cotizacion: req.query.cotizacion, proyecto: req.query.proyecto, ubicacion: req.query.ubicacion, cliente: req.query.cliente, flag: req.query.flag})
    })
    router.post('/addProductCot', cotizacionesController.addProducto)
    router.get('/editarProductoCotizacion', authController.isAuthenticated, cotizacionesController.selectProductoCoti, (req, res)=>{
        res.render('Proyectos/Cotizaciones/editProduct', {user: req.user, producto: req.producto, cotizacion: req.query.cotizacion, proyecto: req.query.proyecto, ubicacion: req.ubicacion, cliente: req.query.cliente, flag: req.query.flag})
    })
    router.post('/editPorductCot', cotizacionesController.editarProductoCoti)
    router.get('/deleteProductCot', cotizacionesController.deleteProductCot)

//SERVICIOS COTIZACION
    router.get('/formaddservice', authController.isAuthenticated, serviciosController.selectServicios, (req, res)=>{
        res.render('Proyectos/Cotizaciones/addService', {user: req.user, servicios: req.servicios, cotizacion: req.query.cotizacion, proyecto: req.query.proyecto, ubicacion: req.ubicacion, cliente: req.query.cliente, flag: req.query.flag})
    })
    router.get('/editarServicioCotizacion', authController.isAuthenticated, cotizacionesController.selectServicioCoti, (req, res)=>{
        res.render('Proyectos/Cotizaciones/editService', {user: req.user, servicio: req.servicio, cotizacion: req.query.cotizacion, proyecto: req.query.proyecto, ubicacion: req.ubicacion, cliente: req.query.cliente, flag: req.query.flag})
    })
    router.get('/deleteServiceCot', cotizacionesController.deleteServiceCot)
    router.get('/deleteCoti', cotizacionesController.deleteCotizacion)
    router.post('/addServiceCot', cotizacionesController.addService)
    router.post('/editServiceCot', cotizacionesController.editarServicioCoti)
//FIN DE LOS SERVICIOS DE COTIZACION

//VIATICOS PROYECTO
    router.get('/proyectViaticos', authController.isAuthenticated, authController.selectProyect, authController.datosViaticosProyectos, authController.selectDepositosProyecto, authController.selectComprobacionesProyecto, (req, res)=>{
        res.render('Proyectos/Viaticos/viaticosAdmin', {user: req.user, proyecto: req.proyecto, datos: req.datos, depositos: req.depositos, comprobaciones: req.comprobaciones, flag: req.query.flag, ubicacion: req.query.ubicacion, cliente: req.query.cliente})
    })
    router.get('/formassignViatics', authController.isAuthenticated, authController.selectRolesProyecto, (req, res)=>{
        res.render('Proyectos/Viaticos/assignViaticos', {user: req.user, roles: req.roles, proyecto: req.query.proyecto, cliente: req.query.cliente, ubicacion: req.query.ubicacion, flag: req.query.flag })
    })
    router.get('/exportDataProyecto', authController.isAuthenticated, authController.selectDepositosProyecto, authController.selectComprobacionesProyecto, (req, res)=>{
        res.render('Proyectos/Viaticos/exportData', {user: req.user, proyecto: req.query.proyecto, data: req.query.data, depositos: req.depositos, comprobaciones: req.comprobaciones, flag: req.query.flag, ubicacion: req.query.ubicacion, cliente: req.query.cliente})
    })
    router.get('/definirPresupuesto', viaticosController.definirPresupuesto)
    router.get('/deleteDepositoViaticosProyecto', viaticosController.deleteDepositoProyect)
    router.get('/deleteComprobanteProyecto', viaticosController.deleteComprobanteProyecto)
    router.post('/assignViaticsProy', viaticosController.assignViaticosProyect)

//VIATICOS - PERSONAL
    router.get('/adminViaticosPersonal', authController.isAuthenticated, authController.selectUser, viaticosController.selectDepositosUsuario, viaticosController.selectComprobacionesUsuario, (req, res)=>{
        res.render('Viaticos/adminViaticosPersonal', {user: req.user, usuario: req.usuario, depositos: req.depositos, comprobaciones: req.comprobaciones, inicio: req.query.inicio, termino: req.query.termino})
    })
    router.get('/formLoadTicket', authController.isAuthenticated, viaticosController.selectClavesUsuario, (req, res)=>{
        res.render('Viaticos/loadTicket', {user: req.user, claves: req.claves, claveSelected: req.query.clave})
    })
    router.get('/seguimientoClaves', authController.isAuthenticated, authController.selectClaveUsuario, authController.selectClave, authController.selectComprobantesClave, (req, res)=>{
        res.render('Viaticos/seguimientoClaves', {user: req.user, claves: req.claves, claveSelected: req.clave, rendido: req.rendido, comprobaciones: req.comprobaciones, isClave: req.query.clave})
    })
    router.get('/exportDataUsuario', authController.isAuthenticated, viaticosController.selectDepositosUsuario, viaticosController.selectComprobacionesUsuario, (req, res)=>{
        res.render('Viaticos/exportData', {user: req.user, depositos: req.depositos, comprobaciones: req.comprobaciones, data: req.query.data, usuario: req.query.usuario, clave: req.query.clave})
    })
    router.get('/exportDataClaves', authController.isAuthenticated, authController.selectComprobantesClave, (req, res)=>{
        res.render('Viaticos/exportData', {user: req.user, comprobaciones: req.comprobaciones, data: req.query.data, usuario: req.query.usuario, clave: req.query.clave})
    })
    router.get('/deleteComprobanteUsuario', viaticosController.deleteComprobante)
    router.get('/deleteComprobanteClavePer', authController.deleteComprobanteClavePer)
    router.post('/loadTicket', viaticosController.loadTicket)

//VIATICOS - ADMINISTRADOR
    router.get('/adminViaticosGrl', authController.isAuthenticated, viaticosController.stadisticsViatics, viaticosController.selectDepositos, viaticosController.selectComprobaciones, (req, res)=>{
        res.render('Viaticos/viaticosAdmin', {user: req.user, datos: req.datos, depositos: req.depositos, comprobaciones: req.comprobaciones, inicio: req.query.inicio, termino: req.query.termino})
    })
    router.get('/exportData', authController.isAuthenticated, viaticosController.selectDepositos, viaticosController.selectComprobaciones, (req, res)=>{
        res.render('Viaticos/exportData', {user: req.user, depositos: req.depositos, comprobaciones: req.comprobaciones, data: req.query.data, usuario: req.query.usuario})
    })
    router.get('/asignacionViaticos', authController.isAuthenticated, authController.selectUsers, authController.selectProyectos, (req, res)=>{
        res.render('Viaticos/formAsignViatics', {user: req.user, usuarios: req.usuarios, proyectos: req.proyectos})
    })
    router.get('/adminClaves', authController.isAuthenticated, authController.selectUsers, authController.selectClaves, authController.selectClave, authController.selectComprobantesClave, (req, res)=>{
        res.render('Viaticos/adminClavesGrl', {user: req.user, usuarios: req.usuarios, claves: req.claves, claveSelected: req.clave, rendido: req.rendido, comprobaciones: req.comprobaciones, isClave: req.query.clave})
    })
    router.get('/deleteComprobanteGrl', viaticosController.deleteComprobanteGrl)
    router.get('/deleteComprobanteClaveGrl', authController.deleteComprobanteClaveGrl)
    router.get('/deleteDepositoGrl', viaticosController.deleteDepositoGrl)
    router.post('/assignViatics', viaticosController.assignViaticos)


module.exports = router