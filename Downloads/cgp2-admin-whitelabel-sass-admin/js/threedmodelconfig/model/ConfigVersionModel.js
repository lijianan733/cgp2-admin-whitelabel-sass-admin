Ext.define("CGP.threedmodelconfig.model.ConfigVersionModel",{
    extend : 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    }, {
        name: 'version',
        type: 'int'
    }, 'status', 'engine',{
        name: 'structVersion',
        type: 'string'
    },{
        name: 'bgColor',
        type: 'string'
    },{
        name: 'modelFileName',
        type: 'string'
    },{
        name: 'minZoom',
        type: 'number'
    },{
        name: 'maxZoom',
        type: 'number'
    },{
        name: 'defaultZoom',
        type: 'number'
    },{
        name: 'zoomStep',
        type: 'number'
    },{
        name: 'camera',
        type: 'object'
    },{
        name: 'views',
        type: 'array'
    },{
        name: 'model',
        type: 'object'
    },{
        name: 'threeDModel',
        type: 'object'
    },{
        name: 'clazz',
        type: 'string'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/threedmodelvariableconfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});