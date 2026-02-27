/**
 * Created by admin on 2019/4/11.
 */
Ext.define("CGP.dsdatasource.model.Selector", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [
        {
            name: 'key',
            type: 'string'
        },
        {
            name: 'selector',
            type: 'string'
        },
        {
            name: 'urlTemplateId',
            type: 'int'
        },
        {
            name: 'attr',
            type: 'string'
        },
        {
            name: 'converter',
            type: 'string'
        },
        {
            name: 'svgWidthOffset',
            type: 'string'
        },
        {
            name: 'svgHeightOffset',
            type: 'string'
        },
        {
            name: 'strokWidth',
            type: 'string'
        }
    ]
});