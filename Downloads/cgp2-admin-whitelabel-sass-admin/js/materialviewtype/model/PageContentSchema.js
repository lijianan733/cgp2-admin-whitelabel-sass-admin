/**
 * pagecontentschema model
 */
Ext.define('CGP.materialviewtype.model.PageContentSchema',{
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
        name:'code',
        type:'string'
    },{
        name:'name',
        type:'string'
    },{
        name: 'displayName',
        type: 'string',
        convert:function(value,record){
            var name = record.get('name');
            if(record.get('name')){
                return name+'('+record.get('_id')+')'
            }else{
                return record.get('_id')
            }
        }
    },{
        name:'clazz', //
        type:'string',
        defaultValue: domainObj.PageContentSchema
    },{
        name: 'templateId',
        type: 'string'
    },{
        name:'width', //
        type:'int'
    },{
        name: 'height',
        type: 'int'
    },{
        name: 'clipPath',
        type: 'object',
        defaultValue: undefined
    },{
        name: 'priceAreas',
        type: 'array',
        defaultValue: undefined
    },{
        name: 'layers',
        type: 'array',
        defaultValue: undefined
    },{
        name: 'canvases',
        type: 'array',
        defaultValue: undefined
    },{
        name: 'displayObjectConstraints',
        type: 'array',
        defaultValue: undefined
    },{
        name: 'pageContentSchemaGroup',
        type: 'object',
        defaultValue: undefined
    },{
        name: 'pageContentItemPlaceholders',
        type: 'array',
        defaultValue: undefined
    },{
        name: 'rtType',
        type: 'object',
        defaultValue: undefined
    },{
        name: 'description',
        type: 'string'
    }],
    /**
     * @cfg {Ext.data.Proxy} proxy
     * model proxy
     */
    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/pageContentSchemas',
        reader:{
            type:'json',
            root:'data'
        }
    }
});

