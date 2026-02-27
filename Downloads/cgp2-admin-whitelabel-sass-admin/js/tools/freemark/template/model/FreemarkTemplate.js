/**
 * Created by admin on 2020/8/12.
 */
Ext.define("CGP.tools.freemark.template.model.FreemarkTemplate", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue:'com.qpp.composing.domain.freemarker.DefineVariableTemplate'
        },
        {
            name: 'items',
            type: 'array'
        },
        {
            name:'contextSource',
            type:'object'
        },
        // {
        //     name: 'productId',
        //     type: 'number'
        // },
        {
            name: 'description',
            type: 'string'
        }
    ],
    autoLoad: true,

    proxy: {
        type: 'uxrest',
        url: composingPath + 'api/freemarker/templates',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});