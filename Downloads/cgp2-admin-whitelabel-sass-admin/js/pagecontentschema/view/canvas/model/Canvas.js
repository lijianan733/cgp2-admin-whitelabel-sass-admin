Ext.define('CGP.pagecontentschema.view.canvas.model.Canvas', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [
        {
            name: '_id',
            type: 'string'
        }, {
            name: 'constraints',
            type: 'object'
        }, {//意图
            name: 'intentions',
            type: 'array'
        }, {
            name: 'containPath',
            type: 'object'
        },
        {
            name: 'clazz',
            type: 'string',
            value: 'Canvas'
        },
        {
            name: 'description',
            type: 'string'
        }]
});

