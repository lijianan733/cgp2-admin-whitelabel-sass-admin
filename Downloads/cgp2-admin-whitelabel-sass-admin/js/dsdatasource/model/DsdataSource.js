/**
 * Created by admin on 2019/4/11.
 */
Ext.define("CGP.dsdatasource.model.DsdataSource", {
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
            name: 'type',
            type: 'string'
        },
        {
            name: 'version',
            type: 'int'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'selectors',
            type: 'array'
        },
        {
            name:'comboDisplay',
            type:'string',
            convert:function (v,rec){
                return '<'+rec.get('_id')+'>'+rec.get('description')
            }
        }
    ],
    autoLoad: true,

    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/dynamicsize/datasources',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});