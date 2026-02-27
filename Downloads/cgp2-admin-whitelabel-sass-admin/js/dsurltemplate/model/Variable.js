
Ext.define("CGP.dsurltemplate.model.Variable", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'value',
            type: 'string'
        },
        {
            name: 'valueSelector',
            type: 'string'
        },
        {
            name: 'expression',
            type: 'string'
        }
    ]
});