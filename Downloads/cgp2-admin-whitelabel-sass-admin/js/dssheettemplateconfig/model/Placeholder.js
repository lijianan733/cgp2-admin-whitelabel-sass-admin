/**
 * Created by admin on 2019/4/11.
 */
Ext.define("CGP.dssheettemplateconfig.model.Placeholder", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'selector',
            type: 'string',
            useNull:true
        },
        {
            name: 'expression',
            type: 'string'
        },
        {
            name: 'attributes',
            type: 'array',
            useNull:true
        },
//        {
//            name: 'attrstring',
//            convert:function fullName(v, record){
//                return record.attributes.toString();
//            },
//            readonly:true
//        },
        {
            name: 'description',
            type: 'string'
        }
    ]
});