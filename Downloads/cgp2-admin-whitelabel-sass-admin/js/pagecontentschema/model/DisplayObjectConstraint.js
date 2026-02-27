/**
 * pagecontentschema model
 */
Ext.define('CGP.pagecontentschema.model.DisplayObjectConstraint',{
    extend : 'Ext.data.Model',
    idProperty : '_id',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields : [ {
        name : '_id',
        type : 'string',
        useNull: true
    },{
        name:'selector',
        type:'string'
    },{
        name:'selectable',
        type:'boolean'
    },{
        name:'copyable', //
        type:'boolean'
    },{
        name: 'deletable',
        type: 'boolean'
    },{
        name:'lockMovementX', //
        type:'boolean',
        defaultValue: true
    },{
        name: 'lockMovementY',
        type: 'boolean',
        defaultValue: true
    },{
        name: 'resizable',
        type: 'boolean',
        defaultValue: true
    },{
        name: 'rotatable',
        type: 'boolean',
        defaultValue: true
    },{
        name: 'uniformScale',
        type: 'boolean',
        defaultValue: false
    },{
        name: 'transformable',
        type: 'boolean',
        defaultValue: false
    },{
        name: 'maxHeight',
        type: 'int'
    },{
        name: 'minHeight',
        type: 'int'
    },{
        name: 'minWidth',
        type: 'int'
    },{
        name: 'maxWidth',
        type: 'int'
    }]
});

